#!/usr/bin/env python3
"""ai_generate_commit.py

Automates the workflow:
1️⃣ Detect changed files (or use a prompt to generate code).
2️⃣ Ask an LLM (OpenAI) for a unified diff.
3️⃣ Apply the diff, run lint & tests.
4️⃣ Commit on a new branch, push, and open a PR.
5️⃣ Add the PR (or an Issue) as a card to a GitHub Project (v2).

All secrets / configuration are read from environment variables:
- ``GH_PAT``                – Personal Access Token with scopes ``repo`` and ``project``.
- ``OPENAI_API_KEY``        – OpenAI API key.
- ``GITHUB_REPOSITORY``     – ``owner/repo`` (provided by GitHub Actions).
- ``PROJECT_V2_ID``         – ID of the GitHub Project (v2) where the card will be created.
- ``PROJECT_FIELD_ID``      – (optional) ID of the single‑select field (e.g., "Status").
- ``PROJECT_OPTION_TODO``   – (optional) ID of the option representing the "To‑Do" column.

If any of the optional IDs are omitted the script will query the Project to discover the first
single‑select field and its first option, which is usually the "To‑Do" column.
"""

import os, sys, subprocess, json
from pathlib import Path
import requests
import openai
from git import Repo

# -------------------------------------------------
# 1️⃣ Configuration & helpers
# -------------------------------------------------
GH_PAT              = os.getenv("GH_PAT")
# Dukungan 9router / OpenAI Compatible API
AI_API_KEY          = os.getenv("ROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")
AI_BASE_URL         = os.getenv("ROUTER_BASE_URL", "https://api.9router.com/v1")  # Sesuaikan base url 9router Anda
AI_MODEL            = os.getenv("ROUTER_MODEL", "9router-combo")                  # Model dari 9router

REPO_PATH           = Path(".")
PROJECT_V2_ID       = os.getenv("PROJECT_V2_ID")          # required
PROJECT_FIELD_ID    = os.getenv("PROJECT_FIELD_ID")      # optional
PROJECT_OPTION_TODO = os.getenv("PROJECT_OPTION_TODO")    # optional

if not GH_PAT or not AI_API_KEY or not PROJECT_V2_ID:
    sys.exit("❌ Missing required environment variables: GH_PAT, ROUTER_API_KEY (or OPENAI_API_KEY), PROJECT_V2_ID")

openai.api_key = AI_API_KEY
openai.api_base = AI_BASE_URL

def run_cmd(cmd: list[str]):
    """Run a shell command, raise on error, return stdout as string."""
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return result.stdout.strip()

# -------------------------------------------------
# 2️⃣ Determine which files need generation
# -------------------------------------------------
def get_changed_files() -> list[Path]:
    """Return a list of files changed in the last commit (HEAD~1..HEAD)."""
    out = run_cmd(["git", "diff", "--name-only", "HEAD~1"])
    files = [REPO_PATH / p for p in out.splitlines() if p]
    return files

# -------------------------------------------------
# 3️⃣ Build prompt for the LLM
# -------------------------------------------------
def build_prompt(changed: list[Path]) -> str:
    file_list = "\n".join([f"- {p}" for p in changed])
    prompt = (
        "You are a senior TypeScript developer. Generate implementations for the following changed files. "
        "Return a **single unified diff** (git format) that can be applied with `git apply`. "
        "Do not include any explanations or markdown – only the diff text.\n\n"
        f"Changed files:\n{file_list}\n"
    )
    return prompt

# -------------------------------------------------
# 4️⃣ Call the LLM
# -------------------------------------------------
def generate_diff(prompt: str) -> str:
    response = openai.ChatCompletion.create(
        model=AI_MODEL,
        messages=[{"role": "system", "content": "You are a code‑generation assistant."},
                  {"role": "user", "content": prompt}],
        max_tokens=2000,
        temperature=0.0,
    )
    return response.choices[0].message.content.strip()

# -------------------------------------------------
# 5️⃣ Apply diff and run checks
# -------------------------------------------------
def apply_diff(diff_text: str):
    diff_path = REPO_PATH / "tmp.diff"
    diff_path.write_text(diff_text)
    # Apply with minimal whitespace warnings
    subprocess.run(["git", "apply", "--whitespace=nowarn", str(diff_path)], check=True)
    diff_path.unlink()

def run_checks():
    # Adjust commands to your project (npm, yarn, etc.)
    subprocess.run(["npm", "run", "lint"], check=True)
    subprocess.run(["npm", "run", "test"], check=True)

# -------------------------------------------------
# 6️⃣ Commit, push and create PR
# -------------------------------------------------
def commit_and_push(branch: str) -> int:
    repo = Repo(REPO_PATH)
    repo.git.checkout("-b", branch)
    repo.git.add(update=True)
    repo.index.commit("🤖 AI‑generated implementation")
    origin = repo.remote(name="origin")
    origin.push(refspec=f"{branch}:{branch}")
    # Return the PR number after creation (handled later)
    return 0

def create_pr(branch: str) -> dict:
    api_url = f"https://api.github.com/repos/{os.getenv('GITHUB_REPOSITORY')}/pulls"
    payload = {
        "title": "🤖 AI‑generated changes",
        "head": branch,
        "base": "main",
        "body": "Generated by AI (OpenAI). Please review before merging."
    }
    headers = {"Authorization": f"token {GH_PAT}"}
    r = requests.post(api_url, json=payload, headers=headers)
    r.raise_for_status()
    return r.json()  # contains number, html_url, node_id, etc.

# -------------------------------------------------
# 7️⃣ Helper to fetch node_id of PR (GraphQL ID)
# -------------------------------------------------
def get_node_id_of_pr(pr_number: int) -> str:
    api = f"https://api.github.com/repos/{os.getenv('GITHUB_REPOSITORY')}/pulls/{pr_number}"
    headers = {"Authorization": f"token {GH_PAT}"}
    r = requests.get(api, headers=headers)
    r.raise_for_status()
    return r.json()["node_id"]

# -------------------------------------------------
# 8️⃣ Add card to GitHub Project (v2)
# -------------------------------------------------
def add_to_project(project_id: str, content_node_id: str, content_type: str = "PullRequest"):
    """Add a PR or Issue to a Project v2 and set its status to the first option (usually To‑Do)."""
    graphql_url = "https://api.github.com/graphql"
    headers = {
        "Authorization": f"Bearer {GH_PAT}",
        "Accept": "application/vnd.github+json"
    }

    # 1️⃣ Add the item to the project
    add_mutation = """
    mutation($projectId: ID!, $contentId: ID!, $contentType: ProjectV2ItemContentType!) {
      addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId, contentType: $contentType}) {
        item { id }
      }
    }
    """
    variables = {"projectId": project_id, "contentId": content_node_id, "contentType": content_type}
    resp = requests.post(graphql_url, json={"query": add_mutation, "variables": variables}, headers=headers)
    resp.raise_for_status()
    item_id = resp.json()["data"]["addProjectV2ItemById"]["item"]["id"]

    # 2️⃣ Determine field & option (Status column). If user supplied, use them.
    field_id = PROJECT_FIELD_ID
    option_id = PROJECT_OPTION_TODO
    if not field_id or not option_id:
        # Query first single‑select field and its first option
        field_query = """
        query($projectId: ID!) {
          node(id: $projectId) {
            ... on ProjectV2 {
              fields(first: 10) {
                nodes {
                  ... on ProjectV2SingleSelectField {
                    id
                    name
                    options(first: 10) { nodes { id name } }
                  }
                }
              }
            }
          }
        }
        """
        resp = requests.post(graphql_url, json={"query": field_query, "variables": {"projectId": project_id}}, headers=headers)
        resp.raise_for_status()
        fields = resp.json()["data"]["node"]["fields"]["nodes"]
        # Pick the first single‑select field (commonly "Status")
        ss_field = next((f for f in fields if f.get("options")), None)
        if not ss_field:
            raise RuntimeError("❌ No single‑select field found in the project.")
        field_id = ss_field["id"]
        option_id = ss_field["options"]["nodes"][0]["id"]  # first option (usually To‑Do)

    # 3️⃣ Update the field value to the chosen option
    update_mutation = """
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: ID!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId,
        itemId: $itemId,
        fieldId: $fieldId,
        value: { singleSelectOptionId: $optionId }
      }) {
        projectV2Item { id }
      }
    }
    """
    vars = {
        "projectId": project_id,
        "itemId": item_id,
        "fieldId": field_id,
        "optionId": option_id,
    }
    resp = requests.post(graphql_url, json={"query": update_mutation, "variables": vars}, headers=headers)
    resp.raise_for_status()
    print(f"✅ Added {content_type} to Project (ID {project_id}) in column option {option_id}")

# -------------------------------------------------
# 9️⃣ Main orchestration
# -------------------------------------------------
def main():
    changed = get_changed_files()
    if not changed:
        print("⚠️ No changed files detected – exiting.")
        sys.exit(0)

    prompt = build_prompt(changed)
    diff   = generate_diff(prompt)
    print("--- Diff preview (first 200 chars) ---")
    print(diff[:200] + ("..." if len(diff) > 200 else ""))

    apply_diff(diff)
    run_checks()

    branch_name = f"ai/generated-{run_cmd(['git','rev-parse','--short','HEAD'])}"
    commit_and_push(branch_name)
    pr_info = create_pr(branch_name)
    pr_number = pr_info["number"]
    pr_node_id = pr_info["node_id"]
    print(f"✅ PR created: {pr_info['html_url']}")

    # Add the PR as a card to the GitHub Project
    add_to_project(PROJECT_V2_ID, pr_node_id, content_type="PullRequest")

if __name__ == "__main__":
    main()

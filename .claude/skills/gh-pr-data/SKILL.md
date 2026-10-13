---
name: gh-pr-data
description: Fetch Highcharts pull request data with the `gh` CLI for code review - PR details, diff, author permission, linked issues, duplicate PRs, CI checks and open PR count.
---

# GitHub PR Data with `gh`

Use this skill when a review needs pull request data and the `gh` CLI is available. With other GitHub tools, such as the GitHub MCP, fetch the same data with those tools instead.

All commands are read-only. Replace `<number>`, `<login>` and `<issue>` with real values.

| Data | Command |
|---|---|
| PR details | `gh pr view <number> --json title,body,labels,author,isDraft,closingIssuesReferences` |
| Diff | `gh pr diff <number>` |
| Author permission | `gh api repos/highcharts/highcharts/collaborators/<login>/permission --jq .permission` |
| Linked issue | `gh issue view <issue> --json title,body,labels` |
| Other PRs for an issue | `gh pr list --state open --search "<issue>" --json number --jq '.[].number'` |
| CI checks | `gh pr checks <number>` |
| Author's open PRs, drafts included | `gh pr list --state open --author <login> --json number --jq length` |

Notes:

- `<login>` is `author.login` from the PR details.
- Linked issues are in `closingIssuesReferences`. Also check the description for issue references such as `#1234`.
- A `Type: Bug` label marks a bug report.
- The search for other PRs also returns the PR under review. Leave it out.
- The permission call needs read access to the repository's collaborators. If it fails, say so instead of guessing.

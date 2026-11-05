---
name: gh-pr-data
description: Use this skill when reviewing a Highcharts pull request and the `gh` CLI is available, to fetch PR details, diff, author permission, linked issues, duplicate PRs, CI checks and the author's open PR count. Don't use it when GitHub MCP or built-in GitHub tools are available; fetch the same data with those.
---

# GitHub PR Data with `gh`

All commands are read-only. Never run `gh` commands that comment, review, edit, merge or close.

## Steps

1. Fetch the PR details first. The other commands need `<login>` and `<issue>` from them.
2. Run only the commands the review needs.
3. If a command fails, report the data as unavailable. Don't guess.

| Data | Command |
|---|---|
| PR details | `gh pr view <number> --json title,body,labels,author,isDraft,isCrossRepository,closingIssuesReferences` |
| Diff | `gh pr diff <number>` |
| Author permission | `gh api repos/highcharts/highcharts/collaborators/<login>/permission --jq .permission` |
| Linked issue | `gh issue view <issue> --json title,body,labels,state,stateReason` |
| Other PRs for an issue | `gh pr list --state open --search "<issue>" --json number,title` |
| CI checks | `gh pr checks <number>` |
| Author's open PRs, drafts included | `gh pr list --state open --author <login> --json number --jq length` |

## Gotchas

- `<login>` is `author.login`. Linked issues are in `closingIssuesReferences`; also check the description for references such as `#1234`.
- Permission `admin`, `maintain` or `write` means the author is on the team. `triage`, `read` or `none` means external.
- A `Type: Bug` label on the issue marks a bug report. `Type: Not a bug` means it isn't one; flag it.
- A closed issue, for example closed as a duplicate, is worth flagging: the PR may fix something maintainers already resolved.
- The search for other PRs returns the PR under review too; leave it out. It also matches PRs that only mention the number, so check the titles.
- `gh pr checks` exits with an error when checks fail or are pending. Read its output; it is not a command failure.
- "no checks reported" on a PR from a fork (`isCrossRepository` is true) usually means a maintainer hasn't approved the workflows yet. Report that, not a CI failure.

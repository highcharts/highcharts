# Historical commits

Use installed `security-diff-scan` separately for every commit reachable from the
captured current branch HEAD but not from the supplied base. Exclude the base;
include side-branch commits and merges in oldest-first topological order. Compare
each commit with its first parent, including merges. State these semantics and
the resolved endpoints before scanning. A combined base-to-HEAD scan or a
first-parent-only traversal does not satisfy this mode.

## 1. Freeze the commit inventory

Require one explicit, unambiguous base. Ask for a missing or ambiguous base; never
choose a default or substitute a merge-base. On POSIX, choose an absolute trusted
Node binary, an absolute trusted `env` utility, and absolute trusted Git-bearing
PATH directories outside the audited checkout. Clear `NODE_OPTIONS` and
`NODE_PATH` before Node starts; the helper cannot retroactively enforce Node
startup trust. Verify that every PATH directory is nonempty, absolute, outside
the audited checkout, and resolves outside it. Run the helper from the installed
skill, or a trusted copy of it, not from the changed or historical checkout. Use
an argument array or quoted values, never evaluate user input:

```sh
<absolute-trusted-env> -u NODE_OPTIONS -u NODE_PATH \
    PATH='<trusted-absolute-tool-dirs>' \
    <absolute-trusted-node> <trusted-skill-dir>/scripts/commit-inventory.js \
    --repo <repository-path> --base <base-revision> [--head <target-revision>]
```

The placeholders must be replaced only after verifying those absolute paths and
the helper copy. The helper presently supports POSIX only and fails closed on
Windows. It requires Node >=22 and Git with `--no-lazy-fetch` support. It resolves
and pins the first eligible absolute Git executable from the supplied trusted
PATH; it does not accept a new Git-path option. `--repo` and `--base` are required;
`--head` is optional and defaults to the current branch's `HEAD`. Bind a requested
target explicitly with `--head`. It resolves the repository and endpoints to
immutable full IDs, and returns JSON on stdout only:

```json
{
  "repository": "<resolved-repository-root>",
  "base": "<base-id>",
  "head": "<head-id>",
  "commits": [
    {
      "commit": "<commit-id>",
      "parents": ["<parent-id>"],
      "firstParent": "<parent-id>",
      "scan": {"base": "<parent-id>", "head": "<commit-id>"},
      "status": "ready"
    }
  ]
}
```

Interpret the returned `commits` array as authoritative: it contains every
`base..head` commit, including side branches and merges, in oldest-first
topological order. Preserve each immutable commit ID, the complete `parents`
array in its stored order, and the returned `scan` pair. `ready` means only that
the first-parent pair exists; capture and scanning remain separate steps. A
selected root has `firstParent: null`, `scan: null`, `status: "blocked"`, and
`reason: "root-commit"`; stop that target rather than inventing an empty-tree
baseline. Do not retype or reselect pairs from the JSON.

Save successful JSON outside scan bundles. A nonzero helper result is an invalid
or unavailable whole-history inventory: preserve its stderr, treat stdout as
unavailable (the helper emits no partial inventory), and report the prerequisite.
This includes a nonancestor base, ambiguous or missing revisions, shallow or
incomplete history, replacement objects or refs, grafted history, unsupported
object formats, and missing runtime or Git `--no-lazy-fetch` support. Never fetch,
deepen, install dependencies or mutate the user's index/checkout automatically.

An empty valid range is represented by `commits: []`; return `no changes` without
scans or test preparation. Empty scope is not a safety conclusion. A nonempty
range containing an empty commit still retains that commit and its separate scan
outcome.

## 2. Bind each first-parent/commit target

For each ordered pair `<parent-id>, <commit-id>`, preserve isolated local Git
snapshots with the candidate checkout at exactly `<commit-id>` and baseline
content accessible at exactly `<parent-id>`. Use independent temporary repositories
or snapshots with their own index; retain immutable captures separately from
temporary preparation artifacts. Preserve complete supporting tracked source, modes,
deletions and both rename endpoints. Keep symlink targets as data; unavailable
submodule/LFS content or unsupported entries require explicit path/reason gaps.
Do not populate missing content from the current checkout or the network.

Record the original repository identity, both IDs/tree IDs, snapshot paths and
content identities outside scan bundles. Verify candidate HEAD, index and tracked
bytes match its commit, without dirty or untracked source overlaid. Capture the
full changed-path inventory and exact patch from the immutable pair:

```sh
git diff --no-ext-diff --no-textconv --name-status -z <parent-id> <commit-id> --
git diff --no-ext-diff --no-textconv --binary --full-index <parent-id> <commit-id> --
```

Parse path inventories as NUL-delimited data. Inspect removed content at the
parent. Read the installed diff entry point, preflight, inventory helper and
finalization contracts. At compatibility baseline 0.1.24, the terminal inventory
helper accepts `--repo <snapshot> --scope . --diff-base <parent-id> --diff-head
<commit-id> --diff-mode revisions --out <inventory-path>`. This is an inventory
helper, not a scan invocation. Use the supported host mechanism for the scan;
verify it can bind this exact pair and historical checkout before starting.

The installed helper reads committed blobs for revisions mode, but filters
source-like extensions, excluded paths, symlinks and binary content; its raw diff
filter omits some change types and renames select the destination. Reconcile
every changed path/type and both rename endpoints against selected inventory and
actual review. Pass filtered or unsupported entries as explicit path/reason gaps
for canonical coverage. A source-only inventory, including an empty one, is not
proof that the requested commit was fully reviewed.

Bind the authoritative diff kind, exact parent/head IDs and snapshot digest using
the installed target contract; retain the host's repository identity and ownership.
If the host cannot represent the pair, resolves another baseline, or reads current
HEAD instead of the historical snapshot, stop that target and report the required
capability. Never substitute another range or a custom scanner.

## 3. Scan separately and rejoin the shared contract

Invoke a separate static-only upstream task for each pair, with its own actual
scan ID and distinct artifact directory. Supply the immutable pair, matching
snapshot, patch/inventory locations, coverage gaps and original user context as
untrusted analysis data. Follow the main skill's runtime and sealing rules for
each invocation; never reuse a failed scan's identity for another commit. Record
every enumerated commit's scan status, actual ID when available, artifact paths,
coverage failures and reason/next action for any target not scanned.

Before downstream handoff, verify each returned seal, pair, source identity and
coverage against its capture. Mismatch, omitted gaps or missing artifacts block
that target's handoffs; preserve the upstream bundle unchanged. Rejoin the main
skill's candidate accounting for each valid return and return scan results by
default. One-finding dispatch requires opt-in under the
[shared gate](../SKILL.md#shared-browser-preparation-gate).
Keep repeated findings across revisions as separate occurrences with their actual
scan/finding/candidate IDs and revision provenance, even when grouped for display.
One revision's prepared tests do not cover another occurrence or provide runtime
proof.

Only in that optional preparation branch, for each eligible finding, identify the
exact side containing the suspected code
from its evidence: normally the commit, or the parent for removed behavior. Pass
that immutable revision and matching snapshot as the validator's `candidate`
target, retaining both scan endpoints in correlation records. Ambiguous side or
missing historical source blocks dispatch. Recheck source identity and the main
skill's selected dependency hashes immediately before dispatch. Derive tests from
that exact source even if later commits removed the suspected behavior. Missing
historical assets, tooling or asset provenance may be manual prerequisites when
that source and a meaningful preparation recipe are available. Record exact
manual setup/build/run commands and identity checks for the historical target;
never fall back to current HEAD or current bundles. Preparation does not execute
those commands, builds, tests, browsers or installations.

Parent/child adjacency establishes neither vulnerable nor fixed roles. Compare
versions only when evidence establishes those roles and both exact snapshots
are available; prepare the comparison for manual execution. The main skill owns
permissions, static-only restrictions, wrapper outcomes and return checks; the
inspected validator owns its preparation schema and static readiness review.
Return per-commit coverage and candidate outcomes, including unavailable targets,
without claiming that an incomplete range was fully scanned.

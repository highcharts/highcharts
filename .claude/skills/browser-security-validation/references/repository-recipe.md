# Repository recipe

Use this reference while preparing tests. Commands below are patterns to adapt
into exact manual commands; do not execute browser tests, builds or servers.

## Existing infrastructure

Inspect current files before choosing paths or commands:

- `tests/README.md`, `tests/AGENTS.md`, `playwright.config.ts` and `package.json`:
  runner setup, commands, constraints and supported Node version.
- `tests/fixtures.ts`: `test`, `expect`, `createChart` and local asset routing.
  Fulfilled CDN URLs are local fixtures; routing is not an automatic outbound
  denylist. Review it before reuse.
- `tests/highcharts/`, `tests/grid/`, `tests/dashboards/`: public API examples.
- `samples/unit-tests/ast/ast/demo.js` and
  `samples/unit-tests/svgrenderer/xss/demo.js`: sanitizer/XSS assertions;
  `tests/qunit/` runs samples through Playwright.

| Product | Chromium project | Setup project | Typical bundle |
| --- | --- | --- | --- |
| Core | `highcharts` | `setup-highcharts` | `code/highcharts.src.js` |
| Grid Lite | `grid-lite` | `setup-grid-lite` | `code/grid/grid-lite.src.js` |
| Grid Pro | `grid-pro` | `setup-grid-pro` | `code/grid/grid-pro.src.js` |
| Dashboards | `dashboards` | `setup-dashboards` | `code/dashboards/dashboards.src.js` |

Product projects have `-firefox` and `-webkit` variants. Inspect setup tasks:
Grid/Dashboards may build dependent products. Supply only the necessary manual
build commands. Build isolation includes caches: `tools/gulptasks/scripts.js`
writes `node_modules/_gulptasks_scripts.json`; symlinking a donor's entire
`node_modules` can mutate that checkout during a manual build.

Use a temporary Playwright config with explicit `testDir`, `testMatch`, projects,
output and reporter paths. Resolve fixture dependencies and TypeScript aliases
from the target checkout without broadening the main config's discovery. Avoid
inheriting unrelated setup projects or automatic report servers. Use installed
executables, for example, from the repository root:

```sh
./node_modules/.bin/playwright test --config=<absolute-temporary-config> --project=chromium
```

Replace placeholders with actual paths/project names in the handoff. Ensure the
commands select the supported Node binary and that imports resolve from the
temporary spec/config directory; locating the CLI alone does not establish this. Document
missing packages and browsers as prerequisites; do not supply commands that
silently install tools as part of the test run. Configure retries as zero so a
manual run has a predictable set of experiments.

If product fixtures cannot express the case, context-level route fulfillment
can supply a local page, HTTP origin, headers and assets without a server.
Create pages with that routed context, not `browser.newPage()`. Any required
loopback server must serve only case assets and close in teardown. Tests must
check the loaded asset identity against the recorded manifest and fail clearly
on drift; a hash without source provenance does not establish the tested revision.

## Browser protections and controls

Deliver CSP on the document response before scripts execute. Keep the trusted
harness script loadable without allowing the injected handler. Observe
`securitypolicyviolation` with a document event listener, not a Playwright
`page.on` event, and attach the recorded violations and page errors.

Feature-detect Trusted Types and prove enforcement with a known restricted sink.
Ensure the target element exists, compare the same assignment without enforcement
and check that rejection is Trusted Types-specific. Catching an arbitrary error
is not proof. Record policy names and any default policy; do not add a permissive
default policy to make the fixture work. Unsupported cases must be explicit.

Use fresh contexts for policy/revision comparisons and keep browser security
flags at their defaults. Exercise `javascript:` navigation and SVG namespaces
in the actual target context; do not execute the payload with `eval`. Record
origin, MIME type and embedding assumptions, and observe relevant new pages or
frames. An SVG loaded as an image and one opened as an active document have
different security implications.

Keep evidence separate from assertions: attach observations even when assertions
fail, and distinguish failed controls/setup from absent execution. Explain the
assertion direction for each case in the handoff. The generated suite's future
results do not update a sealed scan or automatically establish general safety.

## Result contract

`report.md` is a preparation handoff, not a browser validation report. State:

- **Not run**, the claim, attacker boundary and preparation status.
- Target revision, working-tree differences, asset paths/hashes and whether
  source identity was verified. Record missing provenance as a prerequisite.
- Prepared cases, controls, expected observations and pass/failure meaning.
- Required Node, dependencies, browsers and exact manual setup/run commands with
  working directories. Identify anything still unverified.
- Created test/config/fixture files, expected future evidence and limitations.

Use `preparationStatus: ready` when the tests and handoff pass the skill's static
readiness review, even when explicit manual prerequisites remain. Use `blocked` when missing information or
permissions prevent meaningful test preparation, or the static review finds
unresolved defects in the generated tests. Always keep `verdict` as
`inconclusive`, `executionStatus` as `not_run`, `attemptsUsed` as zero and `cases`
as an empty array: no runtime case was observed. Preserve an incoming positive
integer `attemptBudget` as metadata, or use null; it grants no execution permission.
The additive fields retain the existing caller-facing schema while distinguishing
preparation from validation. Do not populate browser versions or observed effects.

```json
{
  "schemaVersion": 1,
  "claim": "The specific effect the tests will check",
  "preparationStatus": "ready",
  "executionStatus": "not_run",
  "verdict": "inconclusive",
  "summary": "Playwright tests prepared for manual execution; no browser evidence collected.",
  "attemptBudget": null,
  "attemptsUsed": 0,
  "prerequisites": [],
  "targets": [],
  "plannedCases": [],
  "cases": [],
  "limitations": [],
  "unrelatedLeads": [],
  "rerun": [],
  "artifacts": {
    "report": "report.md",
    "reproduction": [],
    "evidence": []
  }
}
```

Each target records `role` (`candidate`, `vulnerable` or `fixed`), `revision`,
`workingTreeChanges` and `assets` with `path`, `sha256` and `sourceVerified`.
Use null/false for facts not established. Each planned case records its name,
named uncertainty, browser, document context, policy, controls and expected
observations; these are plans, not observations. Each `rerun` entry contains
`cwd` and the exact manual `command`, in prerequisite order.

Artifact paths resolve from the result directory. `reproduction` lists only
created specs/configs/fixtures; `evidence` stays empty until a separate execution
task collects evidence. For blocked preparation, both reports are still required;
list partial artifacts only when created, and explain missing files in limitations.
Validate JSON syntax, field consistency, artifact existence and relative links
without running the prepared tests.

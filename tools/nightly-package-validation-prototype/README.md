# Nightly package validation prototype

This local prototype checks whether an assembled Highcharts npm package works
in an isolated consumer with pinned React, TypeScript, Vite, and Playwright
dependencies. [Asana specification](https://app.asana.com/1/222651295669536/project/1204879359430251/task/1220015315210745)

## Run

Use Node 26.13.0 and npm 11.20.0 for the spec's pinned toolchain. Install the
matching Playwright Chromium once from outside the source workspace if needed.

```sh
npm exec --yes --package=@playwright/test@1.61.1 -- playwright install chromium --only-shell
```

Pack an assembled nightly distribution in a scratch directory. Save the
`npm pack` inventory and record the tarball's SHA-256 at this step.

```sh
npm pack /absolute/path/to/assembled-distribution --ignore-scripts --json > pack.json
shasum -a 256 highcharts-*.tgz
```

From the repository root, pass the tarball and recorded digest to the runner.

```sh
node tools/nightly-package-validation-prototype/run.mjs <candidate.tgz> <expected-sha256>
```

The runner resolves npm's stable control once and installs both tarballs with
`npm ci` in separate temporary applications. Each application checks package
resolution, declarations, and a Vite production build. Playwright checks Core
annotations, a React-driven series update, and the Stock navigator in Chromium.
Maps and Gantt coverage is limited to entry files and TypeScript imports.

The runner prints the local evidence directory. It contains the tarballs,
manifests and locks, digests, build logs, bundled Highcharts module inventory,
and Playwright reports and failure traces.

## Add a product check

Stock imports `highcharts/highstock` from [its consumer page](app/stock.ts).
Add a page under `app/` and register it once in
[`browser-cases.mjs`](browser-cases.mjs) with a unique case name, page path,
expected bundled module paths, and a Chromium assertion. Vite uses that entry
as an input, and the runner requires exactly one successful execution of the
named case. The Stock assertion checks that the navigator outline is visible.

For entry-file and TypeScript-only coverage, add the public entry to the
file checks in [`run.mjs`](run.mjs) and the import and factory type to
[`app/products.ts`](app/products.ts). This fixture covers entries in the
assembled Highcharts package.

## Diagnose a Nightly failure

Open **Summarize nightly package validation** in the Actions run. It shows the
stable and candidate outcomes, the stage each reached, and the first available
diagnostic. The evidence link contains the full logs, browser reports, exact
tarballs, and build manifest. See the
[nightly workflow notes](../../.github/workflows/nightly.md) for rollout.

## Replay a Nightly attempt

From the repository root, run this with the run ID from the Actions URL and
the attempt number from the run:

```sh
node tools/nightly-package-validation-prototype/replay.mjs "$RUN_ID" "$ATTEMPT"
```

Use authenticated `gh` with read access to `highcharts/highcharts`, `unzip`,
the recorded Node and npm versions, and the pinned Playwright Chromium
installation from the **Run** section. Ensure npm can fetch the locked
dependencies. Use Linux x64 to match the Actions host when investigating
platform-specific failures.

The command downloads only the named attempt's validation evidence, verifies
its digests, and runs the same checks with the retained fixture, tarballs, and
locks. It installs with `npm ci` and uses the recorded stable release.
Replays require evidence captured after both locks were verified. If the
evidence has expired or the run predates replay support, the command stops
with a diagnostic. For an already extracted archive, add
`--artifact /path/to/extracted-evidence` to the same command.

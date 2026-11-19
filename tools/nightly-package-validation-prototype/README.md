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
Use this mode with packages you built from reviewed source because it installs
and runs them on your machine.

```sh
node tools/nightly-package-validation-prototype/run.mjs <candidate.tgz> <expected-sha256>
```

The runner resolves npm's stable control once and installs both tarballs with
`npm ci` in separate temporary applications. Each application checks package
resolution, declarations, and a Vite production build. Playwright checks Core
annotations, a React-driven series update, and the Stock navigator in Chromium.
Maps and Gantt coverage is limited to entry files and TypeScript imports.

The runner prints the local evidence directory. After both packages are staged,
their archives are in `candidate/candidate.tgz` and `control/control.tgz`.
The evidence also includes manifests, locks, digests, build logs, bundled module
inventories, and Playwright reports and failure traces.

The local tarball command checks the digest you supply. In Nightly, the runner
also verifies which build produced the candidate. For Highcharts it checks the
build manifest and npm pack inventory. For Grid Lite it checks the staging
manifest. After installation it compares the candidate's files and their
contents with the recorded package inventory.

## Validate Grid Lite locally

In a disposable source checkout at the revision under test, run `npm ci` and
`npx gulp dist --product Grid --skip-dist-compress`. Use the Node, npm, and
Chromium versions above. Set `SOURCE_CHECKOUT` to that checkout, `SOURCE_SHA`
to its commit, `GRID_LITE_DIST` to a local `grid-lite-dist` checkout, and
`METADATA_SHA` to the full commit to read release metadata from. Set `OUTPUT`
to a new directory in an existing scratch directory.

```sh
prototype=tools/nightly-package-validation-prototype
node "$prototype/stage-grid-lite.mjs" \
  "$SOURCE_SHA" "$SOURCE_CHECKOUT" "$GRID_LITE_DIST" "$METADATA_SHA" "$OUTPUT"
```

Use `tarball` and `tarballSha256` from the command's JSON output.

```sh
node "$prototype/run.mjs" "$TARBALL" "$SHA256" --package grid-lite
```

The pilot uses the Grid release task's assembly rules with metadata from
`METADATA_SHA`. It compares the packed candidate with an exact stable release
in separate consumers, checking package entries, types, and a production build.
Chromium verifies the packaged styling and column sorting.

The staged and packed file inventories are retained with the tarball. Missing
`main`, `module`, or `types` entries fail during consumer resolution.

If the build or npm packaging omits `css/grid-lite.css`, the candidate's Vite
build fails on the stylesheet import. To exercise the same failure deliberately,
repeat staging with `--missing-css` and a different output directory.
From the same reviewed checkout, replay the printed evidence directory in the
container described below:

```sh
node "$prototype/run.mjs" --replay "$EVIDENCE" --package grid-lite
```

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
diagnostic. If packing or Chromium setup fails first, it shows that step and
its diagnostic. The evidence link contains the full logs, browser reports, exact
tarballs, and build manifest. See the
[nightly workflow notes](../../.github/workflows/nightly.md) for rollout.

If you rerun only the summary, it can receive results from an earlier attempt.
It identifies that attempt and marks the current one as blocked. Rerun the
validation job and its dependent summary to get a verdict for the new attempt.

## Replay a Nightly attempt

For attempts that predate linked package evidence, capture a fresh attempt.
For a supported attempt, check out its reviewed source SHA in
a separate worktree using the same line endings as CI (LF). From that worktree,
run the command with the run ID from the Actions URL and the attempt number.

```sh
node tools/nightly-package-validation-prototype/replay.mjs "$RUN_ID" "$ATTEMPT"
```

For Grid Lite evidence from the same Nightly workflow, add `--package grid-lite`.
See the [Grid Lite pilot](../../.github/workflows/nightly.md#grid-lite-pilot)
for the dispatch inputs.

Use authenticated `gh` with read access to `highcharts/highcharts` and a
running Docker engine with Linux x64 support. Set
`NIGHTLY_REPLAY_CONTAINER=podman` to use Podman. On macOS, the Podman replay
stages its temporary inputs under your home directory, which Podman Machine
shares by default. The first run pulls pinned Node and Playwright images and
caches the npm dependencies from the local fixture's lockfile. That build needs
access to the image and npm registries.

The command verifies the named attempt and downloaded artifact digest. It
extracts the archive and runs `npm ci` and the consumer checks inside a
disposable container with networking disabled, a cleared environment and a
read-only input mount. It runs the fixture from the reviewed checkout and checks
its exact contents, runner and npm scripts against the recorded evidence. The
two lanes use the retained tarballs and locks, including the recorded stable
release. The command prints the lane results and browser failure logs. Full
logs and traces from the original run are available in the Actions evidence.

Replay requires evidence captured with the matching runner after both locks
were verified.
For an already extracted archive, add `--artifact /path/to/extracted-evidence`
to the same command. To replay an individual consumer evidence directory, use
`run.mjs --replay` as shown above. That command checks the same source revision,
runner and fixture and uses the same container.

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
npm pack /absolute/path/to/assembled-distribution --json > pack.json
shasum -a 256 highcharts-*.tgz
```

From the repository root, pass the tarball and recorded digest to the runner.

```sh
node tools/nightly-package-validation-prototype/run.mjs <candidate.tgz> <expected-sha256>
```

The runner resolves npm's stable control once and installs both tarballs with
`npm ci` in separate temporary applications. Each application checks package
resolution, declarations, and a Vite production build. Playwright checks Core
annotations and a React-driven series update in Chromium. Stock, Maps, and
Gantt coverage is limited to entry files and TypeScript imports.

The runner prints the local evidence directory. It contains the tarballs,
manifests and locks, digests, build logs, bundled Highcharts module inventory,
and Playwright reports and failure traces.

The nightly advisory job also records and verifies the assembled directory
inventory and retains the build manifest, pack inventory, tarball, and consumer
evidence together. See the [nightly workflow notes](../../.github/workflows/nightly.md)
for the manual pilot and schedule toggle. Automatic replay and full
installed-file verification are future work.

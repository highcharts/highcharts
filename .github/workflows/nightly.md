# Nightly distribution

`nightly_dist` builds the exact run SHA without distribution credentials. It
stages a fresh Core distribution using release metadata from the checked-out
`highcharts-dist` commit. The job verifies that the staged tree contains only
regular files and directories and rejects any `.git` entries. The artifact
includes release metadata and other hidden files.
`nightly_dist_publish` runs on `master` only, downloads that same run's artifact,
checks its file types, and signs and pushes from a separate runner. It never runs
build scripts or package lifecycle hooks. Other refs and `pushToDist: false`
still run the build and tests, without publishing. Publication requires the
distribution build, Node unit tests, Cypress, all-browser Playwright, and visual
comparison to succeed.

The distribution artifact and any build manifest are retained for 30 days so
partial retries can reuse the same build. The consumer validation evidence is
retained for 14 days.

## Advisory npm package validation

Dispatch **Nightly** with `validateDistribution: true` and
`pushToDist: false` for a manual pilot. Once the manual controls pass in
Actions, set the repository variable `NIGHTLY_PACKAGE_VALIDATION` to `true`
to include the lane in scheduled runs.

The build job records and uploads a build manifest when validation is enabled.
Its `metadataBefore` and `metadataAfter` fields identify the same metadata
commit for a staged build.
The validation job downloads the distribution and build manifest by artifact ID,
checks the directory digest, and packs the candidate once. It installs the
candidate and the stable npm control in separate fixtures and runs the consumer
checks. The run summary gives the advisory result and links to evidence. If
recording or uploading the manifest fails, the summary reports validation as
blocked. Check the `nightly_dist` job for the cause. After resolving it, start a
new validation run with distribution publishing disabled. Rerunning the build
and its dependents on a scheduled run can overwrite a newer nightly distribution.

Use a branch or tag pointing to the original source SHA as `REF` to rebuild
the same source. If recovery needs a source change, use the branch or tag
containing the fix.

```sh
gh workflow run nightly.yml --ref "$REF" -f validateDistribution=true -f pushToDist=false
```

For a same-source rebuild, confirm the new run's head SHA matches the original.
Use the new run's summary, run ID, and attempt for artifact replay. The recovery
artifacts are evidence for the new run.

## Grid Lite pilot

Dispatch **Nightly** with `validateGridLite: true` and `pushToDist: false`.
Run it again with `gridLiteMissingCss: true` to test the missing-stylesheet
diagnostic. The pilot runs alongside the existing Nightly jobs and skips
publication to Visual Review. The Grid Lite job builds and packs Grid Lite
using release metadata from a pinned
`grid-lite-dist` commit. Both the candidate and stable consumers check vanilla
Grid Lite, a React-driven data update using the same pinned
`@highcharts/grid-lite-react` release, and a separate JSX
Data/Column/Pagination case that renders a `Fruit` header and pages from two
fruits to the third. Open **Validate nightly Grid Lite npm
package** for the stable and candidate outcomes and the evidence link.

```sh
gh workflow run nightly.yml --ref "$REF" -f validateGridLite=true -f pushToDist=false
gh workflow run nightly.yml --ref "$REF" -f validateGridLite=true -f pushToDist=false -f gridLiteMissingCss=true
node tools/nightly-package-validation-prototype/replay.mjs "$RUN_ID" "$ATTEMPT" --package grid-lite
```

Confirm that the genuine candidate passes and that the synthetic candidate
fails at bundling on `@highcharts/grid-lite/css/grid-lite.css` while stable
passes. Replay the synthetic failure from a retained Actions attempt before
enabling scheduled Grid Lite validation. See the
[replay prerequisites](../../tools/nightly-package-validation-prototype/README.md#replay-a-nightly-attempt).

## Grid Pro pilot

The [Grid Pro package check](grid-pro-package-check.yml) runs automatically on
pull requests that change its fixture, shared validation code, or covered Grid
source and packaging paths. It builds the PR merge revision and packs Grid Pro
with the same release metadata and consumer fixture as Nightly. In the job
summary, compare the stable and candidate results. Both must reach Chromium,
where the fixture edits a quantity and reads the new number from the source
DataTable. The evidence artifact contains the tarball, locks, and diagnostics.

Dispatch **Nightly** on the branch under test with `validateGridPro: true`
for the genuine candidate or `gridProMissingCss: true` for a synthetic
candidate with the stylesheet removed. Either input starts Grid Pro validation
and skips publication to Visual Review and `highcharts-dist`. The job packs
Grid Pro with pinned release metadata and tests numeric cell editing in isolated
stable and candidate consumers. Open **Validate nightly Grid Pro npm package**
for the results and evidence.

```sh
gh workflow run nightly.yml --ref "$REF" -f validateGridPro=true
gh workflow run nightly.yml --ref "$REF" -f gridProMissingCss=true
node tools/nightly-package-validation-prototype/replay.mjs "$RUN_ID" "$ATTEMPT" --package grid-pro
```

The missing-stylesheet pilot should pass on stable and fail at bundling on
`@highcharts/grid-pro/css/grid-pro.css` for the candidate.

## Publication setup

Before merging, configure the `nightly-dist` GitHub environment:

- Allow only the `master` **branch** under selected deployment branches and tags;
  do not allow tags or arbitrary protected branches.
- Set `NIGHTLY_DIST_TOKEN` to a dedicated bot token with contents write access to
  `highcharts/highcharts-dist` only.
- Set `DIST_SSH_SIGNING_KEY_BASE64` to the base64 private SSH signing key
  whose public key is registered on `highsoft-bot`.
- Remove `highcharts-dist` write access from `PR_COMMENT_TOKEN`, which other
  workflows still use for comments. Revoke any old token retaining that access.
- After migration, remove repository/organization copies of
  `DIST_SSH_SIGNING_KEY_BASE64` and `NIGHTLY_DIST_TOKEN`.

The environment policy is required: a branch writer could change the workflow
and remove its YAML ref check. Publication secrets must therefore be available
only through the master-restricted environment, never as repository secrets.

Validate with `actionlint .github/workflows/nightly.yml` and
`node --test tools/gulptasks-tests/nightly-dist.test.mjs`. After merging and
configuring the environment, check one scheduled or master-dispatched run for a
verified, fast-forward commit on `highcharts-dist/nightly`.

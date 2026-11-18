# Nightly distribution

`nightly_dist` builds the exact run SHA without distribution credentials. Its
artifact includes release metadata and hidden files, excluding `.git`.
`nightly_dist_publish` runs on `master` only, downloads that same run's artifact,
checks its file types, and signs and pushes from a separate runner. It never runs
build scripts or package lifecycle hooks. Other refs and `pushToDist: false`
still run the build and tests, without publishing. Publication requires the
distribution build, Node unit tests, Cypress, all-browser Playwright, and visual
comparison to succeed.

The distribution and build manifest are retained for 30 days so partial retries
can reuse the same build. The consumer validation evidence is retained for
14 days.

## Advisory npm package validation

Dispatch **Nightly** with `validateDistribution: true` and
`pushToDist: false` for a manual pilot. Once the manual controls pass in
Actions, set the repository variable `NIGHTLY_PACKAGE_VALIDATION` to `true`
to include the lane in scheduled runs.

The validation job downloads the distribution and build manifest by artifact ID,
checks the directory digest, and packs the candidate once. It installs the
candidate and the stable npm control in separate fixtures and runs the consumer
checks. The run summary gives the advisory result and links to evidence.
Publication depends on the assembly and source-test jobs
independently of the advisory result.

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

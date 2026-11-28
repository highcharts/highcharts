# Skills distribution publication

Highcharts owns the documentation, authored instructions, selection configs,
generator, and validation. `highcharts/highcharts-skills` distributes the built
skills. Edit sources in Highcharts; publication replaces the destination's
`skills/` directory and root `source.json` only. Its README, license, workflows,
and Git metadata remain in place.

`validate_skills` builds complete bundles without publication credentials,
validates references and skill definitions, and uploads an installable artifact
named for the exact source SHA. PRs and manual runs can download this artifact
without publishing. The publishing job uses that same run's validated artifact
on a separate runner. It executes trusted publication tools, never artifact
scripts or package lifecycle hooks.

## Initial setup

1. Create `highcharts/highcharts-skills` with a `main` branch and a bootstrap
   commit containing its installation README and approved license. Configure
   the local checkout's remote if using it for this setup. An empty repository
   cannot be checked out by the publishing job.
2. Reuse the `nightly-dist` GitHub environment in Highcharts. Allow only the
   `master` **branch** in its deployment policy, excluding tags and other
   branches. Put publication secrets in this environment, rather than repository
   or organization secrets available to other refs.
3. Extend the existing `NIGHTLY_DIST_TOKEN` repository selection to include
   `highcharts/highcharts-skills` alongside `highcharts/highcharts-dist`, with
   contents-write access. The destination's `main` branch rules must permit the
   bot's normal fast-forward push.
4. Reuse `DIST_SSH_SIGNING_KEY_BASE64`, the base64-encoded, passphrase-free SSH
   signing key registered on the publishing bot. Changed bundles require signed
   commits, as in nightly publication. No new skills-specific secrets or
   environment are needed, and no hook or branch-rule bypass is configured.
5. Dispatch **Build and publish agent skills** from Highcharts master with
   `publish: true`. Inspect the resulting destination commit and install a
   complete skill from it in a consumer project.
6. After the first successful consumer check, set the Highcharts repository
   variable `SKILLS_PUBLISH_ON_PUSH` to `true`. Pushes to master will
   then publish automatically. Leave this unset or set it to `false` to return
   to manual-only publication.

Manual runs default to `publish: false`. Publication is always restricted to
Highcharts master, even when the input is true, and targets `highcharts-skills`
main. Release-tag publishing is not part of this workflow.

## Ordering and provenance

Every master push builds a bundle, including pushes outside the skill sources.
This ensures that skipping an older run still leaves a current artifact to
publish. Identical skill contents do not produce distribution commits.

Only superseded PR builds cancel each other. Master and manual builds run
independently, so a validation-only run cannot cancel a publishing run.
Publication uses one stable concurrency group with cancellation disabled and
`queue: max`, retaining up to 100 pending publishers. A late-finishing older
build therefore cannot replace a newer pending publisher. It also compares the
artifact's source SHA with the latest Highcharts master before updating the
destination and again before committing. Older runs skip publication instead of
overwriting newer snapshots. Pushes use normal fast-forward behavior.

The artifact's `source.json` records the Highcharts repository, source revision,
and configured skill names. If the skill contents have not changed, publication
does not create a commit or update `source.json`; the destination keeps the
revision that last changed the distributed content.

To recover from a bad bundle, correct or revert its sources in a new Highcharts
master commit, validate, and publish that revision. Consumers can pin a known
`highcharts-skills` commit while the correction is prepared.

## Local validation

```bash
node tools/generate-doc-skills.js --self-test
node --test tools/publish-doc-skills.test.js
node tools/generate-doc-skills.js --yes
node tools/publish-doc-skills.js --artifact=build/skills --revision="$(git rev-parse HEAD)"
actionlint .github/workflows/validate-skills.yml
```

GitHub supports [`queue: max`](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency),
but actionlint 1.7.12 reports it as an unexpected key. Use a validator supporting
this field or the current
[workflow schema](https://json.schemastore.org/github-workflow.json) to check it.

To inspect synchronization in a disposable destination checkout, add
`--destination=/path/to/disposable/checkout --yes` to the publication helper.
It requires a validated complete bundle and replaces only managed output.
Inspect the resulting diff before committing or pushing. Generation and local
validation do not publish to GitHub.

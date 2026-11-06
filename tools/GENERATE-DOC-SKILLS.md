# Build documentation skills

Highcharts owns the source documentation, authored skill instructions, selection
configs, and build tools. Complete installable bundles are published to
[`highcharts/highcharts-skills`](https://github.com/highcharts/highcharts-skills).

## Updating skills

Edit instructions directly in `skills/<name>/SKILL.md`, supporting authored
resources in the same directory, reference documentation in `docs/`, or the
include/exclude configuration in `tools/skill-configs/`. Then build from the
repository root:

```bash
npm run generate:skills -- --yes
```

The generator builds every configured skill into `build/skills/<name>/`. It
copies authored instructions and resources, adds filtered documentation under
`references/docs/`, and creates its topic index. `source.json` records the source
Highcharts commit and the complete skill list. Build committed sources for
publication; CI uses the exact run revision.

Review and commit source changes only. Generated bundles belong in the ignored
build directory and the distribution repository. Rebuilding replaces the entire
output, removing obsolete files and skills while preserving authored sources.
For a removed or renamed skill, update both its source directory and config.

Contributor skills remain in `.agents/skills` and are mirrored to
`.claude/skills` by `npm run sync:skills`.

## CLI options

| Option | Description |
|--------|-------------|
| `--docs=<path>` | Override the documentation source path inside the repository |
| `--output=<path>` | Override the output directory; default: `build/skills` |
| `--yes`, `-y` | Confirm replacement of the output directory |
| `--self-test` | Run the pipeline self-tests using temporary files |
| `--help`, `-h` | Print usage |

Output must be a subdirectory of this repository's `build/`, with no symlinked
parents. The build directory itself cannot be the output. Generation requires
`--yes` before replacing files. Builds always contain all configured skills;
the former `--skill` and committed-output `--check` modes have been removed.

## Validation

```bash
node tools/generate-doc-skills.js --self-test
npm run generate:skills -- --yes
node --test tools/publish-doc-skills.test.js
```

PR CI builds and validates complete bundles, their references and indexes, plus
the contributor skill definitions. It uploads the distribution as an artifact
for review and local installation. Publishing uses a separate job with its own
credentials; PR builds have no publishing credentials. See
[publication setup](../.github/workflows/skills-publish.md) for the first manual
publish and enabling automatic updates from master.

For React documentation changes, also validate the built skill in a consumer
with its installed `@highcharts/react` and `highcharts` versions:

- Typecheck and render the mixed-series getting-started example. Confirm that
  its button updates the column data while the line stays unchanged, and check
  the axes, shared tooltip, and accessibility controls.
- Render `Chart` with `title={undefined}` and confirm the default title remains.
  Then check that `title=""` and a child `<Title text="" />` both hide the title.
- Try a core chart question with only `highcharts-react` installed. The agent
  should use installed declarations or official API docs when a companion skill
  is unavailable.

Record consumer versions, commands, observations, and any with/without-skill
evaluation in the PR. Pipeline tests validate packaging and reference integrity;
they do not validate chart rendering.

## Adding a skill

Create `skills/<name>/SKILL.md` with its name, description, instructions, and
pointers to references. Add a configuration under `tools/skill-configs/` with
the skill name and documentation include/exclude paths. Build the bundle and
add the skill to the [catalog](../skills/README.md).

## Documentation filtering

The generator removes iframe embeds, Markdown/HTML images, and excessive blank
lines from selected Markdown pages; fenced code blocks are preserved. Symlinks
in the documentation tree are skipped. Generated references should be changed
through their original documentation, then rebuilt.

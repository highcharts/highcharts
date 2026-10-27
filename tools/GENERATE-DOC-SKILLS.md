# Generate documentation skills

Application skills are published in [`skills/`](../skills/README.md). Each
directory contains an authored `SKILL.md` and generated documentation under
`references/docs/`, including a topic index. Commit both the instructions and
references so application developers can install a complete skill without
running the generator.

## Updating skills

Edit instructions directly in `skills/<name>/SKILL.md`. Instruction changes do
not need regeneration.

For reference changes, edit the source documentation in `docs/` or the
include/exclude configuration in `tools/skill-configs/`, then run from the
repository root:

```bash
npm run generate:skills -- --yes
```

To regenerate selected skills:

```bash
npm run generate:skills -- --yes --skill=highcharts-data,highcharts-exporting
```

Generation replaces only each selected skill's `references/docs/` directory,
including its index. It preserves `SKILL.md` and other authored resources.
Review and commit added, modified, and removed references alongside the source
changes. Change generated references through their sources rather than editing
them directly.

When deleting or renaming a configuration, remove its old directory under
`skills/` deliberately. Generation replaces configured references; `--check`
reports orphan directories left by removed configurations.

The repository's contributor skills remain in `.agents/skills` and are
mirrored to `.claude/skills` by `npm run sync:skills`. Documentation skill
generation writes only to `skills/`; it does not update sibling dist repos.

## CLI options

| Option | Description |
|--------|-------------|
| `--docs=<path>` | Override the docs source path (must be inside the repository root) |
| `--skill=<a,b>` | Generate only the named skill(s), comma-separated |
| `--yes`, `-y` | Required for generation: confirms replacement of generated reference directories |
| `--check` | Compare all generated references without replacing files; cannot be combined with `--skill` |
| `--self-test` | Run the built-in pipeline test using temporary files |
| `--help`, `-h` | Print usage |

The default source is `docs/`. Without `--yes`, generation stops before
replacing output.

## Validation

```bash
node tools/generate-doc-skills.js --self-test
npm run generate:skills -- --check
```

Check mode rebuilds references in a temporary directory and compares file paths
and contents with each skill's `references/docs/`. It needs no `--yes`, leaves
the checkout unchanged, and exits nonzero for missing, extra, changed, or orphan
output, or a missing `SKILL.md`. CI separately validates the authored skill
definitions with `skills-ref`.

For React documentation changes, also validate the installed skill in a consumer
with its installed `@highcharts/react` and `highcharts` versions:

- Typecheck and render the mixed-series getting-started example. Confirm that
  its button updates the column data while the line stays unchanged, and check
  the axes, shared tooltip, and accessibility controls.
- Render `Chart` with `title={undefined}` and confirm the default title remains.
  Then check that `title=""` and a child `<Title text="" />` both hide the title.
- Try a core chart question with only `highcharts-react` installed. The agent
  should use the installed declarations or official API docs when a companion
  skill is unavailable.

Record the consumer package versions and observations in the PR. The generator
self-test checks reference integrity; it does not validate React rendering.

## Adding a skill

Create `skills/<name>/SKILL.md` with its name, description, instructions, and
pointers to the relevant references. Add a configuration under
`tools/skill-configs/` declaring the skill name, documentation include/exclude
paths, and destination under `skills/`. Generate its references and add the
skill to the [application skill catalog](../skills/README.md).

## What generation does

1. Reads matching Markdown files from `docs/`.
2. Removes iframe embeds, Markdown/HTML images, and excessive blank lines;
   fenced code blocks are preserved.
3. Replaces `references/docs/` with the selected pages and topic index.

`--docs` must resolve inside the repository root. Symlinks in the docs tree
are skipped during copying.

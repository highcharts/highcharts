# generate-doc-skills.js

Generates agent skill reference files by copying filtered markdown docs from `docs/` into skill directories.

## Quick start

```bash
npm run generate:skills
```

Or directly (`--yes` is required to confirm overwrite):

```bash
node tools/generate-doc-skills.js --yes
```

## CLI options

| Option | Description |
|--------|-------------|
| `--docs=<path>` | Override the docs source path (must be inside repo root) |
| `--skill=<a,b>` | Generate only the named skill(s), comma-separated |
| `--yes`, `-y` | Required: confirms overwrite of generated skill directories |
| `--self-test` | Run the built-in pipeline test without touching real files |
| `--help`, `-h` | Print usage |

## What it does

1. Reads doc files matching the `include`/`exclude` patterns in `SKILLS`.
2. Strips `<iframe>` embeds, markdown/HTML images, and excessive blank lines. Content inside fenced code blocks is preserved.
3. Writes the filtered files into each skill's `references/` directory under:
   - `.agents/skills/<skill>/`
   - `.claude/skills/<skill>/`
   - `../highcharts-dist/.claude/skills/<skill>/` (only if that sibling repo exists)

`references/` directories are gitignored. Regenerate them after cloning:

```bash
npm run generate:skills
```

## Adding a new skill

Edit the `SKILLS` array near the top of `tools/generate-doc-skills.js`. Each entry declares the skill name, which doc paths to include/exclude, destination directories, and the `SKILL.md` content written alongside the references.

## Security guards

- `--docs` path is rejected if it resolves outside the repo root.
- Symlinks in the docs tree are skipped during copy.

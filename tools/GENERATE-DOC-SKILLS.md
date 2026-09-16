# Generate documentation skills

`generate-doc-skills.js` creates complete agent skill directories from the
Highcharts documentation. It writes the generated `SKILL.md`, filtered source
pages, and `references/docs/index.md`. The reference directories are ignored by
git, so a tracked `SKILL.md` on its own is not a usable offline skill.

## Application workflow

Run these commands from a Highcharts checkout. The checkout is the source of
the generated skills; application developers do not need to edit the generated
files by hand.

1. Choose a skill for the feature. Use `highcharts-accessibility` for
   accessibility, sonification, or the React accessibility module;
   `highcharts-data` for data loading, parsing, mapping, and live updates; and
   `highcharts-exporting` for chart or data export, printing, and export-server
   decisions. A task can use more than one skill.
2. Generate the selected complete directories:

   ```bash
   npm run generate:skills -- --yes --skill=highcharts-data
   # Multiple skills are comma-separated:
   npm run generate:skills -- --yes --skill=highcharts-accessibility,highcharts-exporting
   ```

   The three feature skills are written to
   `.agents/skills/<skill>/` and `.claude/skills/<skill>/`. Copy the directory
   for the agent environment used by the application. For example, from the
   application checkout:

   ```bash
   skill=highcharts-data
   rm -rf ".agents/skills/$skill"
   cp -R "/path/to/highcharts/.agents/skills/$skill" ".agents/skills/$skill"
   ```

   For a Claude skill, use `.claude/skills/$skill` as both the source and
   destination instead. Copy the complete directory, including
   `references/docs/`; this preserves the local index and every page selected
   by the configuration.

3. Have the application agent start with the installed skill's
   `references/docs/index.md`, then read the entries relevant to the task.

### Updating an installed skill

After the Highcharts documentation or skill configuration changes, regenerate
the skill in the Highcharts checkout and replace the installed directory as a
whole. Remove the old destination before copying so pages removed from the
configuration do not remain as stale references:

```bash
npm run generate:skills -- --yes --skill=highcharts-data
rm -rf "/path/to/app/.agents/skills/highcharts-data"
cp -R ".agents/skills/highcharts-data" "/path/to/app/.agents/skills/highcharts-data"
```

`--yes` is required whenever generation would replace a generated directory;
without it, generation stops rather than overwriting. Do not update only
`SKILL.md`: the generated references and index must be replaced together.

## CLI options

| Option | Description |
|--------|-------------|
| `--docs=<path>` | Override the docs source path (must be inside the repository root) |
| `--skill=<a,b>` | Generate only the named skill(s), comma-separated |
| `--yes`, `-y` | Required: confirms replacement of generated skill directories |
| `--self-test` | Run the built-in pipeline test without touching real files |
| `--help`, `-h` | Print usage |

The default source is `docs/`. After cloning, regenerate the references with:

```bash
npm run generate:skills -- --yes
```

Some existing skill configurations also publish to
`../highcharts-dist/.claude/skills/<skill>/` when that sibling repository has a
`package.json`. The three feature configurations documented above publish only
to the two Highcharts checkout destinations; they do not require or create a
`highcharts-dist` checkout.

## What generation does

1. Reads markdown files matching each skill configuration's include and exclude
   patterns.
2. Removes iframe embeds, markdown/HTML images, and excessive blank lines;
   fenced code blocks are preserved.
3. Replaces each configured destination as a complete directory.

## Adding a new skill

Edit the skill configuration under `tools/skill-configs/`. It declares the
skill name, documentation paths, destinations, and the `SKILL.md` content
written alongside the generated references.

## Security guards

- `--docs` is rejected if it resolves outside the repository root.
- Symlinks in the docs tree are skipped during copy.

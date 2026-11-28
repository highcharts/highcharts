# Highcharts application skills

These skills help coding agents build applications with Highcharts. This
directory holds authored instructions and supporting resources. Complete
installable bundles, including reference documentation and indexes, are
published to
[`highcharts/highcharts-skills`](https://github.com/highcharts/highcharts-skills).

| Skill | Use for |
|-------|---------|
| [highcharts-js](highcharts-js/) | Core chart setup, configuration, axes, series, and styling |
| [highcharts-stock](highcharts-stock/) | Stock charts, navigation, data grouping, and indicators |
| [highcharts-maps](highcharts-maps/) | Map data, projections, map views, and map series |
| [highcharts-gantt](highcharts-gantt/) | Tasks, dependencies, milestones, and schedules |
| [highcharts-react](highcharts-react/) | Applications using `@highcharts/react` |
| [highcharts-accessibility](highcharts-accessibility/) | Accessibility, keyboard navigation, and sonification |
| [highcharts-data](highcharts-data/) | Loading, parsing, mapping, and updating data |
| [highcharts-exporting](highcharts-exporting/) | Chart and data export, printing, and export servers |
| [highcharts-morningstar](highcharts-morningstar/) | Morningstar data connectors and investment analysis |

A task may need several skills, such as React and accessibility.

## Install

From your application directory, install a selected published skill using the
[skills CLI](https://github.com/vercel-labs/skills/blob/main/docs/commands.md):

```bash
npx skills add https://github.com/highcharts/highcharts-skills/tree/main/skills/highcharts-react
```

Choose the coding agent when prompted. Installation targets the current
project by default; add `-g` to install for your user account instead.
The complete skill directory must be installed, including `references/docs/`.
The agent can then follow `SKILL.md` to read the relevant documentation.

Main follows the Highcharts master documentation and can describe unreleased
features. For a fixed snapshot, replace `main` in the URL with a commit in
`highcharts-skills`. Its `source.json` records the source Highcharts revision;
choose a snapshot matching the Highcharts or React version in your application.

## Try local changes

From the Highcharts repository root, build the complete bundles:

```bash
npm run generate:skills -- --yes
```

Then, from your application directory, install the built skill:

```bash
npx skills add /absolute/path/to/highcharts/build/skills/highcharts-react
```

Source directories under `skills/` contain authored material only. Install from
the build output so the reference pages and index are included.

## Updates

For a skill installed from a moving branch:

```bash
npx skills update highcharts-react
```

To move from a pinned snapshot to another version, install again using the new
commit URL. Replacing the whole directory keeps instructions, references, and
the index together and removes stale pages.

Maintainers edit instructions, documentation, and skill configs in the
Highcharts repository. See the [build guide](../tools/GENERATE-DOC-SKILLS.md).

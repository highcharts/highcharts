# Highcharts application skills

These skills help coding agents build applications with Highcharts. Each
directory includes its instructions and the documentation references it needs.
Application developers can install a complete skill without building Highcharts
or running its documentation generator.

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

From your application directory, install a selected skill using the
[skills CLI](https://github.com/vercel-labs/skills/blob/main/docs/commands.md):

```bash
npx skills add https://github.com/highcharts/highcharts/tree/master/skills/highcharts-react
```

Choose the coding agent when prompted. Installation targets the current
project by default; add `-g` to install for your user account instead.
The complete skill directory must be installed, including `references/docs/`.
The agent can then follow `SKILL.md` to read the relevant documentation.

The command above uses master, whose documentation can describe unreleased
features. To install a snapshot, replace `master` in the URL with a release tag
or commit containing the `skills/` directory. Match that snapshot to the
Highcharts or React version used by your application. Older tags without this
directory cannot be used to install these skills.

To try an unpublished checkout, pass its skill directory instead:

```bash
npx skills add /absolute/path/to/highcharts/skills/highcharts-react
```

## Updates

For a skill installed from a moving branch:

```bash
npx skills update highcharts-react
```

To move from a pinned snapshot to another version, install again using the new
tag or commit URL. Replacing the whole directory keeps instructions, references,
and the index together and removes stale pages.

Maintainers should edit the original documentation and skill configurations,
then regenerate these directories. See the
[generator guide](../tools/GENERATE-DOC-SKILLS.md).

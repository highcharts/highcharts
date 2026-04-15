# React Sample Imports

Guidelines for choosing the right imports when authoring samples under `samples/highcharts/react`.

Example import pattern for a simple stock demo:

```js
import { Chart, SeriesLine, Title } from '@highcharts/react';
import StockChart from '@highcharts/react/Stock';
import Accessibility from '@highcharts/react/options/Accessibility';
```

- Use the `@highcharts/react` package for all React samples.
- Never use `highcharts-react-official` in samples. It is a legacy package.
- `@highcharts/react` exports the core `Chart`, `Series`, `Title`, `Subtitle`, axes, and other components.
- `@highcharts/react/Stock`, `/Gantt`, and `/Maps` provide the root chart components for the product variants. Import only what the sample needs.
- Individual series live under `@highcharts/react/series/*` and `@highcharts/react/indicators/*` (for technical indicators). Prefer these imports over generic ones.
- Highcharts modules or helpers that extend the base library (e.g., accessibility, exporting) live in the `@highcharts/react/options/*` tree. Import them when you need to enable a module explicitly.
- Always add Accessibility from `@highcharts/react/options/Accessibility` in new samples, unless there is a specific reason not to.
- When using new import paths, make sure `tools/gulptasks/prepare-react-samples.js` maps them to CDN URLs so the generated `.html` preview works. Add entries to the `"imports"` object inside the `<script type="importmap">` block so the new alias resolves when the HTML is produced.

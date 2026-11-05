# Adding a series type

New types always go in a module. Class pattern: [../patterns.md](../patterns.md#series-types).

1. `ts/Series/<Name>/`:
   - `<Name>Series.ts`: extends a base from `SeriesRegistry.seriesTypes.<base>` (import directly only if the base is core or in `externals.json`); `static defaultOptions`; `extend(proto, { pointClass, pointArrayMap, … })`; `declare module '../../Core/Series/SeriesType'`; `registerSeriesType`.
   - `<Name>Point.ts` (nulls via `isValid()`).
   - `<Name>SeriesDefaults.ts`: defaults and API doclets (`@extends`, `@excluding`, `@product`, `@requires modules/<name>`, `@sample`, `@since next`, `@optionparent plotOptions.<type>`, `@apioption series.<type>`, `series.<type>.data`).
   - `<Name>SeriesOptions.ts`, `<Name>PointOptions.ts`.
   - Core hooks in a `static compose()` guarded by `pushUnique(composed, '<Name>')`.
2. Master `ts/masters/modules/<name>.src.ts` with a `@requires` line for every bundle read at load time.
3. `tools/webpacks/externals.json` only if other bundles import your files.
4. `npx gulp dependency-mapping`; add the module to `test/karma-files.json` and the all-types tests: `samples/unit-tests/series/seriestypes/`, `styled-mode/series-types/`, `series/events-leak/`, `coloraxis/series-types/`.
5. Tests in `samples/unit-tests/series-<type>/` for the `repo-guidelines.md` checklist: inverted and reversed axes, data labels, `addSeries`, `addPoint`, `point.update`, `point.remove`, `series.remove`, resize animation, initial animation, crisp shapes, null points, styled mode, boost (support or ignore).
6. Demo in `samples/highcharts/demo/<name>/` (a11y module, works at 320px); styled-mode demo in `samples/highcharts/css/<name>/` plus `css/highcharts.css`; docs in `docs/chart-and-series-types/<name>.md` and `docs/sidebars.js`. Optional: `lang.accessibility.seriesTypeDescriptions.<type>`.

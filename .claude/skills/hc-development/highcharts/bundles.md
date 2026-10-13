# Bundles

Bundles are defined by `ts/masters/**/*.src.ts`. A master imports sources, calls `X.compose(...)`, and attaches classes to the `Highcharts` namespace (`G.X = X`). Webpack builds each master into `code/<name>.js`.

## Main bundles

| Bundle | Contents |
|---|---|
| `highcharts` | core |
| `highstock` | core + `modules/stock` |
| `highmaps` | core + `modules/map` |
| `highcharts-gantt` | core + `modules/gantt` |
| `highcharts-more` | range, bubble, gauge, boxplot, waterfall, polygon, packedbubble, polar, pane |
| `highcharts-3d` | 3D chart, axes, column/pie/area/scatter 3D |
| `modules/*` | optional features and series types |
| `indicators/*` | one per indicator, plus `indicators-all` |

Other masters: `ts/masters/themes/*`, `ts/masters/i18n/*`, `ts/masters-es5/` (ES5 build), `ts/masters-grid/`, `ts/masters-dashboards/`.

## What core contains

These source files (see the `;// ./code/es-modules/…` markers in `code/highcharts.src.js`):

- Chart: `Core/Chart/{Chart,ChartDefaults}`, `Core/Responsive`, `Extensions/ScrollablePlotArea`
- Axis: `Core/Axis/{Axis,AxisDefaults,Tick,DateTimeAxis,LogarithmicAxis}`, `Core/Axis/PlotLineOrBand/*`, `Core/Axis/Stacking/{StackingAxis,StackItem}`
- Series: `Core/Series/{Series,SeriesDefaults,SeriesRegistry,Point,DataLabel,OverlappingDataLabels}`; types line, area, spline, areaspline, column, bar, scatter, pie (with `ColumnDataLabel`, `PieDataLabel`, `PiePoint`); `Series/CenteredUtilities`, `Extensions/BorderRadius`
- Interaction: `Core/{Pointer,Tooltip}`, `Core/Legend/{Legend,LegendSymbol}`
- Renderer: `Core/Renderer/SVG/{SVGRenderer,SVGElement,SVGLabel,TextBuilder,Symbols}`, `Core/Renderer/HTML/{HTMLElement,AST}`, `Core/Renderer/RendererUtilities`
- Services: `Core/{Globals,Defaults,Foundation,Templating,Time,Utilities}`, `Shared/{Utilities,TimeBase}`, `Core/Animation/{Fx,AnimationUtilities}`, `Core/Color/{Color,Palette,PaletteDefaults}`, `Core/Geometry/GeometryUtilities`, `Data/{DataTableCore,ColumnUtils}`

## Directory is not bundle

In `ts/Core/` but not in core:

- highcharts-more: `Axis/RadialAxis`, `Axis/WaterfallAxis`
- highcharts-3d: `Chart/Chart3D`, `Axis/{Axis3DComposition,Tick3DComposition,ZAxis}`, `Series/Series3D`, `Renderer/SVG/{SVGRenderer3D,SVGElement3D}`, `Math3D`
- stock: `Chart/StockChart`, `Axis/OrdinalAxis`, `Axis/BrokenAxis`, and `Axis/{NavigatorAxisComposition,ScrollbarAxis}` (also in navigator, gantt, accessibility)
- map: `Chart/MapChart`, `Geometry/PolygonClip`; gantt: `Chart/GanttChart`, `Axis/GridAxis`, `Axis/TreeGrid/*`
- coloraxis, heatmap, map, contour: `Axis/Color/*`
- others: `Chart/ChartNavigationComposition` (exporting, annotations), `HttpUtilities` (data, exporting), `Delaunay` (contour), `Geometry/CircleUtilities` (venn), `MSPointer` (ES5 build only)

In `ts/Extensions/` but in core: `BorderRadius`, `ScrollablePlotArea`.

## Shared code between bundles

- `tools/webpacks/externals.json` lists files that module bundles read from the namespace instead of inlining: all core classes, `Shared/Utilities`, `Core/Utilities`, `Core/Globals`, `Core/Defaults`, and module files shared between modules (ColorAxis, Navigator, Scrollbar, RangeSelector, NavigationBindings, Pathfinder, XRange, Bubble, highcharts-more series).
- Any other file is inlined into every bundle that imports it. `Symbols`, `BorderRadius`, `DateTimeAxis` and `DataTableCore` are duplicated this way into stock, gantt, map or accessibility.
- From a module, reach core code through the class (`SeriesRegistry.seriesTypes.column.prototype`, `chart.renderer.symbols`) or an externalized file, not by importing an unlisted file.
- New export in `Shared/Utilities.ts`: also add `G.name = name` in `ts/masters/highcharts.src.ts` and the other masters that externalize it.
- New shared module file: add it to `externals.json`, expose it in its master, and run `npm run test:webpack`. Details: `tools/webpacks/AGENTS.md`.

## Adding a module

1. Master `ts/masters/modules/<name>.src.ts` with `@module highcharts/modules/<name>`, then `@requires` tags in dependency order.
2. Code in `ts/Extensions/<Name>/` or `ts/Series/<Type>/`, with `compose()` guarded by `pushUnique(composed, '<Name>')`. See [patterns.md](patterns.md).
3. Run `npx gulp dependency-mapping` to update the options the autoloader maps (`ts/Extensions/Autoload/DependencyMapping.ts`).
4. Add `code/modules/<name>.src.js` to `test/karma-files.json`; QUnit loads only the scripts listed there.

## Measuring size

```sh
npx gulp scripts
npx gulp write-file-sizes --files highcharts.src.js --filename after.json
```

`tmp/filesizes/after.json` holds gzip bytes; divide by 1024 for the kB that CI reports. Build master the same way for the baseline. CI posts a "File size comparison" table on every PR.

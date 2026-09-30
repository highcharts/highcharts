# Exporting

## Files

- `Extensions/Exporting/Exporting.ts` (`exporting`): `chart.exporting`, buttons and menu (`addButton`, `contextMenu`), `getSVG`, `getSVGForExport`, `exportChart`, `localExport` (PNG, JPEG, SVG in the browser; default), `print`, `inlineStyles`, `sanitizeSVG`. Also `ExportingDefaults.ts`, `ExportingSymbols.ts`, `Core/Chart/ChartNavigationComposition.ts`, `Shared/DownloadURL.ts`, `Core/HttpUtilities.ts`.
- `Extensions/ExportData/ExportData.ts` (`export-data`): adds `getDataRows`, `getCSV`, `downloadCSV`, `downloadXLS`, `getTable`, `viewData` to `Exporting.prototype`; sets `keyToAxis`/`exportKey` per series type.
- `Extensions/OfflineExporting/OfflineExporting.ts` (`offline-exporting`): PDF in the browser via jsPDF and svg2pdf, on the `downloadSVG` event.
- `Extensions/Exporting/Fullscreen.ts` (`full-screen`, also in exporting).

## Flow

- Menu: `Exporting.render()` on every redraw → `addButton` → `contextMenu` from `menuItems` + `menuItemDefinitions` (texts from `lang`) → fires `exportMenuShown`, `exportMenuHidden`.
- `exportChart` → `localExport` → `getSVGForExport` → `getSVG`: builds a hidden copy chart from `chart.options` + `userOptions` with `forExport: true`, no animation; fires `getSVG`; inlines styles, resolves CSS vars, sanitizes; fires `afterGetSVG`. Then images become data URLs, fonts are inlined, `downloadSVG` fires (offline-exporting handles PDF), PNG/JPEG go through a canvas → `downloadURL`. Only PDF falls back to the export server (`exporting.url`).
- CSV/XLS: `getDataRows` (fires `exportData`, annotations add columns) → `getCSV` → Blob. XLS is an HTML table in an Excel template.
- Data table: `viewData` → `getTableAST` (fires `afterGetTableAST`) → div after the container → fires `afterViewData`.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Missing element, style or font in export | `Exporting::getSVG`, `inlineStyles`, `inlineFonts` | |
| Images or canvas missing in export | `Exporting::sanitizeSVG`, `getChartHTML`, `localExport` | core `AST.ts` allowlists |
| Offline PDF strokes, labels, fonts | `OfflineExporting::preparePDF`, `svgToPdf` | |
| Menu, buttons, fullscreen | `Exporting::contextMenu`, `addButton`, `Fullscreen::toggle` | a11y `MenuComponent` |
| CSV/XLS values | `ExportData::getDataRows`, `getCSV` | `keyToAxis`/`exportKey`; `AnnotationChart` `exportData` listener |
| Data table format, sort | `ExportData::getTableAST`, `onChartAfterViewData` | |

Tests: `samples/unit-tests/{exporting,export-data,fullscreen}/`, `tests/highcharts/exporting/`.

## Couplings

- a11y reads `chart.exporting.{svgElements,group,contextMenuEl,openMenu}` and listens to `exportMenuShown`, `exportMenuHidden`, `getSVG`, `afterGetTableAST`, `afterViewData`; renaming them breaks a11y.
- `export-data`, `offline-exporting` and `sonification` push into `exporting.buttons.contextButton.menuItems`.
- `Shared/DownloadURL.ts` is also used by Grid Pro.
- New tags or attributes in exported SVG may need core `AST` allowlist changes.

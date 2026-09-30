# Grid table

Paths relative to `ts/Grid/Core/`.

## Files

- `Table/Table.ts`, the viewport: `<thead>` and `<tbody>`, columns, rows, extra body sections, virtualizers, `updateRows`, `reflow`, scroll and focus, the cell context menu, `getStateMeta`/`applyStateMeta`, `destroy`. Click, dblclick, contextmenu, mouse and keydown listeners are delegated on the tbody.
- `Table/Column.ts`: `options` is a proxy of the column's own options over `columnDefaults`; `data` from the presentation table; `dataType` guess; `getCellValue`, `createCellContent`, `format`.
- `Table/Row.ts`, `Table/Cell.ts`: bases. `Table/Body/TableRow.ts`: `index` in the presentation table, pooled and reused, positioned with `translateY`. `Table/Body/TableCell.ts`: `setValue`, edit values, async value fetch.
- `Table/Header/`: `TableHeader` (levels from the grouped `header` option), `HeaderRow`, `HeaderCell`, and `ColumnToolbar/` with the sort, filter and menu buttons and their popups. The inline filter row is `Table/Actions/ColumnFiltering/FilterRow.ts`.
- `Table/CellContent/`: `CellContent` base and `TextContent`, which formats cells in Lite. Pro replaces it through renderers ([pro.md](pro.md)).
- `Table/Actions/`: `RowsVirtualizer`, `ColumnsVirtualizer`, `ColumnSorting`, `ColumnFiltering/`, `ColumnsResizer` (drag handles).
- `Table/ColumnResizing/`: `adjacent`, `distributed` and `independent` modes on `ResizingMode`. `Table/Layout/ColumnLayout.ts`: widths, offsets and the visible column range.
- `Table/CellContextMenu/`: the menu, a registry of built-in actions and groups, long press on touch.
- `UI/`: `Popup`, `ContextMenu`, `ToolbarButton`, `ContextMenuButton`, `SvgIcons`.
- `Accessibility/Accessibility.ts`: ARIA attributes, screen-reader regions, live announcements for sorting and filtering.
- `Pagination/Pagination.ts`: pagination UI (top, bottom, footer or a custom container); the state is in `grid.querying.pagination`.
- `Credits.ts` and `../Lite/Credits/`; Pro credits in [pro.md](pro.md).

## Flows

- Rows: `RowsVirtualizer.initialRender` measures a mock row, then `renderRows` renders the visible range plus a buffer. Scrolling calls `applyScroll` and `renderRows`, reusing pooled `TableRow`s; `adjustRowHeights` and `adjustRowOffsets` handle rows of different heights. `Table::updateRows` re-queries and re-renders after sorting, filtering, pagination or data changes.
- Cell value: `TableRow.init` fetches the row id and data from the provider, then `TableCell.setValue` calls `Column.getCellValue` and `column.createCellContent(cell)`. `TextContent.format` uses the data type's default format when there is no `format` or `formatter`, otherwise the `formatter` result or `cell.format(format)`, and writes it with `setHTMLContent`.
- Widths: `ResizingMode.loadColumns`, then `ColumnLayout.reflow` and `Table.reflowColumns`. A drag goes from `ColumnsResizer` to the mode's `resize`.
- Keyboard: roving tabindex through `Table.setFocusAnchorCell`; arrows in `Cell.onKeyDown`; Enter on a header moves into its toolbar; ContextMenu or Shift+F10 opens the cell menu. Focus survives virtualization through `focusCursor`, `preserveFocusDuringDetach` and `restoreRenderedCellFocus`.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Cell text, format or formatter | `TextContent::format` | `Column::getCellValue`, `conformValue`; `Cell::format`; `Templating.format`; `setHTMLContent` |
| Header text | `HeaderCell::render` | tree view header override in `TreeViewComposition` |
| Grouped headers, colspan, rowspan | `HeaderRow::renderContent`, `TableHeader::getRowLevels` | `Grid::getColumnIds` |
| Header toolbar icons, minimized menu | `HeaderCellToolbar` (`ColumnToolbar.ts`) `reflow`, `renderFull`, `renderMinimized` | the toolbar buttons; `Grid::redraw` `refreshState` |
| Column widths, `%` widths, min and max | `ResizingMode::getColumnWidth`, `loadColumn`, `calculateAutoWidthCache`, `getMinWidth` | `ColumnLayout::reflow`, `Table::reflowColumns`, `rendering.columns.strictWidths` |
| Drag-resizing | the mode's `resize` (e.g. `AdjacentResizingMode`) | `ColumnsResizer` `onDocumentDragMove`, `addHandleListeners` |
| Width change by `update()` not applied | `Grid::loadColumnOptionDiffs` (sets `columnResizing.isDirty`) | `Grid::redraw` |
| Scroll jumps, blank or overlapping rows | `RowsVirtualizer::applyScroll`, `renderRows`, `adjustRowHeights`, `adjustRowOffsets` | measured default height, `applyMeasuredRowHeight`, `rendering.rows.strictHeights`, Pro `getEffectiveRowCount` |
| `scrollToRow` or reveal lands wrong | `Table::scrollToRow`, `ensureRowFullyVisible` | `getViewportTopInset` event (tree view sticky rows) |
| Column virtualization gaps, header misaligned | `ColumnsVirtualizer::updateRange`, `Table::updateRenderedColumns` | `TableHeader::reflow`, `HeaderRow::applyVirtualColumnLayout` |
| Keyboard navigation, focus lost | `Cell::onKeyDown`, `Table::focusCellByRowIndex` | focus restore in `RowsVirtualizer` and `Table`; tree view key handling |
| Cell context menu | `Table::openCellContextMenu`; `CellContextMenuBuiltInActions.resolveCellContextMenuItems` | built-in action registries, `CellContextMenuLongPress` |
| Popup or menu position, focus | `Popup` (repositioned in `Table::reflow`), `ContextMenu` | `grid.popups` |
| Pagination UI, alignment | `Pagination::render`, `update`, `redraw`, `goToPage`, `setPageSize` | [data.md](data.md) for the page state |
| Screen reader output, ARIA | `Accessibility` | `ColumnSorting` header attributes; `aria-rowcount` is also set by `Table::syncAriaRowIndexes` and `Pagination` |
| Lite credits | `CreditsLiteComposition::initCredits`, `Credits::render` | `grid-lite.css` credits rules |

## Gotchas

- Rows are pooled: a `TableRow` or `TableCell` object is reused for another row after scrolling. Don't store row-specific state on them; key it by row id (`grid.rowMeta` is one place for it).
- Cells render at `opacity: 0.5` until their value resolves.
- Without a header (`rendering.header.enabled: false`) there is no `ColumnSorting` and no toolbar; `grid.setSorting()` still works.
- Row parity is 1-based: the first row gets the odd class.
- UI actions write options back into the user's column objects (sort order, filter, widths) and into `pagination` ([lifecycle.md](lifecycle.md#gotchas)).

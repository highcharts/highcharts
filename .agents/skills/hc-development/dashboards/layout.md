# Dashboards layout and edit mode

Paths relative to `ts/Dashboards/`. `EditMode/` and `Actions/` ship in `modules/layout.js`. `Bindings`, `EditGlobals` and the `Layout/` classes ship in `dashboards.js`, and `modules/layout.js` has its own copies.

## Layout

- `Layout/GUIElement.ts`: base of `Layout`, `Row` and `Cell`. It creates or reuses the element with the given id, and maps DOM ids back to objects for `Bindings.getGUIElement`.
- `Layout/Layout.ts`: `rows`, `setRows`, `addRow`, `mountRow`, `unmountRow`. A nested layout has a `parentCell` and a `level`.
- `Layout/Row.ts`: `cells`, `setCells`, `addCell`, `mountCell`, `unmountCell`; the row `style` and height.
- `Layout/Cell.ts`: `mountedComponent` or `nestedLayout` (`setNestedLayout`); size from options in `applySizeOptions` (`'1/3'`, `%`, px, `auto`, a flex value), at runtime in `setSize`; fires `cellResize` on the board and `cellChange` on the row.
- `Layout/CellHTML.ts`: wraps an existing element in custom HTML mode.
- Layouts are built from `gui.layouts` merged with `gui.layoutOptions`, by `EditMode::initLayout` at load and by `Board::update`. There are no responsive breakpoint options: responsive layouts use CSS (`docs/dashboards/layout-description.md`).

## Edit mode

- `EditMode/EditMode.ts`: created by the board whenever the layout module is loaded. The constructor builds the layouts if `gui` is set; with `editMode.enabled` it also builds the context button and menu (`createTools`), the add-component button, confirmation popup, overlay and fullscreen. Edit mode starts with `activate()`, usually from the context menu; the first `activate()` creates the resizer, drag and drop, row and cell toolbars and the sidebar. Hovered rows and cells become the context (`onDetectContext`); a click selects it (`onContextConfirm`, `setEditCellContext`).
- `EditMode/Toolbar/`: `CellEditToolbar` (drag, settings, delete, fullscreen; per-cell `editMode.toolbarItems`), `RowEditToolbar` (drag, delete).
- `EditMode/SidebarPopup.ts`: the add-components list (`toolbars.sidebar.components`, labels from `lang.sidebar`), and the settings of the selected component through `AccordionMenu`. Dropping a new component calls `onDropNewComponent`: a new cell, `Bindings.addComponent` with the type's `getOptionsOnDrop`, and a `layoutChanged` event.
- `EditMode/AccordionMenu.ts`: renders `component.getEditableOptions()` with `EditRenderer` (input, textarea, toggle, select, nested). Each change calls `updateOptions`, which updates the component right away as a preview; the chart options JSON applies only on confirm; cancel restores the saved options (`discardChanges`).
- `EditMode/EditGlobals.ts`: class names and `lang`. Headers use `lang[name]`; input, select and textarea labels show the option's `name` as given.
- `Actions/DragDrop.ts`: `onDragStart`, `onCellDrag` with `ContextDetection.getContext`, `onCellDragEnd` (moves the cell, creating a row or nested layout if needed), `onRowDrag`, `onRowDragEnd`.
- `Actions/Resizer.ts`: snap handles; a horizontal drag sets the cell width in percent, a vertical drag the height in pixels.
- `EditMode/Fullscreen.ts`: `board.fullscreen`, created in edit mode; the cell toolbar's fullscreen item and the context menu use it.
- `EditMode/ConfirmationPopup.ts` and `SidebarPopup.ts` extend `ts/Shared/BaseForm.ts`, shared with the Highcharts annotations popup and stock tools.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Cell width or height from options wrong | `Cell::applySizeOptions`, `convertWidthToValue`; `GUIElement.getPercentageWidth` | `.highcharts-dashboards-cell` flex rules in `dashboards.css`; `Cell::getOptions` |
| Row height or style | `Row` constructor, `Row.setContainerHeight` | layout `style` inherited by cells |
| Size changes at runtime | `Cell::setSize`; `Resizer::onMouseMove`, `setTempWidthSiblings`, `revertSiblingsAutoWidth` | `Component::attachCellListeners` |
| Nested layout created or destroyed wrongly | `Cell::setNestedLayout`, `Layout` constructor, `Layout::destroy` | `Cell::getParentCell`, `getOverlappingLevels` |
| Drag and drop targets the wrong place | `DragDrop::onCellDragCellCtx`, `onCellDragRowCtx`; `ContextDetection.getContext` | `EditMode::setRowEvents`, `setCellEvents` |
| Drop leaves an empty row or wrong order | `DragDrop::onCellDragEnd`, `onRowDragEnd` | `Row::mountCell`, `unmountCell`; `Layout::mountRow`, `unmountRow` |
| New component from the sidebar wrong or missing | `SidebarPopup::getComponentsList`, `onDropNewComponent`; the component's `getOptionsOnDrop` (called on the prototype) | `toolbars.sidebar.components`, `lang.sidebar` |
| Sidebar option not applied or not reverted | `AccordionMenu::updateOptions`, `confirmChanges`, `discardChanges` | the component's `update`, `getEditableOptions`, `getEditableOptionValue` |
| Sidebar label not translated | `EditRenderer::renderCollapseHeader` versus `renderInput`, `renderSelect`, `renderTextarea`, `renderToggle` | `EditGlobals.lang` and `LangOptions` |
| Toolbar item shown although disabled | `CellEditToolbar::showToolbar`, `getItemsConfig`; `RowEditToolbar::showToolbar` | `cell.options.editMode.toolbarItems` |
| Context menu or edit toggle missing | `EditMode::createTools` | `EditContextMenu`, `EditMode/Menu/MenuItemBindings.ts` |
| Fullscreen styling or button text | `Fullscreen` | its class name in `dashboards.css` |
| `board.destroy()` or `update()` throws, or leaves elements or listeners behind | `Board::destroy`, `Board::update`, `Component::destroy` | `Layout::destroy` removes itself from `board.layouts`; document listeners added by `DragDrop`, `Resizer`, `EditMode`, `SidebarPopup`, `EditContextMenu` and `BaseForm`; there is no `EditMode.destroy` |

## Gotchas

- Without the layout module, `gui.layouts` is ignored silently; with `editMode.enabled` the board throws `Missing layout.js module`.
- In GUI mode, edit mode empties the user's container (`board.boardWrapper`) and renders into a new `board.container` inside it.
- `modules/layout.js` bundles its own copies of the layout classes (`Cell`, `Row`, `Layout`, `CellHTML`, `Bindings`), separate from those in `dashboards.js`; checks with `instanceof` may fail across the two.
- `resize.styles.minWidth` and `minHeight` are not applied.

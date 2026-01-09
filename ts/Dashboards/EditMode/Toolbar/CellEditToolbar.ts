/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

import type CellHTML from '../../Layout/CellHTML';

import EditMode from '../EditMode.js';
import Cell from '../../Layout/Cell.js';
import EditGlobals from '../EditGlobals.js';
import MenuItem from '../Menu/MenuItem.js';
import EditToolbar from './EditToolbar.js';
import GUIElement from '../../Layout/GUIElement.js';
import H from '../../../Core/Globals.js';
const {
    isFirefox
} = H;
import U from '../../../Core/Utilities.js';
const {
    merge,
    fireEvent,
    objectEach
} = U;


/**
 * @internal
 */
class CellEditToolbar extends EditToolbar {
    /* *
     *
     *  Static Properties
     *
     * */
    protected static readonly defaultOptions: CellEditToolbar.Options = {
        enabled: true,
        className: EditGlobals.classNames.editToolbar,
        outline: false,
        outlineClassName: EditGlobals.classNames.editToolbarCellOutline,
        menu: {
            className: EditGlobals.classNames.editToolbarCell,
            itemsClassName: EditGlobals.classNames.editToolbarItem,
            items: []
        }
    };

    public static getItemsConfig(
        options: EditMode.Options,
        iconURLPrefix: string
    ): MenuItem.Options[] {
        const items: MenuItem.Options[] = [];

        if (options.dragDrop?.enabled) {
            items.push({
                id: 'drag',
                type: 'icon' as const,
                icon: iconURLPrefix + 'drag.svg',
                events: {
                    onmousedown: function (this: MenuItem, e: any): void {
                        // #22546, workaround for Firefox, where mouseenter
                        // event is not fired when triggering it while dragging
                        // another element.
                        if (isFirefox) {
                            e.preventDefault();
                        }

                        const cellEditToolbar = this.menu
                            .parent as CellEditToolbar;
                        const dragDrop = cellEditToolbar.editMode.dragDrop;

                        if (
                            dragDrop &&
                            cellEditToolbar.cell &&
                            Cell.isCell(cellEditToolbar.cell)
                        ) {
                            dragDrop.onDragStart(e, cellEditToolbar.cell);
                        }
                    }
                }
            });
        }

        if (options.settings?.enabled) {
            items.push({
                id: 'settings',
                type: 'icon',
                icon: iconURLPrefix + 'settings.svg',
                events: {
                    click: function (this: MenuItem): void {
                        this.menu.parent.editMode.setEditOverlay();

                        (this.menu.parent as CellEditToolbar).onCellOptions();
                    }
                }
            });
        }

        items.push({
            id: 'destroy',
            type: 'icon',
            className: EditGlobals.classNames.menuDestroy,
            icon: iconURLPrefix + 'destroy.svg',
            events: {
                click: function (this: MenuItem): void {
                    const parentNode = this.menu.parent as CellEditToolbar,
                        editMode = this.menu.parent.editMode,
                        popup = editMode.confirmationPopup;

                    popup.show({
                        confirmButton: {
                            value: editMode.lang.confirmButton,
                            callback: parentNode.onCellDestroy,
                            context: parentNode
                        },
                        cancelButton: {
                            value: editMode.lang.cancelButton,
                            callback: (): void => {
                                popup.closePopup();
                            }
                        },
                        text: editMode.lang.confirmDestroyCell
                    });
                }
            }
        });

        if (options.viewFullscreen?.enabled) {
            items.push({
                id: 'viewFullscreen',
                type: 'icon',
                className: EditGlobals.classNames.viewFullscreen,
                icon: iconURLPrefix + 'fullscreen.svg',
                events: {
                    click: function (this: MenuItem): void {
                        const fullScreen =
                            this.menu.parent.editMode.board.fullscreen;
                        const container =
                            this.menu.parent.cell.container.firstElementChild;

                        if (fullScreen) {
                            fullScreen.toggle(container);
                        }
                    }
                }
            });
        }


        return items;
    }

    /* *
     *
     *  Constructor
     *
     * */

    constructor(editMode: EditMode) {
        super(
            editMode,
            merge(
                CellEditToolbar.defaultOptions,
                (editMode.options.toolbars || {}).cell,
                {
                    menu: {
                        items: CellEditToolbar.getItemsConfig(
                            editMode.options,
                            editMode.iconsURLPrefix
                        )
                    }
                }
            )
        );

        if (editMode.customHTMLMode) {
            this.filterOptionsAvailableInCustomHTMLMode();
        }

        this.menu.initItems({});
    }

    /* *
     *
     *  Properties
     *
     * */
    public cell?: Cell|CellHTML;
    public editedCell?: Cell|CellHTML;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Show toolbar for given cell.
     *
     * @param cell
     * Cell to show toolbar for.
     */
    public showToolbar(cell: Cell|CellHTML): void {
        const toolbar = this;
        const cellCnt = cell.container;
        const toolbarWidth = 30;
        const toolbarMargin = 10;
        const cellToolbar = toolbar.editMode.cellToolbar;

        if (!cellToolbar) {
            return;
        }

        if (
            cellCnt && toolbar.editMode.isActive() &&
            !(toolbar.editMode.dragDrop || {}).isActive
        ) {
            const cellOffsets = GUIElement.getOffsets(
                cell,
                toolbar.editMode.board.container
            );
            const x = cellOffsets.right - toolbarWidth - toolbarMargin;
            const y = cellOffsets.top + toolbarMargin;

            objectEach(toolbar.menu.items, (item): void => {
                if (!cell.options?.editMode?.toolbarItems) {
                    item.activate();
                    return;
                }
                const toolbarItems = cell.options.editMode.toolbarItems;

                if (
                    toolbarItems[item.options.id as keyof typeof toolbarItems]
                        ?.enabled === false
                ) {
                    item.deactivate();
                    return;
                }

                item.activate();
            });

            toolbar.setPosition(x, y);
            toolbar.cell = cell;
            toolbar.refreshOutline();
            cellToolbar.isVisible = true;
        } else if (toolbar.isVisible) {
            toolbar.hide();
            cellToolbar.isVisible = false;
        }
    }

    public refreshOutline(): void {
        const toolbar = this,
            offsetWidth = -1;

        if (toolbar.cell && toolbar.cell.container && toolbar.outline) {
            super.refreshOutline(
                -toolbar.cell.container.offsetWidth,
                0,
                this.cell,
                offsetWidth
            );
        }
    }

    /**
     * When options icon is clicked, show sidebar with options.
     */
    public onCellOptions(): void {
        const toolbar = this;
        const editMode = toolbar.editMode;

        if (!editMode.sidebar) {
            return;
        }

        editMode.sidebar.show(toolbar.cell);
        toolbar.highlightCell();
    }

    public onCellDestroy(): void {
        const toolbar = this;

        if (toolbar.cell && Cell.isCell(toolbar.cell)) {
            const row = toolbar.cell.row;
            const board = toolbar.editMode.board;
            const editMode = toolbar.editMode;
            const cellId = toolbar.cell.id;

            // Disable row highlight.
            toolbar.cell.row.setHighlight();

            toolbar.resetEditedCell();
            toolbar.cell.destroy();
            toolbar.cell = void 0;

            // Hide row and cell toolbars.
            editMode.hideToolbars(['cell', 'row']);

            // Disable resizer.
            editMode.resizer?.disableResizer();

            // Call cellResize dashboard event.
            if (row && row.cells && row.cells.length) {
                fireEvent(board, 'cellResize', {
                    cell: row.cells[0]
                });
                fireEvent(row, 'cellChange', { cell: row.cells[0], row });
            }

            fireEvent(editMode, 'cellDestroyed', {
                target: cellId,
                board: board
            });
        }
    }

    public resetEditedCell(): void {
        this.editedCell = void 0;
    }

    /**
     * Filter options available in custom HTML mode, only settings available.
     */
    private filterOptionsAvailableInCustomHTMLMode(): void {
        this.options.menu.items = this.options.menu.items?.filter(
            (item): boolean => {
                if (typeof item === 'string') {
                    return false;
                }

                return item.id === 'settings';
            }
        );
    }

    /**
     * Highlight cell and gray out the rest of the dashboard.
     */
    private highlightCell(): void {
        const toolbar = this;

        if (!toolbar.cell) {
            return;
        }

        if (toolbar.cell.setHighlight) {
            toolbar.cell.setHighlight();
        } else {
            toolbar.cell.container.classList.add(
                EditGlobals.classNames.cellEditHighlight
            );
            toolbar.editMode.board.container.classList.add(
                EditGlobals.classNames.dashboardCellEditHighlightActive
            );
        }
    }
}

namespace CellEditToolbar {
    export interface Options extends EditToolbar.Options {}
}

export default CellEditToolbar;

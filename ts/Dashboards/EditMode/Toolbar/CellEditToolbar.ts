/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Cell from '../../Layout/Cell.js';
import EditGlobals from '../EditGlobals.js';
import Menu from '../Menu/Menu.js';
import MenuItem from '../Menu/MenuItem.js';
import EditToolbar from './EditToolbar.js';
import GUIElement from '../../Layout/GUIElement.js';

const {
    merge,
    fireEvent,
    objectEach
} = U;

class CellEditToolbar extends EditToolbar {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: CellEditToolbar.Options = {
        enabled: true,
        className: EditGlobals.classNames.editToolbar,
        outline: true,
        outlineClassName: EditGlobals.classNames.editToolbarCellOutline,
        menu: {
            className: EditGlobals.classNames.editToolbarCell,
            itemsClassName: EditGlobals.classNames.editToolbarItem,
            items: ['drag', 'settings', 'destroy']
        }
    };

    public static items = merge(Menu.items, {
        drag: {
            id: 'drag',
            type: 'icon',
            icon: EditGlobals.iconsURL + 'drag.svg',
            events: {
                onmousedown: function (this: MenuItem, e: any): void {
                    const cellEditToolbar =
                        (this.menu.parent as CellEditToolbar);
                    const dragDrop = cellEditToolbar.editMode.dragDrop;

                    if (dragDrop && cellEditToolbar.cell) {
                        dragDrop.onDragStart(e, cellEditToolbar.cell);
                    }
                }
            }
        },
        settings: {
            id: 'settings',
            type: 'icon',
            icon: EditGlobals.iconsURL + 'settings.svg',
            events: {
                click: function (this: MenuItem, e: any): void {
                    (this.menu.parent as CellEditToolbar).onCellOptions();
                }
            }
        },
        destroy: {
            id: 'destroy',
            type: 'icon',
            className: EditGlobals.classNames.menuDestroy,
            icon: EditGlobals.iconsURL + 'destroy.svg',
            events: {
                click: function (this: MenuItem, e: any): void {

                    const parentNode = (this.menu.parent as CellEditToolbar);
                    const popup = this.menu.parent.editMode.confirmationPopup;

                    popup.show({
                        confirmButton: {
                            value: EditGlobals.lang.confirmButton,
                            callback: parentNode.onCellDestroy,
                            context: parentNode
                        },
                        cancelButton: {
                            value: EditGlobals.lang.cancelButton,
                            callback: (): void => {
                                popup.closePopup();
                            }
                        },
                        text: EditGlobals.lang.confirmDestroyCell
                    });
                }
            }
        }
    });

    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        editMode: EditMode
    ) {
        super(
            editMode,
            merge(
                CellEditToolbar.defaultOptions,
                (editMode.options.toolbars || {}).cell
            )
        );

        this.menu.initItems(CellEditToolbar.items);
    }

    /* *
    *
    *  Properties
    *
    * */
    public cell?: Cell;
    public editedCell?: Cell;

    /* *
    *
    *  Functions
    *
    * */

    public showToolbar(
        cell: Cell
    ): void {
        const toolbar = this,
            cellCnt = cell.container;

        let x, y;

        if (
            cellCnt &&
            toolbar.editMode.isActive() &&
            !(toolbar.editMode.dragDrop || {}).isActive
        ) {
            const cellOffsets = GUIElement.getOffsets(
                cell,
                toolbar.editMode.board.container
            );

            x = cellOffsets.right;
            y = cellOffsets.top;

            // Temp - activate all items.
            objectEach(toolbar.menu.items, (item): void => {
                item.activate();
            });

            toolbar.setPosition(x, y);
            toolbar.cell = cell;
            toolbar.refreshOutline();
        } else if (toolbar.isVisible) {
            toolbar.hide();
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

    public onCellOptions(): void {
        const toolbar = this;

        if (toolbar.editMode.sidebar) {
            toolbar.editMode.sidebar.show(toolbar.cell);
            // toolbar.editMode.sidebar.updateTitle('CELL OPTIONS');

            if (this.cell) {
                this.cell.setHighlight();
            }
        }
    }

    public onCellDestroy(): void {
        const toolbar = this;

        if (toolbar.cell) {
            const row = toolbar.cell.row;

            toolbar.resetEditedCell();
            toolbar.cell.destroy();
            toolbar.cell = void 0;

            // Hide row and cell toolbars.
            toolbar.editMode.hideToolbars(['cell', 'row']);

            // Call cellResize dashboard event.
            if (row && row.cells && row.cells.length) {
                fireEvent(
                    toolbar.editMode.board,
                    'cellResize',
                    { cell: row.cells[0] }
                );
                fireEvent(row, 'cellChange', { cell: row.cells[0], row });
            }
        }
    }

    public resetEditedCell(): void {
        // super.resetCurrentElements(this.cell as Cell);
        this.editedCell = void 0;
    }
}

namespace CellEditToolbar {
    export interface Options extends EditToolbar.Options {}
}

export default CellEditToolbar;

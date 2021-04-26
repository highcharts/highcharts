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
        menu: {
            itemsClassName: EditGlobals.classNames.editToolbarItem,
            items: ['drag', 'settings', 'destroy']
        }
    }

    public static items: Record<string, MenuItem.Options> =
    merge(Menu.items, {
        drag: {
            id: 'drag',
            type: 'icon',
            icon: EditGlobals.iconsURL + 'drag.svg',
            events: {
                onmousedown: function (this: MenuItem, e: any): void {
                    const cellEditToolbar = (this.menu.parent as CellEditToolbar),
                        dragDrop = cellEditToolbar.editMode.dragDrop;

                    if (dragDrop && cellEditToolbar.cell) {
                        dragDrop.onDragStart(cellEditToolbar.cell, e);
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
                    (this.menu.parent as CellEditToolbar).onCellOptions(e);
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
                    (this.menu.parent as CellEditToolbar).onCellDestroy(e);
                }
            }
        }
    })

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

    public onMouseMove(
        cell: Cell
    ): void {
        const toolbar = this,
            cellCnt = cell.container,
            width = toolbar.container.clientWidth,
            isCellResizing = (cell.row.layout.resizer || {}).currentCell;

        let x, y;

        if (
            cellCnt &&
            toolbar.editMode.isActive() &&
            !isCellResizing &&
            !(toolbar.editMode.dragDrop || {}).isActive
        ) {
            x = GUIElement.getCellOffset(cell, 'offsetLeft') + cellCnt.clientWidth - width;
            y = GUIElement.getCellOffset(cell, 'offsetTop');

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
        const toolbar = this;

        if (toolbar.cell && toolbar.cell.container) {
            super.refreshOutline(
                toolbar.container.offsetWidth - toolbar.cell.container.offsetWidth,
                0,
                this.cell
            );
        }
    }

    public onCellOptions(
        e: any
    ): void {
        const toolbar = this;

        if (toolbar.editMode.sidebar) {
            // debugger;
            toolbar.editMode.sidebar.show(toolbar.cell);
            toolbar.editMode.sidebar.updateTitle('CELL OPTIONS');

            if (this.cell) {
                super.maskNotEditedElements(
                    this.cell
                );
                this.editedCell = this.cell;
            }
        }
    }

    public onCellDestroy(e: any): void {
        const toolbar = this;

        if (toolbar.cell) {
            toolbar.cell.destroy();
            toolbar.cell = void 0;

            // Hide row and cell toolbars.
            toolbar.editMode.hideToolbars(['cell', 'row']);
            this.resetEditedCell();
        }
    }

    public resetEditedCell(): void {
        super.resetCurrentElements();
        this.editedCell = void 0;
    }
}

namespace CellEditToolbar {
    export interface Options extends EditToolbar.Options {}
}

export default CellEditToolbar;

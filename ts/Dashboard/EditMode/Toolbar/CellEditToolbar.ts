import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Cell from '../../Layout/Cell.js';
import EditGlobals from '../EditGlobals.js';
import Menu from '../Menu/Menu.js';
import MenuItem from '../Menu/MenuItem.js';
import EditToolbar from './EditToolbar.js';

const {
    addEvent,
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
                click: function (this: MenuItem, e: any): void {}
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

        this.setEvents();
        this.menu.initItems(CellEditToolbar.items);
    }

    /* *
    *
    *  Properties
    *
    * */
    public cell?: Cell;

    /* *
    *
    *  Functions
    *
    * */

    private setEvents(): void {
        const toolbar = this,
            dashboard = toolbar.editMode.dashboard;

        for (let i = 0, iEnd = dashboard.layouts.length; i < iEnd; ++i) {
            const layout = dashboard.layouts[i];

            for (let j = 0, jEnd = layout.rows.length; j < jEnd; ++j) {
                const row = layout.rows[j];

                for (let k = 0, kEnd = row.cells.length; k < kEnd; ++k) {
                    const cell = row.cells[k];

                    if (cell.container) {
                        addEvent(cell.container, 'mousemove', function (): void {
                            toolbar.onMouseMove(cell);
                        });
                    }
                }
            }
        }
    }

    private onMouseMove(
        cell: Cell
    ): void {
        const toolbar = this,
            cellCnt = cell.container;

        let x, y;

        if (cellCnt && toolbar.editMode.isActive()) {
            x = ((cellCnt.parentElement || {}).offsetLeft || 0) +
              cellCnt.offsetLeft + cellCnt.offsetWidth - 30;

            y = ((cellCnt.parentElement || {}).offsetTop || 0) +
              cellCnt.offsetTop;

            // Temp - activate all items.
            objectEach(toolbar.menu.items, (item): void => {
                item.activate();
            });

            toolbar.setPosition(x, y);
            toolbar.cell = cell;
        }
    }

    public onCellOptions(
        e: any
    ): void {
        const toolbar = this;

        if (toolbar.editMode.sidebar) {
            toolbar.editMode.sidebar.show();
            toolbar.editMode.sidebar.updateTitle('CELL OPTIONS');

            // temporary -> move to OptionsToolbar
            this.cell?.container?.classList.add(EditGlobals.classNames.currentEditedCell);
            this.cell?.row.layout.dashboard.container.classList.add(
                EditGlobals.classNames.disabledNotEditedCells
            );
        }
    }

    public onCellDestroy(e: any): void {
        const toolbar = this;

        if (toolbar.cell) {
            toolbar.cell.destroy();
            toolbar.cell = void 0;

            // Hide row and cell toolbars.
            toolbar.editMode.hideToolbars(['cell', 'row']);
        }
    }
}

namespace CellEditToolbar {
    export interface Options extends EditToolbar.Options {}
}

export default CellEditToolbar;

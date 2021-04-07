import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Cell from '../../Layout/Cell.js';
import EditGlobals from '../EditGlobals.js';
import Menu from '../Menu/Menu.js';
import MenuItem from '../Menu/MenuItem.js';

const {
    addEvent,
    merge,
    objectEach
} = U;

class CellEditToolbar extends Menu {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: CellEditToolbar.Options = {
        enabled: true,
        className: EditGlobals.classNames.editToolbar,
        itemsClassName: EditGlobals.classNames.editToolbarItem,
        items: ['drag', 'settings', 'destroy']
    }

    public static items: Record<string, MenuItem.Options> =
    merge(Menu.items, {
        drag: {
            type: 'drag',
            text: 'd',
            icon: '',
            events: {
                click: function (this: MenuItem, e: any): void {}
            }
        },
        settings: {
            type: 'settings',
            text: 'opt',
            icon: '',
            events: {
                click: function (this: MenuItem, e: any): void {
                    (this.menu as CellEditToolbar).onCellOptions(e);
                }
            }
        },
        destroy: {
            type: 'destroy',
            text: 'de',
            icon: '',
            events: {
                click: function (this: MenuItem, e: any): void {}
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
            editMode.dashboard.container,
            merge(
                CellEditToolbar.defaultOptions,
                editMode.options.toolbars && editMode.options.toolbars.cell
            )
        );

        this.editMode = editMode;

        this.setEvents();
        super.initItems(CellEditToolbar.items);
    }

    /* *
    *
    *  Properties
    *
    * */
    public cell?: Cell;
    public editMode: EditMode;

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
            objectEach(toolbar.items, (item): void => {
                item.activate();
            });
            super.show(x, y);

            toolbar.cell = cell;
        }
    }

    public onCellOptions(
        e: any
    ): void {
        const toolbar = this;

        if (toolbar.editMode.optionsToolbar) {
            // ['title', 'option1'] will be dynamic.
            toolbar.editMode.optionsToolbar.showOptions([
                'title',
                'option1'
            ]);

            // temporary -> move to OptionsToolbar
            this.cell?.container?.classList.add(EditGlobals.classNames.currentEditedCell);
            this.cell?.row.layout.dashboard.container.classList.add(
                EditGlobals.classNames.disabledNotEditedCells
            );
        }
    }

    public hide(): void {
        super.hide();
        this.cell = void 0;
    }
}

namespace CellEditToolbar {
    export interface Options extends Menu.Options {}
}

export default CellEditToolbar;

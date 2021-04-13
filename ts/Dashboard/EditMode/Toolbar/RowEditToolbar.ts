import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Row from '../../Layout/Row.js';
import EditGlobals from '../EditGlobals.js';
import Menu from '../Menu/Menu.js';
import MenuItem from '../Menu/MenuItem.js';
import EditToolbar from './EditToolbar.js';

const {
    addEvent,
    merge,
    objectEach
} = U;

class RowEditToolbar extends EditToolbar {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: RowEditToolbar.Options = {
        enabled: true,
        className: EditGlobals.classNames.editToolbar,
        menu: {
            className: EditGlobals.classNames.editToolbarRow,
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
                click: function (): void {}
            }
        },
        settings: {
            id: 'settings',
            type: 'icon',
            icon: EditGlobals.iconsURL + 'settings.svg',
            events: {
                click: function (this: MenuItem, e: any): void {
                    (this.menu.parent as RowEditToolbar).onRowOptions(e);
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
                    (this.menu.parent as RowEditToolbar).onRowDestroy(e);
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
                RowEditToolbar.defaultOptions,
                (editMode.options.toolbars || {}).row
            )
        );

        this.setEvents();
        this.menu.initItems(RowEditToolbar.items);
    }

    /* *
    *
    *  Properties
    *
    * */
    public row?: Row;

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

                if (row.container) {
                    addEvent(row.container, 'mousemove', function (): void {
                        toolbar.onMouseMove(row);
                    });
                }
            }
        }
    }

    private onMouseMove(
        row: Row
    ): void {
        const toolbar = this,
            rowCnt = row.container;

        let x, y;

        if (rowCnt && toolbar.editMode.isActive()) {
            x = rowCnt.offsetLeft;
            y = rowCnt.offsetTop;

            // Temp - activate all items.
            objectEach(toolbar.menu.items, (item): void => {
                item.activate();
            });
            toolbar.setPosition(x, y);
            toolbar.row = row;
        }
    }

    public onRowOptions(
        e: any
    ): void {
        const toolbar = this;

        if (toolbar.editMode.sidebar) {
            toolbar.editMode.sidebar.show();
            toolbar.editMode.sidebar.updateTitle('ROW OPTIONS');

            // temporary -> move to OptionsToolbar
            this.row?.container?.classList.add(EditGlobals.classNames.currentEditedRow);
            this.row?.layout.dashboard.container.classList.add(
                EditGlobals.classNames.disabledNotEditedRows
            );
        }
    }

    public onRowDestroy(e: any): void {
        const toolbar = this;

        if (toolbar.row) {
            toolbar.row.destroy();
            toolbar.row = void 0;

            // Hide row and cell toolbars.
            toolbar.editMode.hideToolbars(['cell', 'row']);
        }
    }
}

namespace RowEditToolbar {
    export interface Options extends EditToolbar.Options {}
}

export default RowEditToolbar;

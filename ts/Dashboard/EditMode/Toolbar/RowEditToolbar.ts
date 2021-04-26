import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Row from '../../Layout/Row.js';
import EditGlobals from '../EditGlobals.js';
import Menu from '../Menu/Menu.js';
import MenuItem from '../Menu/MenuItem.js';
import EditToolbar from './EditToolbar.js';
import GUIElement from '../../Layout/GUIElement.js';

const {
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
        outline: true,
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

        this.menu.initItems(RowEditToolbar.items);
    }

    /* *
    *
    *  Properties
    *
    * */
    public row?: Row;
    public editedRow?: Row;

    /* *
    *
    *  Functions
    *
    * */

    public refreshOutline(): void {
        const toolbar = this;

        if (toolbar.row && toolbar.row.container) {
            super.refreshOutline(0, 0, this.row);
        }
    }

    public onMouseMove(
        row: Row
    ): void {
        const toolbar = this,
            rowCnt = row.container;

        let x, y;

        if (
            row.cells.length > 1 && // -> to discuss
            rowCnt &&
            toolbar.editMode.isActive() &&
            !(toolbar.editMode.dragDrop || {}).isActive
        ) {
            x = GUIElement.getCellOffset(row.cells[0], 'offsetLeft');
            y = GUIElement.getCellOffset(row.cells[0], 'offsetTop');

            // Temp - activate all items.
            objectEach(toolbar.menu.items, (item): void => {
                item.activate();
            });
            toolbar.setPosition(x, y);
            toolbar.row = row;
        } else if (toolbar.isVisible) {
            toolbar.hide();
        }
    }

    public onRowOptions(
        e: any
    ): void {
        const toolbar = this;

        if (toolbar.editMode.sidebar) {
            toolbar.editMode.sidebar.show(toolbar.row);
            toolbar.editMode.sidebar.updateTitle('ROW OPTIONS');

            if (this.row) {
                super.maskNotEditedElements(
                    this.row,
                    true
                );
                this.editedRow = this.row;
            }
        }
    }

    public onRowDestroy(e: any): void {
        const toolbar = this;

        if (toolbar.row) {
            toolbar.row.destroy();
            toolbar.row = void 0;

            // Hide row and cell toolbars.
            toolbar.editMode.hideToolbars(['cell', 'row']);
            this.resetEditedRow();
        }
    }

    public resetEditedRow(): void {
        super.resetCurrentElements();
        this.editedRow = void 0;
    }
}

namespace RowEditToolbar {
    export interface Options extends EditToolbar.Options {}
}

export default RowEditToolbar;

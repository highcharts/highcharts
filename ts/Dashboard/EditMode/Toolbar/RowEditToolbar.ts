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
        outlineClassName: EditGlobals.classNames.editToolbarRowOutline,
        menu: {
            className: EditGlobals.classNames.editToolbarRow,
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
                    const rowEditToolbar = (this.menu.parent as RowEditToolbar),
                        dragDrop = rowEditToolbar.editMode.dragDrop;

                    if (dragDrop && rowEditToolbar.row) {
                        dragDrop.onDragStart(e, rowEditToolbar.row);
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
                    const parentNode = (this.menu.parent as RowEditToolbar);
                    const popup = this.menu.parent.editMode.confirmationPopup;

                    popup.show({
                        confirmButton: {
                            value: EditGlobals.lang.confirmButton,
                            callback: parentNode.onRowDestroy,
                            context: parentNode
                        },
                        cancelButton: {
                            value: EditGlobals.lang.cancelButton,
                            callback: (): void => {
                                popup.closePopup();
                            }
                        },
                        text: EditGlobals.lang.confirmDestroyRow
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

    public refreshOutline(
        x: number,
        y: number
    ): void {
        const toolbar = this,
            offsetWidth = 2;

        if (toolbar.row && toolbar.row.container) {
            super.refreshOutline(x, y, this.row, offsetWidth);
        }
    }

    public showToolbar(
        row: Row
    ): void {
        const toolbar = this,
            rowCnt = row.container;

        let x, y, offsetX;

        if (
            rowCnt &&
            toolbar.editMode.isActive() &&
            !(toolbar.editMode.dragDrop || {}).isActive
        ) {
            const rowOffsets = GUIElement.getOffsets(
                row,
                toolbar.editMode.dashboard.container
            );
            const rowWidth = rowOffsets.right - rowOffsets.left;

            // Temp - activate all items.
            objectEach(toolbar.menu.items, (item): void => {
                item.activate();
            });

            offsetX = rowWidth / 2 - toolbar.container.clientWidth / 2;
            x = rowOffsets.left + offsetX;
            y = rowOffsets.top - toolbar.container.clientHeight;
            toolbar.setPosition(x, y);
            toolbar.row = row;
            toolbar.refreshOutline(-offsetX, toolbar.container.clientHeight);
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
            // toolbar.editMode.sidebar.updateTitle('ROW OPTIONS');

            // @ToDo - mask is buggy - should be refactored or removed.
            // if (this.row) {
            //     super.maskNotEditedElements(
            //         this.row,
            //         true
            //     );
            //     this.editedRow = this.row;
            // }
        }
    }

    public onRowDestroy(e: any): void {
        const toolbar = this;

        if (toolbar.row) {

            this.resetEditedRow();

            toolbar.row.destroy();
            toolbar.row = void 0;

            // Hide row and cell toolbars.
            toolbar.editMode.hideToolbars(['cell', 'row']);
        }
    }

    public resetEditedRow(): void {
        // super.resetCurrentElements(this.row as Row, true);
        this.editedRow = void 0;
    }
}

namespace RowEditToolbar {
    export interface Options extends EditToolbar.Options {}
}

export default RowEditToolbar;

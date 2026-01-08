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

import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Row from '../../Layout/Row.js';
import EditGlobals from '../EditGlobals.js';
import MenuItem from '../Menu/MenuItem.js';
import EditToolbar from './EditToolbar.js';
import GUIElement from '../../Layout/GUIElement.js';

const {
    fireEvent,
    merge,
    objectEach
} = U;

/**
 * @internal
 */
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
            items: []
        }
    };

    public static getMenuItemsConfig(
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
                        const rowEditToolbar = this.menu
                                .parent as RowEditToolbar,
                            dragDrop = rowEditToolbar.editMode.dragDrop;

                        e.preventDefault();

                        if (dragDrop && rowEditToolbar.row) {
                            dragDrop.onDragStart(e, rowEditToolbar.row);
                        }
                    }
                }
            });
        }

        items.push({
            id: 'destroy',
            type: 'icon' as const,
            className: EditGlobals.classNames.menuDestroy,
            icon: iconURLPrefix + 'destroy.svg',
            events: {
                click: function (this: MenuItem): void {
                    const parentNode = this.menu.parent as RowEditToolbar,
                        editMode = this.menu.parent.editMode,
                        popup = editMode.confirmationPopup;

                    popup.show({
                        confirmButton: {
                            value: editMode.lang.confirmButton,
                            callback: parentNode.onRowDestroy,
                            context: parentNode
                        },
                        cancelButton: {
                            value: editMode.lang.cancelButton,
                            callback: (): void => {
                                popup.closePopup();
                            }
                        },
                        text: editMode.lang.confirmDestroyRow
                    });
                }
            }
        });

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
                RowEditToolbar.defaultOptions,
                (editMode.options.toolbars || {}).row,
                {
                    menu: {
                        items: RowEditToolbar.getMenuItemsConfig(
                            editMode.options,
                            editMode.iconsURLPrefix
                        )
                    }
                }
            )
        );

        this.menu.initItems({});
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

    public refreshOutline(x: number, y: number): void {
        const toolbar = this,
            offsetWidth = 2;

        if (toolbar.row && toolbar.row.container) {
            super.refreshOutline(x, y, this.row, offsetWidth);
        }
    }

    public showToolbar(row: Row): void {
        const toolbar = this;
        const rowCnt = row.container;
        const rowToolbar = toolbar.editMode.rowToolbar;
        let x;
        let y;
        let offsetX;

        if (!rowToolbar) {
            return;
        }

        if (
            rowCnt &&
            toolbar.editMode.isActive() &&
            !(toolbar.editMode.dragDrop || {}).isActive
        ) {
            const rowOffsets = GUIElement.getOffsets(
                row,
                toolbar.editMode.board.container
            );
            const rowWidth = rowOffsets.right - rowOffsets.left;

            objectEach(toolbar.menu.items, (item): void => {
                if (!row.options?.editMode?.toolbarItems) {
                    item.activate();
                    return;
                }
                const toolbarItems = row.options.editMode.toolbarItems;

                if (
                    toolbarItems[item.options.id as keyof typeof toolbarItems]
                        ?.enabled === false
                ) {
                    item.deactivate();
                    return;
                }

                item.activate();
            });

            offsetX = rowWidth / 2 - toolbar.container.clientWidth / 2;
            x = rowOffsets.left + offsetX;
            y = rowOffsets.top - toolbar.container.clientHeight;
            toolbar.setPosition(x, y);
            toolbar.row = row;
            toolbar.refreshOutline(-offsetX, toolbar.container.clientHeight);
            rowToolbar.isVisible = true;
        } else if (toolbar.isVisible) {
            toolbar.hide();
            rowToolbar.isVisible = false;
        }
    }

    public onRowOptions(): void {
        const toolbar = this;

        if (toolbar.editMode.sidebar) {
            toolbar.editMode.sidebar.show(toolbar.row);
        }
    }

    public onRowDestroy(): void {
        const toolbar = this;

        if (toolbar.row) {
            const rowId = toolbar.row.options.id || -1;

            this.resetEditedRow();

            toolbar.row.destroy();
            toolbar.row = void 0;

            // Hide row and cell toolbars.
            toolbar.editMode.hideToolbars(['cell', 'row']);
            toolbar.editMode.resizer?.disableResizer();

            fireEvent(toolbar.editMode, 'layoutChanged', {
                type: 'rowDestroyed',
                target: rowId,
                board: toolbar.editMode.board
            });
        }
    }

    public resetEditedRow(): void {
        /// super.resetCurrentElements(this.row as Row, true);
        this.editedRow = void 0;
    }
}

namespace RowEditToolbar {
    export interface Options extends EditToolbar.Options {}
}

export default RowEditToolbar;

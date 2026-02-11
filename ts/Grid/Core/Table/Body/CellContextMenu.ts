/* *
 *
 *  Grid Cell Context Menu
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Authors:
 *  - Mikkel Espolin Birkeland
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type TableCell from './TableCell';

import ContextMenu from '../../UI/ContextMenu.js';
import ContextMenuButton from '../../UI/ContextMenuButton.js';
import U from '../../../../Core/Utilities.js';

const {
    addEvent
} = U;

/* *
 *
 *  Class
 *
 * */

class CellContextMenu extends ContextMenu {

    public cell?: TableCell;

    private cursorAnchorElement?: HTMLElement;
    private removeCellOutdateListener?: ReturnType<typeof addEvent>;

    public showAt(cell: TableCell, clientX: number, clientY: number): void {
        const wrapper = this.grid.contentWrapper;
        if (!wrapper) {
            return;
        }

        this.cell = cell;
        this.removeCellOutdateListener?.();
        this.removeCellOutdateListener = addEvent(cell, 'outdate', (): void => {
            this.hide();
            delete this.cell;
        });

        const rect = wrapper.getBoundingClientRect();

        this.cursorAnchorElement = document.createElement('div');
        this.cursorAnchorElement.style.position = 'absolute';
        this.cursorAnchorElement.style.left = (clientX - rect.left) + 'px';
        this.cursorAnchorElement.style.top = (clientY - rect.top) + 'px';
        this.cursorAnchorElement.style.width = '0px';
        this.cursorAnchorElement.style.height = '0px';
        this.cursorAnchorElement.style.pointerEvents = 'none';

        wrapper.appendChild(this.cursorAnchorElement);

        super.show(this.cursorAnchorElement);
    }

    public override hide(): void {
        super.hide();
        this.cursorAnchorElement?.remove();
        this.removeCellOutdateListener?.();
        delete this.cursorAnchorElement;
        delete this.removeCellOutdateListener;
    }

    protected override renderContent(): void {
        const { cell } = this;
        if (!cell) {
            return;
        }

        const items = cell.column?.options.cells?.contextMenu?.items || [];

        for (const item of items) {
            if (item.separator) {
                this.addDivider();
                continue;
            }

            const btn = new ContextMenuButton({
                label: item.label,
                icon: item.icon,
                onClick: (): void => {
                    if (item.disabled) {
                        return;
                    }

                    item.onClick?.call(cell, cell);
                    this.hide();
                }
            }).add(this);

            if (btn && item.disabled) {
                // Minimal disable support for v1. We don't currently have a
                // dedicated ContextMenuButton API for disabled state.
                // This keeps behavior consistent without introducing new CSS.
                btn.wrapper?.querySelector('button')?.setAttribute(
                    'disabled',
                    ''
                );
            }
        }
    }
}

export default CellContextMenu;

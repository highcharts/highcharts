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

import type Grid from '../../Grid';
import type TableCell from './TableCell';
import type {
    CellContextMenuItemOptions,
    CellContextMenuContext
} from '../../Options';

import ContextMenu from '../../UI/ContextMenu.js';
import ContextMenuButton from '../../UI/ContextMenuButton.js';

/* *
 *
 *  Class
 *
 * */

class CellContextMenu extends ContextMenu {

    public readonly cell: TableCell;

    private readonly items: Array<CellContextMenuItemOptions>;

    private cursorAnchorElement?: HTMLElement;

    constructor(
        grid: Grid,
        cell: TableCell,
        items: Array<CellContextMenuItemOptions>
    ) {
        super(grid);

        this.cell = cell;
        this.items = items;
    }

    public showAt(clientX: number, clientY: number): void {
        const wrapper = this.grid.contentWrapper;
        if (!wrapper) {
            return;
        }

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
        delete this.cursorAnchorElement;
    }

    protected override renderContent(): void {
        const cell = this.cell;
        const ctx: CellContextMenuContext = {
            cell,
            row: cell.row,
            column: cell.column
        };

        for (const item of this.items) {
            if (item.separator) {
                this.addDivider();
                continue;
            }

            const btn = new ContextMenuButton({
                label: item.label,
                icon: item.icon,
                onClick: (e): void => {
                    if (item.disabled) {
                        return;
                    }

                    void e;

                    // Pass the cell context both as `this` (Highcharts-style)
                    // and as an argument so arrow functions can use it.
                    item.onClick?.call(ctx, ctx);

                    // Auto-close after click (typical context menu behavior)
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

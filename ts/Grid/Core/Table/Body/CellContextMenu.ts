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

    public cell?: TableCell;

    private items: Array<CellContextMenuItemOptions> = [];

    private cursorAnchorElement?: HTMLElement;

    private context?: CellContextMenuContext;

    public setContext(
        cell: TableCell,
        items: Array<CellContextMenuItemOptions>
    ): void {
        this.cell = cell;
        this.items = items;
        this.context = this.getContextSnapshot(cell);
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
        const ctx = this.context;
        if (!ctx) {
            return;
        }

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

    private getContextSnapshot(cell: TableCell): CellContextMenuContext {
        type Mutable<T> = { -readonly [K in keyof T]: T[K] };
        const cloneWithProto = <T extends object>(source: T): T => {
            const clone = Object.create(Object.getPrototypeOf(source));
            return Object.assign(clone, source);
        };

        const rowSnapshot = cloneWithProto(cell.row);
        const columnSnapshot = cloneWithProto(cell.column);
        const cellSnapshot = cloneWithProto(cell) as TableCell;

        (cellSnapshot as Mutable<TableCell>).row =
            rowSnapshot as TableCell['row'];
        cellSnapshot.column = columnSnapshot as TableCell['column'];

        return {
            cell: cellSnapshot,
            row: rowSnapshot as TableCell['row'],
            column: columnSnapshot as TableCell['column']
        };
    }
}

export default CellContextMenu;

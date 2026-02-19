/* *
 *
 *  Adjacent Resizing Mode class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type ColumnsResizer from '../Actions/ColumnsResizer';

import ResizingMode from './ResizingMode.js';


/* *
 *
 *  Class
 *
 * */

class AdjacentResizingMode extends ResizingMode {

    /* *
     *
     *  Properties
     *
     * */

    public override readonly type = 'adjacent' as const;


    /* *
     *
     *  Methods
     *
     * */

    public override resize(resizer: ColumnsResizer, diff: number): void {
        const vp = this.viewport;
        const column = resizer.draggedColumn;
        if (!column) {
            return;
        }

        const colW = resizer.columnStartWidth ?? 0;
        const minWidth = ResizingMode.getMinWidth(column);
        const nextCol = vp.columns[column.index + 1];

        const newW = Math.round(Math.max(colW + diff, minWidth) * 10) / 10;

        this.columnWidths[column.id] = newW;
        this.columnWidthUnits[column.id] = 0; // Always save in px
        column.setOptions({ width: newW });

        if (nextCol) {
            const newNextW = this.columnWidths[nextCol.id] = Math.round(
                Math.max(
                    (resizer.nextColumnStartWidth ?? 0) + colW - newW,
                    minWidth
                ) * 10
            ) / 10;
            this.columnWidthUnits[nextCol.id] = 0; // Always save in px
            nextCol.setOptions({ width: newNextW });
        }
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default AdjacentResizingMode;

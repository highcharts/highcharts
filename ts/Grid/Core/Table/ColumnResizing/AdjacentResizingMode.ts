/* *
 *
 *  Adjacent Resizing Mode class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
        column.update({ width: newW }, false);

        if (nextCol) {
            const newNextW = this.columnWidths[nextCol.id] = Math.round(
                Math.max(
                    (resizer.nextColumnStartWidth ?? 0) + colW - newW,
                    minWidth
                ) * 10
            ) / 10;
            this.columnWidthUnits[nextCol.id] = 0; // Always save in px
            nextCol.update({ width: newNextW }, false);
        }
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default AdjacentResizingMode;

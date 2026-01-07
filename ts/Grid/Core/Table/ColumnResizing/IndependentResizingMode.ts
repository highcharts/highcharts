/* *
 *
 *  Independent Resizing Mode class
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

import type ColumnsResizer from '../Actions/ColumnsResizer.js';

import ResizingMode from './ResizingMode.js';


/* *
 *
 *  Class
 *
 * */

class IndependentResizingMode extends ResizingMode {

    /* *
     *
     *  Properties
     *
     * */

    public override readonly type = 'independent' as const;


    /* *
     *
     *  Methods
     *
     * */

    public override resize(resizer: ColumnsResizer, diff: number): void {
        const column = resizer.draggedColumn;
        if (!column) {
            return;
        }

        // Set the width of the resized column.
        const width = this.columnWidths[column.id] = Math.round(Math.max(
            (resizer.columnStartWidth || 0) + diff,
            ResizingMode.getMinWidth(column)
        ) * 10) / 10;
        this.columnWidthUnits[column.id] = 0; // Set to px

        // Change width units of all columns on the right to px.
        const vp = this.viewport;
        const colIndex = column.index;
        for (let i = colIndex; i < vp.columns.length; ++i) {
            const rightCol = vp.columns[i];
            const rcWidth = this.columnWidths[rightCol.id] =
                rightCol.getWidth();
            this.columnWidthUnits[rightCol.id] = 0; // Set to px
            rightCol.setOptions({ width: rcWidth });
        }

        column.setOptions({ width });
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default IndependentResizingMode;

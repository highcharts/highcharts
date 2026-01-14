/* *
 *
 *  Distributed Resizing Mode class
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

class DistributedResizingMode extends ResizingMode {

    /* *
     *
     *  Properties
     *
     * */

    public override readonly type = 'distributed' as const;


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

        column.setOptions({ width });
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default DistributedResizingMode;

/* *
 *
 *  Cell Content abstract class
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

import TableCell from '../Body/TableCell.js';


/* *
 *
 *  Class
 *
 * */

abstract class CellContent {
    
    public readonly cell: TableCell;

    public constructor(cell: TableCell) {
        this.cell = cell;
    }

    /**
     * Render the cell content.
     */
    public abstract render(): void;

    /**
     * Destroy the cell content.
     */
    public abstract destroy(): void;
}


/* *
 *
 *  Default Export
 *
 * */

export default CellContent;

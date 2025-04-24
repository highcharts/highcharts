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

    public abstract options: CellContent.Options;
    
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
 *  Namespace
 *
 * */

namespace CellContent {

    export interface Options {
        /**
         * The cell content type.
         */
        type: string;

        /**
         * Disable double click to trigger the cell value editor (regular text
         * input).
         *
         * @internal TODO: move to Pro
         */
        disableDblClickEditor?: boolean;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default CellContent;

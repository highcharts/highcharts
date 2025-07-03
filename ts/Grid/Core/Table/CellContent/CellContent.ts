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

import type TableCell from '../Body/TableCell';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a cell content in the grid.
 */
abstract class CellContent {

    /**
     * The cell to which the content belongs.
     */
    public readonly cell: TableCell;

    /**
     * Creates and renders the cell content.
     *
     * @param cell
     * The cell to which the content belongs.
     */
    public constructor(cell: TableCell) {
        this.cell = cell;
    }

    /**
     * Renders the cell content.
     */
    protected abstract add(): void;

    /**
     * Destroy the cell content.
     */
    public abstract destroy(): void;

    /**
     * Updates the cell content without re-rendering it.
     */
    public abstract update(): void;
}


/* *
 *
 *  Default Export
 *
 * */

export default CellContent;

/* *
 *
 *  Cell Content abstract class
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

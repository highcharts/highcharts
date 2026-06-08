/* *
 *
 *  Cell Content abstract class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Dawid Draguła
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

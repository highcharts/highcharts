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

/**
 * Represents a cell content in the grid.
 */
abstract class CellContent {

    public readonly parentElement: HTMLElement;
    public readonly cell: TableCell;

    /**
     * Creates and renders the cell content.
     *
     * @param cell
     * The cell to which the content belongs.
     *
     * @param parent 
     * The parent element to which the content will be appended. If not
     * provided, the cell's HTML element will be used.
     */
    public constructor(
        cell: TableCell,
        parent: HTMLElement = cell.htmlElement
    ) {
        this.cell = cell;
        this.parentElement = parent;
    }

    /**
     * Renders the cell content.
     */
    protected abstract add(): void;

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

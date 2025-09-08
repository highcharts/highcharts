/* *
 *
 *  Cell Content Pro abstract class
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

import type CellRenderer from './CellRenderer';
import type TableCell from '../../Core/Table/Body/TableCell';

import CellContent from '../../Core/Table/CellContent/CellContent.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a cell content in the grid.
 */
abstract class CellContentPro extends CellContent {

    /**
     * The renderer that allows to print content (inputs, selects, etc.)
     */
    public readonly renderer: CellRenderer;

    /**
     * Creates and renders the cell content.
     *
     * @param cell
     * The cell to which the content belongs.
     *
     * @param renderer
     * Renderer that allows print content (inputs, selects, etc.)
     */
    constructor(cell: TableCell, renderer: CellRenderer) {
        super(cell);
        this.renderer = renderer;
    }
}


/* *
 *
 * Default Export
 *
 * */

export default CellContentPro;

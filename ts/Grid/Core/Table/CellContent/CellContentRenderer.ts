/* *
 *
 *  Cell Content Renderer abstract class
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

abstract class CellContentRenderer {
    public abstract render(cell: TableCell): void;
}


/* *
 *
 *  Default Export
 *
 * */

export default CellContentRenderer;

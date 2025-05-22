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

abstract class CellContentPro extends CellContent {
    
    public readonly renderer: CellRenderer;
    
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

/* *
 *
 *  Custom Distribution class
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

import type Column from '../Column.js';
import type ColumnsResizer from '../Actions/ColumnsResizer';

import DistributionStrategy from './ColumnDistributionStrategy.js';


/* *
 *
 *  Class
 *
 * */

class CustomDistributionStrategy extends DistributionStrategy {

    /* *
     *
     *  Properties
     *
     * */

    public override readonly type: 'custom' = 'custom';


    /* *
     *
     *  Methods
     *
     * */

    public override loadColumn(column: Column): void {

    }

    public override getColumnWidth(column: Column): number {
        return 1;
    }

    public override resize(resizer: ColumnsResizer, diff: number): void {
        
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default CustomDistributionStrategy;

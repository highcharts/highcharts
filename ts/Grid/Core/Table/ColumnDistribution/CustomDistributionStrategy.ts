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

import type Table from '../Table';
import type Column from '../Column.js';

import DistributionStrategy from './ColumnDistributionStrategy.js';


/* *
 *
 *  Class
 *
 * */

class CustomDistributionStrategy extends DistributionStrategy {

    public override readonly type: 'custom' = 'custom';

    constructor (viewport: Table) {
        super(viewport);
    }

    public override loadColumn(column: Column): void {

    }

    public override getColumnWidth(column: Column): number {
        return 1;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default CustomDistributionStrategy;

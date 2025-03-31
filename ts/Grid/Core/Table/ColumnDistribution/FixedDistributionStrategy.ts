/* *
 *
 *  Fixed Distribution class
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
import Globals from '../../Globals.js';

import GridUtils from '../../GridUtils.js';
const {
    makeHTMLElement
} = GridUtils;


/* *
 *
 *  Class
 *
 * */

class FixedDistributionStrategy extends DistributionStrategy {

    public override readonly type: 'fixed' = 'fixed';

    constructor (viewport: Table) {
        super(viewport);
    }

    public override loadColumn(column: Column): void {
        this.columnWidths[column.id] = this.getInitialColumnWidth(column);
    }

    public override getColumnWidth(column: Column): number {
        return this.columnWidths[column.id];
    }


    /**
     * Creates a mock element to measure the width of the column from the CSS.
     * The element is appended to the viewport container and then removed.
     * It should be called only once for each column.
     *
     * @returns The initial width of the column.
     */
    private getInitialColumnWidth(column: Column): number {
        let result: number;
        const { viewport } = this;

        // Set the initial width of the column.
        const mock = makeHTMLElement('div', {
            className: Globals.getClassName('columnElement')
        }, viewport.grid.container);

        mock.setAttribute('data-column-id', column.id);
        if (column.options.className) {
            mock.classList.add(...column.options.className.split(/\s+/g));
        }

        result = mock.offsetWidth || 100;
        mock.remove();

        return result;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default FixedDistributionStrategy;

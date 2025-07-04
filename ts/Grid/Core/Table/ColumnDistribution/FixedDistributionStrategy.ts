/* *
 *
 *  Fixed Distribution Strategy class
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
import type ColumnsResizer from '../Actions/ColumnsResizer.js';

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

    /* *
     *
     *  Properties
     *
     * */

    public override readonly type = 'fixed' as const;

    /**
     * Array of units for each column width value. Codified as:
     * - `0` - px
     * - `1` - %
     */
    private columnWidthUnits: Record<string, number> = {};


    /* *
     *
     *  Methods
     *
     * */

    public override loadColumn(column: Column): void {
        const rawWidth = column.options.width;
        if (!rawWidth) {
            this.columnWidths[column.id] = this.getInitialColumnWidth(column);
            this.columnWidthUnits[column.id] = 0;
            return;
        }

        let value: number;
        let unitCode: number = 0;

        if (typeof rawWidth === 'number') {
            value = rawWidth;
            unitCode = 0;
        } else {
            value = parseFloat(rawWidth);
            unitCode = rawWidth.charAt(rawWidth.length - 1) === '%' ? 1 : 0;
        }

        this.columnWidthUnits[column.id] = unitCode;
        this.columnWidths[column.id] = value;
    }

    public override getColumnWidth(column: Column): number {
        const vp = this.viewport;
        const widthValue = this.columnWidths[column.id];
        const minWidth = DistributionStrategy.getMinWidth(column);

        if (this.columnWidthUnits[column.id] === 1) {
            // If %:
            return Math.max(vp.getWidthFromRatio(widthValue / 100), minWidth);
        }

        // If px:
        return widthValue || 100; // Default to 100px if not defined
    }

    public override resize(resizer: ColumnsResizer, diff: number): void {
        const column = resizer.draggedColumn;
        if (!column) {
            return;
        }

        const width = this.columnWidths[column.id] = Math.round(Math.max(
            (resizer.columnStartWidth || 0) + diff,
            DistributionStrategy.getMinWidth(column)
        ) * 10) / 10;
        this.columnWidthUnits[column.id] = 0; // Always save in px

        column.update({ width }, false);
    }

    /**
     * Creates a mock element to measure the width of the column from the CSS.
     * The element is appended to the viewport container and then removed.
     * It should be called only once for each column.
     *
     * @param column
     * The column for which the initial width is being calculated.
     *
     * @returns The initial width of the column.
     */
    private getInitialColumnWidth(column: Column): number {
        const { viewport } = this;

        // Set the initial width of the column.
        const mock = makeHTMLElement('div', {
            className: Globals.getClassName('columnElement')
        }, viewport.grid.container);

        mock.setAttribute('data-column-id', column.id);
        if (column.options.className) {
            mock.classList.add(...column.options.className.split(/\s+/g));
        }

        const result = mock.offsetWidth || 100;
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

/* *
 *
 *  Full Distribution Strategy class
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

/**
 * @deprecated
 * This strategy is deprecated and will be removed in the future.
 */
class FullDistributionStrategy extends DistributionStrategy {

    /* *
    *
    *  Properties
    *
    * */

    public override readonly type = 'full' as const;

    private allPreviousWidths: number = 0;


    /* *
    *
    *  Methods
    *
    * */

    public override loadColumn(column: Column): void {
        const width = this.getInitialColumnWidth(column);
        this.allPreviousWidths += width;
        this.columnWidths[column.id] = width;
    }

    public override getColumnWidth(column: Column): number {
        return this.viewport.getWidthFromRatio(
            this.columnWidths[column.id] || 0
        );
    }

    public override resize(resizer: ColumnsResizer, diff: number): void {
        const vp = this.viewport;

        const column = resizer.draggedColumn;
        if (!column) {
            return;
        }

        const nextColumn = vp.columns[column.index + 1];
        if (!nextColumn) {
            return;
        }

        const leftColW = resizer.columnStartWidth ?? 0;
        const rightColW = resizer.nextColumnStartWidth ?? 0;
        const minWidth = DistributionStrategy.getMinWidth(column);

        let newLeftW = leftColW + diff;
        let newRightW = rightColW - diff;

        if (newLeftW < minWidth) {
            newLeftW = minWidth;
            newRightW = leftColW + rightColW - minWidth;
        }

        if (newRightW < minWidth) {
            newRightW = minWidth;
            newLeftW = leftColW + rightColW - minWidth;
        }

        const leftW = this.columnWidths[column.id] =
            vp.getRatioFromWidth(newLeftW);

        const rightW = this.columnWidths[nextColumn.id] =
            vp.getRatioFromWidth(newRightW);

        column.update({ width: (leftW * 100).toFixed(4) + '%' }, false);
        nextColumn.update({ width: (rightW * 100).toFixed(4) + '%' }, false);
    }

    /**
     * The initial width of the column in the full distribution mode. The last
     * column in the viewport will have to fill the remaining space.
     *
     * @param column
     * The column to measure the width.
     *
     * @param mock
     * The mock element to measure the width.
     */
    private getInitialFullDistWidth(column: Column, mock: HTMLElement): number {
        const vp = column.viewport;
        const columnsCount = vp.grid.enabledColumns?.length ?? 0;

        if (column.index < columnsCount - 1) {
            return vp.getRatioFromWidth(mock.offsetWidth) || 1 / columnsCount;
        }

        const result = 1 - this.allPreviousWidths;

        if (result < 0) {
            // eslint-disable-next-line no-console
            console.warn(
                'The sum of the columns\' widths exceeds the ' +
                'viewport width. It may cause unexpected behavior in the ' +
                'full distribution mode. Check the CSS styles of the ' +
                'columns. Corrections may be needed.'
            );
        }

        return result;
    }

    /**
     * Creates a mock element to measure the width of the column from the CSS.
     * The element is appended to the viewport container and then removed.
     * It should be called only once for each column.
     *
     * @param column
     * The column to measure the width.
     *
     * @returns The initial width of the column.
     */
    private getInitialColumnWidth(column: Column): number {
        const { viewport } = column;

        // Set the initial width of the column.
        const mock = makeHTMLElement('div', {
            className: Globals.getClassName('columnElement')
        }, viewport.grid.container);

        mock.setAttribute('data-column-id', column.id);
        if (column.options.className) {
            mock.classList.add(...column.options.className.split(/\s+/g));
        }

        const result = this.getInitialFullDistWidth(column, mock);
        mock.remove();

        return result;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default FullDistributionStrategy;

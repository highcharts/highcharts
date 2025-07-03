/* *
 *
 *  Mixed Distribution Strategy class
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

import U from '../../../../Core/Utilities.js';
const { defined } = U;


/* *
 *
 *  Class
 *
 * */

class MixedDistributionStrategy extends DistributionStrategy {

    /* *
     *
     *  Properties
     *
     * */

    public override readonly type = 'mixed' as const;

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

        if (!defined(widthValue)) {
            const freeWidth =
                vp.tbodyElement.clientWidth - this.calculateOccupiedWidth();
            const freeColumns =
                (vp.grid.enabledColumns?.length || 0) -
                Object.keys(this.columnWidths).length;

            // If undefined width:
            return Math.max(freeWidth / freeColumns, minWidth);
        }

        if (this.columnWidthUnits[column.id] === 0) {
            // If px:
            return widthValue;
        }

        // If %:
        return Math.max(vp.getWidthFromRatio(widthValue / 100), minWidth);
    }

    public override resize(resizer: ColumnsResizer, diff: number): void {
        const vp = this.viewport;
        const column = resizer.draggedColumn;
        if (!column) {
            return;
        }

        const colW = resizer.columnStartWidth ?? 0;
        const minWidth = DistributionStrategy.getMinWidth(column);
        const nextCol = vp.columns[column.index + 1];

        const newW = Math.round(Math.max(colW + diff, minWidth) * 10) / 10;

        this.columnWidths[column.id] = newW;
        this.columnWidthUnits[column.id] = 0; // Always save in px
        column.update({ width: newW }, false);

        if (nextCol) {
            const newNextW = this.columnWidths[nextCol.id] = Math.round(
                Math.max(
                    (resizer.nextColumnStartWidth ?? 0) + colW - newW,
                    minWidth
                ) * 10
            ) / 10;
            this.columnWidthUnits[nextCol.id] = 0; // Always save in px
            nextCol.update({ width: newNextW }, false);
        }
    }

    /**
     * Calculates defined (px and %) widths of all defined columns in the grid.
     * Total in px.
     */
    private calculateOccupiedWidth(): number {
        const vp = this.viewport;
        let occupiedWidth = 0;
        let unit: number, width: number;

        const columnIds = Object.keys(this.columnWidths);
        let columnId: string;
        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            columnId = columnIds[i];
            unit = this.columnWidthUnits[columnId];

            if (unit === 0) {
                occupiedWidth += this.columnWidths[columnId];
                continue;
            }

            width = this.columnWidths[columnId];
            occupiedWidth += vp.getWidthFromRatio(width / 100);
        }

        return occupiedWidth;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default MixedDistributionStrategy;

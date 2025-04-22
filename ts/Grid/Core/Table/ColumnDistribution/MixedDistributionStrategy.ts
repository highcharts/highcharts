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
import Globals from '../../Globals.js';
import Options from '../../Options.js';
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
        const raw = column.options.width;
        if (!raw) {
            return;
        }

        let value: number;
        let unitCode: number = 0;

        if (typeof raw === 'number') {
            value = raw;
            unitCode = 0;
        } else {
            value = parseFloat(raw);
            unitCode = raw.charAt(raw.length - 1) === '%' ? 1 : 0;
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

        const newW = Math.max(colW + diff, minWidth);

        this.columnWidths[column.id] = newW;
        this.columnWidthUnits[column.id] = 0; // Always save in px

        if (nextCol) {
            this.columnWidths[nextCol.id] = Math.max(
                (resizer.nextColumnStartWidth ?? 0) + colW - newW,
                minWidth
            );
            this.columnWidthUnits[nextCol.id] = 0; // Always save in px
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

    public override exportMetadata(): MixedDistributionStrategy.Metadata {
        return {
            ...super.exportMetadata(),
            columnWidthUnits: this.columnWidthUnits
        };
    }

    public override importMetadata(
        metadata: MixedDistributionStrategy.Metadata
    ): void {
        super.importMetadata(metadata, (colId): void => {
            const unit = metadata.columnWidthUnits[colId];
            if (defined(unit)) {
                this.columnWidthUnits[colId] = unit;
            }
        });
    }

    public override validateOnUpdate(
        newOptions: Globals.DeepPartial<Options>
    ): void {
        super.validateOnUpdate(newOptions);

        if (
            !this.invalidated && (
                Object.hasOwnProperty.call(
                    newOptions.columnDefaults || {}, 'width'
                ) ||
                newOptions.columns?.some(
                    (col): boolean => Object.hasOwnProperty.call(
                        col || {},
                        'width'
                    )
                )
            )
        ) {
            this.invalidated = true;
        }
    }

}


/* *
 *
 *  Namespace
 *
 * */

namespace MixedDistributionStrategy {

    export interface Metadata extends DistributionStrategy.Metadata {
        columnWidthUnits: Record<string, number>;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default MixedDistributionStrategy;

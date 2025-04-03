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

    public override readonly type: 'mixed' = 'mixed';

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
        let unitCode: number;

        if (typeof raw === 'number') {
            unitCode = 0;
            value = raw;
        } else {
            const match = raw.match(/^(-?\d*\.?\d+)([a-z%]*)$/);
            if (!match) {
                return;
            }

            value = parseFloat(match[1]);
            unitCode = match[2] === '%' ? 1 : 0;
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

        let newW = colW + diff;
        if (newW < minWidth) {
            newW = minWidth;
        }

        this.columnWidths[column.id] = newW;
        this.columnWidthUnits[column.id] = 0; // Always save in px

        // Update all columns to the left of the resized column to have their
        // widths in px as well
        for (let i = 0, iEnd = vp.columns.length; i < iEnd; ++i) {
            const col = vp.columns[i];
            if (i >= column.index) {
                break;
            }

            if (this.columnWidthUnits[col.id] !== 0) {
                this.columnWidths[col.id] = col.getWidth();
                this.columnWidthUnits[col.id] = 0;
            }
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

        for (const columnId in this.columnWidths) {
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
        }
    }

    public override importMetadata(
        metadata: MixedDistributionStrategy.Metadata
    ): void {
        super.importMetadata(metadata, (colId) => {
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
            !this.invalidated ||
            newOptions.columnDefaults?.hasOwnProperty('width') ||
            newOptions.columns?.some((col) => col?.hasOwnProperty('width'))
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

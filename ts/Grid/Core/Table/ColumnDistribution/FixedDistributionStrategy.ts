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
import type Options from '../../Options.js';

import DistributionStrategy from './ColumnDistributionStrategy.js';
import Globals from '../../Globals.js';

import GridUtils from '../../GridUtils.js';
const {
    makeHTMLElement
} = GridUtils;

import U from '../../../../Core/Utilities.js';
const {
    defined
} = U;


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
        const raw = column.options.width;
        if (!raw) {
            this.columnWidths[column.id] = this.getInitialColumnWidth(column);
            this.columnWidthUnits[column.id] = 0;
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

        this.columnWidths[column.id] = Math.max(
            (resizer.columnStartWidth || 0) + diff,
            DistributionStrategy.getMinWidth(column)
        );
        this.columnWidthUnits[column.id] = 0; // Always save in px
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

    public override exportMetadata(): FixedDistributionStrategy.Metadata {
        return {
            ...super.exportMetadata(),
            columnWidthUnits: this.columnWidthUnits
        };
    }

    public override importMetadata(
        metadata: FixedDistributionStrategy.Metadata
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

namespace FixedDistributionStrategy {

    export interface Metadata extends DistributionStrategy.Metadata {
        columnWidthUnits: Record<string, number>;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default FixedDistributionStrategy;

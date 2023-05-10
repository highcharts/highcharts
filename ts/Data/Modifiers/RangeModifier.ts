/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEvent from '../DataEvent';

import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Filters out table rows with a specific value range.
 *
 * @private
 */
class RangeModifier extends DataModifier {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options for the range modifier.
     */
    public static readonly defaultOptions: RangeModifier.Options = {
        modifier: 'Range',
        strict: false,
        ranges: []
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the range modifier.
     *
     * @param {RangeModifier.Options} [options]
     * Options to configure the range modifier.
     */
    public constructor(
        options?: DeepPartial<RangeModifier.Options>
    ) {
        super();

        this.options = merge(RangeModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Options of the range modifier.
     */
    public readonly options: RangeModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Replaces table rows with filtered rows.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Table with `modified` property as a reference.
     */
    public modifyTable<T extends DataTable>(
        table: T,
        eventDetail?: DataEvent.Detail
    ): T {
        const modifier = this;

        modifier.emit({ type: 'modify', detail: eventDetail, table });

        const {
            ranges,
            strict
        } = modifier.options;

        if (ranges.length) {
            const columns = table.getColumns(),
                rows: Array<DataTable.Row> = [],
                modified = table.modified;

            for (
                let i = 0,
                    iEnd = ranges.length,
                    range: RangeModifier.RangeOptions,
                    rangeColumn: DataTable.Column;
                i < iEnd;
                ++i
            ) {
                range = ranges[i];

                if (
                    strict &&
                    typeof range.minValue !== typeof range.maxValue
                ) {
                    continue;
                }

                rangeColumn = (columns[range.column] || []);

                for (
                    let j = 0,
                        jEnd = rangeColumn.length,
                        cell: DataTable.CellType,
                        row: (DataTable.Row|undefined);
                    j < jEnd;
                    ++j
                ) {
                    cell = rangeColumn[j];

                    switch (typeof cell) {
                        default:
                            continue;
                        case 'boolean':
                        case 'number':
                        case 'string':
                            break;
                    }

                    if (
                        strict &&
                        typeof cell !== typeof range.minValue
                    ) {
                        continue;
                    }

                    if (
                        cell >= range.minValue &&
                        cell <= range.maxValue
                    ) {
                        row = table.getRow(j);

                        if (row) {
                            rows.push(row);
                        }
                    }
                }
            }

            modified.deleteRows();
            modified.setRows(rows);
        }

        modifier.emit({ type: 'afterModify', detail: eventDetail, table });

        return table;
    }


    /**
     * Utility function that returns the first row index
     * if the table has been modified by a range modifier
     * @param {DataTable} table the table to get the offset from
     *
     * @return {number} The row offset of the modified table
     */
    public getModifiedTableOffset(table: DataTable): number {
        const { ranges } = this.options;

        if (ranges) {
            const minRange = ranges.reduce(
                (minRange, currentRange): RangeModifier.RangeOptions => {
                    if (currentRange.minValue > minRange.minValue) {
                        minRange = currentRange;
                    }
                    return minRange;

                }, ranges[0]
            );

            const tableRowIndex = table.getRowIndexBy(
                minRange.column,
                minRange.minValue
            );

            if (tableRowIndex) {
                return tableRowIndex;
            }
        }

        return 0;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * Additionally provided types for modifier events and options.
 * @private
 */
namespace RangeModifier {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Options to configure the modifier.
     */
    export interface Options extends DataModifier.Options {
        /**
         * Value ranges to include in the result.
         */
        ranges: Array<RangeOptions>;
        /**
         * If set to true, it will also compare the value type.
         */
        strict: boolean;
    }

    /**
     * Options to configure a range.
     */
    export interface RangeOptions {

        /**
         * Name of the related modifier for these options.
         */
        modifier: 'Range';

        /**
         * Column containing the values to filter.
         */
        column: string;

        /**
         * Maximum including value (`<=` operator).
         */
        maxValue: (boolean|number|string);

        /**
         * Minimum including value (`>=` operator).
         */
        minValue: (boolean|number|string);

    }

}

/* *
 *
 *  Registry
 *
 * */

declare module './DataModifierType' {
    interface DataModifierTypes {
        Range: typeof RangeModifier;
    }
}

DataModifier.registerType('Range', RangeModifier);

/* *
 *
 *  Default Export
 *
 * */

export default RangeModifier;

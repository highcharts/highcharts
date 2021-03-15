/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';

import DataJSON from '../DataJSON.js';
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
     *  Static Functions
     *
     * */

    /**
     * Converts a class JSON to a range modifier.
     *
     * @param {RangeModifier.ClassJSON} json
     * Class JSON to convert to an instance of range modifier.
     *
     * @return {RangeModifier}
     * GrouRangep modifier of the class JSON.
     */
    public static fromJSON(json: RangeModifier.ClassJSON): RangeModifier {
        return new RangeModifier(json.options);
    }

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
    public constructor(options?: DeepPartial<RangeModifier.Options>) {
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
    public readonly options: Readonly<RangeModifier.Options>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Applies modifications to the table rows and returns a new table with
     * subtable, containing only the filtered rows.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * New modified table.
     */
    public execute(
        table: DataTable,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataTable {
        const modifier = this,
            {
                ranges,
                strict
            } = modifier.options,
            columns = table.getColumns(),
            newTable = table.clone(true);

        let cell: DataTable.CellType,
            range: RangeModifier.RangeOptions,
            rangeColumn: DataTable.Column,
            row: (DataTable.Row|undefined);

        this.emit({ type: 'execute', detail: eventDetail, table });

        if (ranges.length) {
            const columnNames = Object.keys(columns);
            for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
                newTable.setColumn(columnNames[i]);
            }
            for (let i = 0, iEnd = ranges.length; i < iEnd; ++i) {
                range = ranges[i];

                if (
                    strict &&
                    typeof range.minValue !== typeof range.maxValue
                ) {
                    continue;
                }

                rangeColumn = (columns[range.column] || []);

                for (let j = 0, jEnd = rangeColumn.length; j < jEnd; ++j) {
                    cell = rangeColumn[j];

                    /* eslint-disable @typescript-eslint/indent */
                    switch (typeof cell) {
                        default:
                            continue;
                        case 'boolean':
                        case 'number':
                        case 'string':
                            break;
                    }
                    /* eslint-enable @typescript-eslint/indent */

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
                            newTable.setRow(row);
                        }
                    }
                }
            }
        } else {
            newTable.setColumns(columns);
        }

        this.emit({
            type: 'afterExecute',
            detail: eventDetail,
            table: newTable
        });

        return newTable;
    }

    /**
     * Converts the range modifier to a class JSON, including all containing all
     * modifiers.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this range modifier.
     */
    public toJSON(): RangeModifier.ClassJSON {
        return {
            $class: 'RangeModifier',
            options: merge(this.options)
        };
    }
}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Additionally provided types for modifier events and options, and JSON
 * conversion.
 */
namespace RangeModifier {

    /**
     * Interface of the class JSON to convert to modifier instances.
     */
    export interface ClassJSON extends DataModifier.ClassJSON {
        options: Options;
    }

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
    export interface RangeOptions extends DataJSON.JSONObject {
        /**
         * Column containing the filtered values. This can be an index or a
         * name.
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
 *  Register
 *
 * */

DataJSON.addClass(RangeModifier);
DataModifier.addModifier(RangeModifier);

declare module './ModifierType' {
    interface ModifierTypeRegistry {
        Range: typeof RangeModifier;
    }
}

/* *
 *
 *  Export
 *
 * */

export default RangeModifier;

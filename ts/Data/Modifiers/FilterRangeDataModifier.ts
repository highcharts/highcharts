/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type DataRow from '../DataRow';
import DataJSON from '../DataJSON.js';
import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    fireEvent,
    merge
} = U;

class FilterRangeDataModifier extends DataModifier implements DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly defaultOptions: FilterRangeDataModifier.Options = {
        modifier: 'FilterRange',
        strict: false,
        ranges: [
            {
                column: 0,
                maxValue: (Number.POSITIVE_INFINITY - 1),
                minValue: (Number.NEGATIVE_INFINITY + 1)
            }
        ]
    };

    /* *
     *
     *  Static Functions
     *
     * */

    public static fromJSON(): FilterRangeDataModifier {
        return new FilterRangeDataModifier();
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(options?: DeepPartial<FilterRangeDataModifier.Options>) {
        super(options);

        this.options = merge(FilterRangeDataModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly options: FilterRangeDataModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    public execute(table: DataTable): DataTable {
        const modifier = this,
            {
                ranges,
                strict
            } = modifier.options,
            rows = table.getAllRows(),
            result = new DataTable();

        let column: DataRow.ColumnTypes,
            range: FilterRangeDataModifier.RangeOptions,
            row: DataRow;

        fireEvent(modifier, 'execute', { table });

        for (let i = 0, iEnd = ranges.length; i < iEnd; ++i) {
            range = ranges[i];

            if (
                strict &&
                typeof range.minValue !== typeof range.maxValue
            ) {
                continue;
            }

            for (let j = 0, jEnd = rows.length; j < jEnd; ++j) {
                row = rows[j];
                column = row.getColumn(range.column);

                /* eslint-disable @typescript-eslint/indent */
                switch (typeof column) {
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
                    typeof column !== typeof range.minValue
                ) {
                    continue;
                }
                if (
                    column >= range.minValue &&
                    column <= range.maxValue
                ) {
                    result.insertRow(row);
                }
            }
        }

        fireEvent(modifier, 'afterExecute', { table: result });

        return result;
    }

    public toJSON(): FilterRangeDataModifier.ClassJSON {
        return {
            $class: 'FilterRangeDataModifier',
            options: this.options
        };
    }
}

namespace FilterRangeDataModifier {

    export interface ClassJSON extends DataModifier.ClassJSON {
        options: Options;
    }

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

    export interface RangeOptions extends DataJSON.Object {
        /**
         * Column containing the filtered values. This can be an index or a
         * name.
         */
        column: (number|string);
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

DataJSON.addClass(FilterRangeDataModifier);

DataModifier.addModifier(FilterRangeDataModifier);

export default FilterRangeDataModifier;

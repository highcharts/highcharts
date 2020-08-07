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

import type DataRow from '../DataRow';
import DataJSON from '../DataJSON.js';
import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;

class RangeDataModifier extends DataModifier implements DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly defaultOptions: RangeDataModifier.Options = {
        modifier: 'Range',
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

    public static fromJSON(): RangeDataModifier {
        return new RangeDataModifier();
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(options?: DeepPartial<RangeDataModifier.Options>) {
        super();

        this.options = merge(RangeDataModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public options: RangeDataModifier.Options;

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
            range: RangeDataModifier.RangeOptions,
            row: DataRow;

        this.emit('execute', { table });

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

        this.emit('afterExecute', { table: result });

        return result;
    }

    public toJSON(): RangeDataModifier.ClassJSON {
        return {
            $class: 'RangeDataModifier',
            options: merge(this.options)
        };
    }
}

namespace RangeDataModifier {

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

DataJSON.addClass(RangeDataModifier);
DataModifier.addModifier(RangeDataModifier);

export default RangeDataModifier;

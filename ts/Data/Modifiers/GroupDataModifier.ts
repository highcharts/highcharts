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

import DataJSON from '../DataJSON.js';
import DataModifier from './DataModifier.js';
import DataRow from '../DataRow';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;

class GroupDataModifier extends DataModifier implements DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: GroupDataModifier.Options = {
        modifier: 'Group',
        groupColumn: 0
    };

    /* *
     *
     *  Static Functions
     *
     * */

    public static fromJSON(json: GroupDataModifier.ClassJSON): GroupDataModifier {
        return new GroupDataModifier(json.options);
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(options?: DeepPartial<GroupDataModifier.Options>) {
        super();

        this.options = merge(GroupDataModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public options: GroupDataModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    public execute(table: DataTable): DataTable {

        this.emit('execute', { table });

        const modifier = this,
            {
                groupColumn,
                invalidValues,
                validValues
            } = modifier.options,
            groupTables: Array<DataTable> = [],
            groupValues: Array<DataJSON.Primitives> = [];

        let row: (DataRow|undefined),
            value: DataRow.ColumnTypes,
            valueIndex: number;

        for (let i = 0, iEnd = table.getRowCount(); i < iEnd; ++i) {
            row = table.getRow(i);
            if (row) {
                value = row.getColumn(groupColumn);
                if (
                    value instanceof DataTable ||
                    value instanceof Date ||
                    (
                        invalidValues &&
                        invalidValues.indexOf(value) >= 0
                    ) || (
                        validValues &&
                        validValues.indexOf(value) === -1
                    )
                ) {
                    continue;
                }
                valueIndex = groupValues.indexOf(value);
                if (valueIndex === -1) {
                    groupTables.push(new DataTable([row]));
                    groupValues.push(value);
                } else {
                    groupTables[valueIndex].insertRow(row);
                }
            }
        }

        table = new DataTable();

        for (let i = 0, iEnd = groupTables.length; i < iEnd; ++i) {
            table.insertRow(new DataRow({
                id: `${i}`,
                value: groupValues[i],
                table: groupTables[i]
            }));
        }

        this.emit('afterExecute', { table });

        return table;
    }

    public toJSON(): GroupDataModifier.ClassJSON {
        const json = {
            $class: 'GroupDataModifier',
            options: merge(this.options)
        };

        return json;
    }

}

namespace GroupDataModifier {

    export interface ClassJSON extends DataModifier.ClassJSON {
        // nothing here yet
    }

    export interface Options extends DataModifier.Options {
        /**
         * Column to group by values.
         */
        groupColumn: (number|string);
        /**
         * Array of invalid group values.
         */
        invalidValues?: Array<DataJSON.Primitives>;
        /**
         * Array of valid group values.
         */
        validValues?: Array<DataJSON.Primitives>;
    }

}

DataJSON.addClass(GroupDataModifier);
DataModifier.addModifier(GroupDataModifier);

export default GroupDataModifier;

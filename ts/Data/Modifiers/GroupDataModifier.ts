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

/* *
 *
 *  Imports
 *
 * */

import DataJSON from '../DataJSON.js';
import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import DataTableRow from '../DataTableRow.js';
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
 * Groups table rows into subtables depending on column values.
 */
class GroupDataModifier extends DataModifier {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options to group table rows.
     */
    public static readonly defaultOptions: GroupDataModifier.Options = {
        modifier: 'Group',
        groupColumn: 0
    };

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Converts a class JSON to a group modifier.
     *
     * @param {ChainDataModifier.ClassJSON} json
     * Class JSON to convert to an instance of group modifier.
     *
     * @return {ChainDataModifier}
     * Group modifier of the class JSON.
     */
    public static fromJSON(json: GroupDataModifier.ClassJSON): GroupDataModifier {
        return new GroupDataModifier(json.options);
    }

    /* *
     *
     *  Constructors
     *
     * */

    /**
     * Constructs an instance of the group modifier.
     *
     * @param {GroupDataModifier.Options} [options]
     * Options to configure the group modifier.
     */
    public constructor(options?: DeepPartial<GroupDataModifier.Options>) {
        super();

        this.options = merge(GroupDataModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Options of the group modifier.
     */
    public options: GroupDataModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Applies modifications to the table rows and returns a new table with
     * subtable, containing the grouped rows. The rows of the new table contain
     * three columns:
     * - `groupBy`: Column name used to group rows by.
     * - `table`: Subtable containing the grouped rows.
     * - `value`: containing the common value of the group
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {Record<string,string>} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * New modified table.
     */
    public execute(
        table: DataTable,
        eventDetail?: Record<string, string>
    ): DataTable {

        this.emit({ type: 'execute', detail: eventDetail, table });

        const modifier = this,
            {
                groupColumn,
                invalidValues,
                validValues
            } = modifier.options,
            columnGroups: Array<string> = [],
            tableGroups: Array<DataTable> = [],
            valueGroups: Array<DataJSON.Primitives> = [];

        let row: (DataTableRow|undefined),
            value: DataTableRow.ColumnValueType,
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
                valueIndex = valueGroups.indexOf(value);
                if (valueIndex === -1) {
                    columnGroups.push(groupColumn.toString());
                    tableGroups.push(new DataTable([row]));
                    valueGroups.push(value);
                } else {
                    tableGroups[valueIndex].insertRow(row);
                }
            }
        }

        table = new DataTable();

        for (let i = 0, iEnd = tableGroups.length; i < iEnd; ++i) {
            table.insertRow(new DataTableRow({
                id: `${i}`,
                groupBy: columnGroups[i],
                table: tableGroups[i],
                value: valueGroups[i]
            }));
        }

        this.emit({ type: 'afterExecute', detail: eventDetail, table });

        return table;
    }

    /**
     * Converts the group modifier to a class JSON, including all containing all
     * modifiers.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this group modifier.
     */
    public toJSON(): GroupDataModifier.ClassJSON {
        const json = {
            $class: 'GroupDataModifier',
            options: merge(this.options)
        };

        return json;
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
namespace GroupDataModifier {

    /**
     * Interface of the class JSON to convert to modifier instances.
     */
    export interface ClassJSON extends DataModifier.ClassJSON {
        // nothing here yet
    }

    /**
     * Options to configure the modifier.
     */
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

/* *
 *
 *  Register
 *
 * */

DataJSON.addClass(GroupDataModifier);
DataModifier.addModifier(GroupDataModifier);

declare module './Types' {
    interface DataModifierTypeRegistry {
        Group: typeof GroupDataModifier;
    }
}

/* *
 *
 *  Export
 *
 * */

export default GroupDataModifier;

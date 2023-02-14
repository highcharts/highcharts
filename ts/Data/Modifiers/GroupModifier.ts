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
import type JSON from '../../Core/JSON';

import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Groups table rows into subtables depending on column values.
 *
 * @private
 */
class GroupModifier extends DataModifier {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options to group table rows.
     */
    public static readonly defaultOptions: GroupModifier.Options = {
        modifier: 'Group',
        groupColumn: ''
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the group modifier.
     *
     * @param {GroupModifier.Options} [options]
     * Options to configure the group modifier.
     */
    public constructor(options?: DeepPartial<GroupModifier.Options>) {
        super();

        this.options = merge(GroupModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Options of the group modifier.
     */
    public options: GroupModifier.Options;

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

        const byGroups: Array<string> = [],
            tableGroups: Array<DataTable> = [],
            valueGroups: Array<JSON.Primitive> = [],
            groupColumn = (
                modifier.options.groupColumn ||
                table.getColumnNames()[0]
            ),
            valueColumn = (
                table.getColumn(groupColumn) ||
                []
            ),
            {
                invalidValues,
                validValues
            } = modifier.options,
            modified = table.modified = table.clone(true, eventDetail);

        let value: DataTable.CellType,
            valueIndex: number;

        for (let i = 0, iEnd = valueColumn.length; i < iEnd; ++i) {
            value = valueColumn[i];
            if (typeof value !== 'undefined') {
                if (
                    value instanceof DataTable ||
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
                    const newTable = new DataTable();

                    newTable.setRows([table.getRowObject(i) || {}]);

                    byGroups.push(groupColumn);
                    tableGroups.push(newTable);
                    valueGroups.push(value);
                } else {
                    tableGroups[valueIndex].setRows([table.getRow(i) || []]);
                }
            }
        }

        modified.deleteColumns();
        modified.setColumns({
            groupBy: byGroups,
            table: tableGroups,
            value: valueGroups
        });

        modifier.emit({ type: 'afterModify', detail: eventDetail, table });

        return table;
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * Additionally provided types for modifier events and options, and JSON
 * conversion.
 */
namespace GroupModifier {

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
         * Column to group by values.
         */
        groupColumn: string;
        /**
         * Array of invalid group values.
         */
        invalidValues?: Array<JSON.Primitive>;
        /**
         * Array of valid group values.
         */
        validValues?: Array<JSON.Primitive>;
    }

}

/* *
 *
 *  Registry
 *
 * */

DataModifier.addModifier(GroupModifier);

declare module './ModifierType' {
    interface ModifierTypeRegistry {
        Group: typeof GroupModifier;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default GroupModifier;

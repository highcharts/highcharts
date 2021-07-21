/* *
 *
 *  (c) 2020 - 2021 Highsoft AS
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

import type CoreJSON from '../../Core/JSON';
import type Serializable from '../Serializable';

import DataTable from '../../Data/DataTable.js';

/* *
 *
 *  Constants
 *
 * */

const DataTableSerializer: Serializable<DataTable, DataTableSerializer.JSON> = {
    fromJSON,
    jsonSupportFor,
    toJSON
};

/* *
 *
 *  Functions
 *
 * */

/**
 * Converts the given JSON to a class instance.
 *
 * @param {DataTableSerializer.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {DataTable}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: DataTableSerializer.JSON
): DataTable {
    const jsonColumns = json.columns,
        columnNames = Object.keys(jsonColumns),
        columns: DataTable.ColumnCollection = {},
        iEnd = columnNames.length;

    // deserialize columns

    for (
        let i = 0,
            column: DataTable.Column,
            columnName: string,
            jsonColumn: DataTableSerializer.ColumnJSON;
        i < iEnd;
        ++i
    ) {
        columnName = columnNames[i];
        column = [];
        jsonColumn = jsonColumns[columnName];
        for (
            let j = 0,
                jEnd = column.length,
                cell: (DataTableSerializer.JSON|CoreJSON.Primitive);
            j < jEnd;
            ++j
        ) {
            cell = jsonColumn[j];
            if (cell && typeof cell === 'object') {
                column[j] = fromJSON(cell);
            } else {
                column[j] = cell;
            }
        }
        columns[columnName] = column;
    }

    // done

    return new DataTable(columns, json.id);
}

/**
 * Validates the given class instance for JSON support.
 *
 * @param {AnyRecord} obj
 * Class instance or object to validate.
 *
 * @return {boolean}
 * Returns true, if the function set can convert the given object, otherwise
 * false.
 */
function jsonSupportFor(
    obj: AnyRecord
): obj is DataTable {
    return obj instanceof DataTable;
}

/**
 * Converts the given class instance to JSON.
 *
 * @param {DataTable} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {DataTableSerializer.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj?: DataTable
): DataTableSerializer.JSON {
    const json: DataTableSerializer.JSON = {
            $class: 'Data.DataTable',
            columns: {}
        },
        jsonColumns = json.columns;

    if (obj) {

        // serialize columns

        const columns = obj.getColumns(),
            columnNames = Object.keys(columns),
            iEnd = columnNames.length;

        for (
            let i = 0,
                column: DataTable.Column,
                columnName: string,
                jsonColumn: DataTableSerializer.ColumnJSON;
            i < iEnd;
            ++i
        ) {
            columnName = columnNames[i];
            column = columns[columnName];
            jsonColumn = [];
            for (
                let j = 0,
                    jEnd = column.length,
                    cell: DataTable.CellType;
                j < jEnd;
                ++j
            ) {
                cell = column[j];
                if (cell instanceof DataTable) {
                    jsonColumn[j] = toJSON(cell);
                } else {
                    jsonColumn[j] = cell;
                }
            }
            jsonColumns[columnName] = jsonColumn;
        }

        // serialize custom id

        if (!obj.autoId) {
            json.id = obj.id;
        }
    }

    // done

    return json;
}

/* *
 *
 *  Namespace
 *
 * */

namespace DataTableSerializer {

    /* *
     *
     *  Declarations
     *
     * */

    export type ColumnJSON = CoreJSON.Array<(JSON|CoreJSON.Primitive)>;

    export interface JSON extends Serializable.JSON<'Data.DataTable'> {
        columns: CoreJSON.Object<ColumnJSON>;
        id?: string;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DataTableSerializer;

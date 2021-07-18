/* *
 *
 *  Highsoft Dashboards
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

import type JSON from '../Core/JSON';
import type Serializer from './Serializer';

import DataTable from '../Data/DataTable.js';

/* *
 *
 *  Declarations
 *
 * */

type DataTableColumnJSON = JSON.Array<(DataTableJSON|JSON.Primitive)>;

interface DataTableJSON extends Serializer.JSON {
    $class: 'DataTable';
    columns: JSON.Object<DataTableColumnJSON>;
    id?: string;
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Converts the given JSON to a class instance.
 *
 * @param {Serializer.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {DataTable}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: DataTableJSON
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
            jsonColumn: DataTableColumnJSON;
        i < iEnd;
        ++i
    ) {
        columnName = columnNames[i];
        column = [];
        jsonColumn = jsonColumns[columnName];
        for (
            let j = 0,
                jEnd = column.length,
                cell: (DataTableJSON|JSON.Primitive);
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

    // deserialize custom id

    const table = new DataTable(columns, json.id);

    // done

    return table;
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
 * @return {DataTableJSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj?: DataTable
): DataTableJSON {
    const json: DataTableJSON = {
            $class: 'DataTable',
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
                jsonColumn: DataTableColumnJSON;
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
 *  Default Export
 *
 * */

const exports = {
    fromJSON,
    jsonSupportFor,
    toJSON
};

export default exports;

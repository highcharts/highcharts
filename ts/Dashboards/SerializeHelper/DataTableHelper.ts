/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
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

import type Globals from '../Globals';
import type JSON from '../JSON';

import DataTable from '../../Data/DataTable.js';
import Serializable from '../Serializable.js';

/* *
 *
 *  Functions
 *
 * */

/**
 * Converts the given JSON to a class instance.
 *
 * @param {DataTableHelper.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {DataTable}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: DataTableHelper.JSON
): DataTable {
    return new DataTable({ columns: json.columns, id: json.id });
}

/**
 * Validates the given class instance for JSON support.
 *
 * @param {Globals.AnyRecord} obj
 * Class instance or object to validate.
 *
 * @return {boolean}
 * Returns true, if the function set can convert the given object, otherwise
 * false.
 */
function jsonSupportFor(
    obj: Globals.AnyRecord
): obj is DataTable {
    return obj instanceof DataTable;
}

/**
 * Converts the given class instance to JSON.
 *
 * @param {DataTable} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {DataTableHelper.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: DataTable
): DataTableHelper.JSON {
    const aliases = obj.getColumnAliases(),
        aliasKeys = Object.keys(aliases),
        json: DataTableHelper.JSON = {
            $class: 'Data.DataTable',
            columns: obj.getColumns()
        };

    // aliases

    if (aliasKeys.length) {
        const jsonAliases: JSON.Object = json.aliases = {};

        for (let i = 0, iEnd = aliasKeys.length; i < iEnd; ++i) {
            jsonAliases[aliasKeys[i]] = aliases[aliasKeys[i]];
        }
    }

    // custom ID

    if (!obj.autoId) {
        json.id = obj.id;
    }

    // done

    return json;
}

/* *
 *
 *  Namespace
 *
 * */

namespace DataTableHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export type ColumnJSON = JSON.Array<JSON.Primitive>;

    export type JSON = (Serializable.JSON<'Data.DataTable'>&DataTable.Options);

}

/* *
 *
 *  Registry
 *
 * */

const DataTableHelper: Serializable.Helper<DataTable, DataTableHelper.JSON> = {
    $class: 'Data.DataTable',
    fromJSON,
    jsonSupportFor,
    toJSON
};

Serializable.registerHelper(DataTableHelper);

/* *
 *
 *  Default Export
 *
 * */

export default DataTableHelper;

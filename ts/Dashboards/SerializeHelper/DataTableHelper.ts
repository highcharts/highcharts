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

import type CoreJSON from '../../Core/JSON';
import type Serializable from '../Serializable';

import DataTable from '../../Data/DataTable.js';

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
 * @return {DataTableHelper.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: DataTable
): DataTableHelper.JSON {
    const json: DataTableHelper.JSON = {
        $class: 'Data.DataTable',
        columns: obj.getColumns()
    };

    if (!obj.autoId) {
        json.id = obj.id;
    }

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

    export type ColumnJSON = CoreJSON.Array<CoreJSON.Primitive>;

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


const DataTableHelper: Serializable.Helper<DataTable, DataTableHelper.JSON> = {
    $class: 'Data.DataTable',
    fromJSON,
    jsonSupportFor,
    toJSON
};

export default DataTableHelper;

/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type { AnyRecord } from '../../Shared/Types';
import type DataTableOptions from '../../Data/DataTableOptions';
import type { JSONArray, JSONPrimitive } from '../JSON';

import DataTable from '../../Data/DataTable.js';
import Serializable from '../Serializable.js';
import type { Helper as SerializableHelper, JSON as SerializableJSON } from '../Serializable';

/* *
 *
 *  Functions
 *
 * */

/**
 * Converts the given JSON to a class instance.
 *
 * @param {JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {DataTable}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: JSON
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
 * @return {JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: DataTable
): JSON {
    const json: JSON = {
        $class: 'Data.DataTable',
        columns: obj.getColumns(void 0, false, true)
    };

    // Custom ID

    if (!obj.autoId) {
        json.id = obj.id;
    }

    // Done

    return json;
}

/* *
 *
 *  Declarations
 *
 * */

export type ColumnJSON = JSONArray<JSONPrimitive>;

export type JSON = (SerializableJSON<'Data.DataTable'> & DataTableOptions);

/* *
 *
 *  Registry
 *
 * */

const DataTableHelper: SerializableHelper<DataTable, JSON> = {
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

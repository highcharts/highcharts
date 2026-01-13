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
import type {
    State as DataCursorState,
    TableId as DataCursorTableId,
    Type as DataCursorType
} from '../../Data/DataCursor.js';
import type { JSONArray, JSONObject } from '../JSON';

import DataCursor from '../../Data/DataCursor.js';
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
 * @return {DataCursor}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: JSON
): DataCursor {
    return new DataCursor(json.stateMap);
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
    obj: AnyRecord
): obj is DataCursor {
    return obj instanceof DataCursor;
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
    obj: DataCursor
): JSON {
    const stateMap = obj.stateMap,
        stateMapJSON: StateMapJSON = {},
        tableIds = Object.keys(obj.stateMap);

    let cursors: Array<DataCursorType>,
        cursorsJSON: JSONArray<TypeJSON>,
        tableId: DataCursorTableId,
        state: DataCursorState,
        states: Array<DataCursorState>;

    for (let i = 0, iEnd = tableIds.length; i < iEnd; ++i) {
        tableId = tableIds[i];
        states = Object.keys(stateMap[tableId]);

        stateMapJSON[tableId] = {};

        for (let j = 0, jEnd = states.length; j < jEnd; ++j) {
            state = states[j];
            cursors = stateMap[tableId][state];

            stateMapJSON[tableId][state] = cursorsJSON = [];

            for (let k = 0, kEnd = cursors.length; k < kEnd; ++k) {
                cursorsJSON.push({ ...cursors[k] });
            }
        }
    }

    return {
        $class: 'Data.DataCursor',
        stateMap: stateMapJSON
    };
}

/* *
 *
 *  Declarations
 *
 * */

export type TypeJSON = (
    | PositionJSON
    | RangeJSON
);

export interface PositionJSON extends JSONObject {
    column?: string;
    row?: number;
    state: DataCursorState;
    sourceId?: string;
    type: 'position';
}

export interface RangeJSON extends JSONObject {
    columns?: Array<string>;
    firstRow: number;
    lastRow: number;
    state: DataCursorState;
    sourceId?: string;
    type: 'range';
}

export interface JSON extends SerializableJSON<'Data.DataCursor'> {
    stateMap: StateMapJSON;
}

export type StateMapJSON = JSONObject<JSONObject<JSONArray<TypeJSON>>>;

/* *
 *
 *  Registry
 *
 * */

const DataCursorHelper: SerializableHelper<DataCursor, JSON> = {
    $class: 'Data.DataCursor',
    fromJSON,
    jsonSupportFor,
    toJSON
};

Serializable.registerHelper(DataCursorHelper);

/* *
 *
 *  Default Export
 *
 * */

export default DataCursorHelper;

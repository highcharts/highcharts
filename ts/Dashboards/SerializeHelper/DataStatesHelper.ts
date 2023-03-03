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

import DataStates from '../../Data/DataStates.js';

/* *
 *
 *  Functions
 *
 * */

/**
 * Converts the given JSON to a class instance.
 *
 * @param {DataStatesHelper.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {DataStates}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: DataStatesHelper.JSON
): DataStates {
    return new DataStates(json.stateMap);
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
): obj is DataStates {
    return obj instanceof DataStates;
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
    obj: DataStates
): DataStatesHelper.JSON {
    const stateMap = obj.stateMap,
        stateMapJSON: DataStatesHelper.StateMapJSON = {},
        tableIds = Object.keys(obj.stateMap);

    let cursors: Array<DataStates.Cursor>,
        cursorsJSON: CoreJSON.Array<DataStatesHelper.CursorJSON>,
        tableId: DataStates.TableId,
        state: DataStates.State,
        states: Array<DataStates.State>;

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
        $class: 'Data.DataStates',
        stateMap: stateMapJSON
    };
}

/* *
 *
 *  Namespace
 *
 * */

namespace DataStatesHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export type CursorJSON = (
        | CursorPositionJSON
        | CursorRangeJSON
    );

    export interface CursorPositionJSON extends CoreJSON.Object {
        column?: string;
        row?: number;
        state: DataStates.State;
        type: 'position';
    }

    export interface CursorRangeJSON extends CoreJSON.Object {
        columns?: Array<string>;
        firstRow: number;
        lastRow: number;
        state: DataStates.State;
        type: 'range';
    }

    export interface JSON extends Serializable.JSON<'Data.DataStates'> {
        stateMap: StateMapJSON;
    }

    export type StateMapJSON = CoreJSON.Object<CoreJSON.Object<CoreJSON.Array<CursorJSON>>>;

}

/* *
 *
 *  Default Export
 *
 * */


const DataStatesHelper: Serializable.Helper<DataStates, DataStatesHelper.JSON> = {
    $class: 'Data.DataStates',
    fromJSON,
    jsonSupportFor,
    toJSON
};

export default DataStatesHelper;

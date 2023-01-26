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

import type DataStore from '../../Data/Stores/DataStore';
import type Serializable from '../Serializable';

import DataTableHelper from './DataTableHelper.js';
import CSVStore from '../../Data/Stores/CSVStore.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Functions
 *
 * */

/**
 * Converts the given JSON to a class instance.
 *
 * @param {CSVStoreHelper.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {CSVStore}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: CSVStoreHelper.JSON
): CSVStore {
    const table = DataTableHelper.fromJSON(json.table),
        store = new CSVStore(table, json.options);

    merge(true, store.metadata, json.metadata);

    return store;
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
): obj is CSVStore {
    return obj instanceof CSVStore;
}

/**
 * Converts the given class instance to JSON.
 *
 * @param {CSVStore} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {CSVStoreHelper.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: CSVStore
): CSVStoreHelper.JSON {
    return {
        $class: 'Data.CSVStore',
        metadata: (obj.metadata),
        options: (obj.options),
        table: DataTableHelper.toJSON(obj.table)
    };
}

/* *
 *
 *  Namespace
 *
 * */

namespace CSVStoreHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.CSVStore'> {
        metadata: DataStore.Metadata;
        options: CSVStore.Options;
        table: DataTableHelper.JSON;
    }

}

/* *
 *
 *  Default Export
 *
 * */

const CSVStoreHelper: Serializable.Helper<CSVStore, CSVStoreHelper.JSON> = {
    $class: 'Data.CSVStore',
    fromJSON,
    jsonSupportFor,
    toJSON
};

export default CSVStoreHelper;

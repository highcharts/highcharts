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

import type DataStore from '../../Data/Stores/DataStore';
import type Serializable from '../Serializable';

import DataTableSerializer from './DataTableSerializer.js';
import CSVStore from '../../Data/Stores/CSVStore.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Constants
 *
 * */

const CSVStoreSerializer: Serializable<CSVStore, CSVStoreSerializer.JSON> = {
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
 * @param {CSVStoreSerializer.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {CSVStore}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: CSVStoreSerializer.JSON
): CSVStore {
    const table = DataTableSerializer.fromJSON(json.table),
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
 * @return {CSVStoreSerializer.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj?: CSVStore
): CSVStoreSerializer.JSON {
    return {
        $class: 'Data.CSVStore',
        metadata: (obj && obj.metadata),
        options: (obj && obj.options),
        table: DataTableSerializer.toJSON(obj && obj.table)
    };
}

/* *
 *
 *  Namespace
 *
 * */

namespace CSVStoreSerializer {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.CSVStore'> {
        metadata?: DataStore.Metadata;
        options?: CSVStore.Options;
        table: DataTableSerializer.JSON;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default CSVStoreSerializer;

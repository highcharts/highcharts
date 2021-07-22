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

import type DataParser from '../../Data/Parsers/DataParser';
import type DataStore from '../../Data/Stores/DataStore';
import type Serializable from '../Serializable';

import DataTableHelper from './DataTableHelper.js';
import HTMLTableStore from '../../Data/Stores/HTMLTableStore.js';
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
 * @param {HTMLTableStoreHelper.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {HTMLTableStore}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: HTMLTableStoreHelper.JSON
): HTMLTableStore {
    const table = DataTableHelper.fromJSON(json.table),
        store = new HTMLTableStore(table, json.options);

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
): obj is HTMLTableStore {
    return obj instanceof HTMLTableStore;
}

/**
 * Converts the given class instance to JSON.
 *
 * @param {HTMLTableStore} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {HTMLTableStoreHelper.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: HTMLTableStore
): HTMLTableStoreHelper.JSON {
    const json: HTMLTableStoreHelper.JSON = {
            $class: 'Data.HTMLTableStore',
            metadata: obj.metadata,
            options: {},
            table: DataTableHelper.toJSON(obj.table)
        },
        jsonOptions: HTMLTableStoreHelper.OptionsJSON = json.options,
        options = obj.options;

    // options

    jsonOptions.endColumn = options.endColumn;
    jsonOptions.endRow = options.endRow;
    jsonOptions.firstRowAsNames = options.firstRowAsNames;
    jsonOptions.startColumn = options.startColumn;
    jsonOptions.startRow = options.startRow;
    jsonOptions.switchRowsAndColumns = options.switchRowsAndColumns;

    if (typeof options.table === 'string') {
        jsonOptions.table = options.table;
    } else {
        jsonOptions.table = options.table.id;
    }

    // done

    return json;
}

/* *
 *
 *  Namespace
 *
 * */

namespace HTMLTableStoreHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.HTMLTableStore'> {
        metadata: DataStore.Metadata;
        options: OptionsJSON;
        table: DataTableHelper.JSON;
    }

    export interface OptionsJSON extends Partial<DataParser.Options> {
        table?: string;
    }

}

/* *
 *
 *  Default Export
 *
 * */

const HTMLTableStoreHelper: Serializable.Helper<HTMLTableStore, HTMLTableStoreHelper.JSON> = {
    $class: 'Data.HTMLTableStore',
    fromJSON,
    jsonSupportFor,
    toJSON
};

export default HTMLTableStoreHelper;

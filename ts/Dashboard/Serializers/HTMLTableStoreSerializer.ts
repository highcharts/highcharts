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

import DataTableSerializer from './DataTableSerializer.js';
import HTMLTableStore from '../../Data/Stores/HTMLTableStore.js';
import Serializable from '../Serializable.js';

/* *
 *
 *  Constants
 *
 * */

const HTMLTableStoreSerializer: Serializable<HTMLTableStore, HTMLTableStoreSerializer.JSON> = {
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
 * @param {Serializable.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {DataTable}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: HTMLTableStoreSerializer.JSON
): HTMLTableStore {
    const table = DataTableSerializer.fromJSON(json.table);
    return new HTMLTableStore(table, json.options);
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
 * @param {DataTable} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {DataTableJSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj?: HTMLTableStore
): HTMLTableStoreSerializer.JSON {
    const json: HTMLTableStoreSerializer.JSON = {
            $class: 'Data.HTMLTableStore',
            options: {},
            table: DataTableSerializer.toJSON(obj && obj.table)
        },
        jsonOptions = json.options;

    if (obj) {
        // options

        const options = obj.options;

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
    }

    // done

    return json;
}

/* *
 *
 *  Namespace
 *
 * */

namespace HTMLTableStoreSerializer {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.HTMLTableStore'> {
        options: OptionsJSON;
        table: DataTableSerializer.JSON;
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

export default HTMLTableStoreSerializer;

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

import DataTableSerializer from './DataTableSerializer.js';
import GoogleSheetsStore from '../../Data/Stores/GoogleSheetsStore.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Constants
 *
 * */

const GoogleSheetsStoreSerializer: Serializable<GoogleSheetsStore, GoogleSheetsStoreSerializer.JSON> = {
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
 * @param {GoogleSheetsStoreSerializer.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {GoogleSheetsStore}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: GoogleSheetsStoreSerializer.JSON
): GoogleSheetsStore {
    const table = DataTableSerializer.fromJSON(json.table),
        store = new GoogleSheetsStore(
            table,
            json.options || { googleSpreadsheetKey: '' }
        );

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
): obj is GoogleSheetsStore {
    return obj instanceof GoogleSheetsStore;
}

/**
 * Converts the given class instance to JSON.
 *
 * @param {GoogleSheetsStore} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {GoogleSheetsStoreSerializer.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj?: GoogleSheetsStore
): GoogleSheetsStoreSerializer.JSON {
    return {
        $class: 'Data.GoogleSheetsStore',
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

namespace GoogleSheetsStoreSerializer {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.GoogleSheetsStore'> {
        metadata?: DataStore.Metadata;
        options?: OptionsJSON;
        table: DataTableSerializer.JSON;
    }

    export interface OptionsJSON extends Partial<DataParser.Options> {
        dataRefreshRate: number;
        enablePolling: boolean;
        firstRowAsNames: boolean;
        googleSpreadsheetKey: GoogleSheetsStore.Options['googleSpreadsheetKey'];
        worksheet?: number;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default GoogleSheetsStoreSerializer;

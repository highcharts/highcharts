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

import type DataConverter from '../../Data/Converters/DataConverter';
import type DataStore from '../../Data/Stores/DataStore';
import type Serializable from '../Serializable';

import DataTableHelper from './DataTableHelper.js';
import GoogleSheetsStore from '../../Data/Stores/GoogleSheetsStore.js';
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
 * @param {GoogleSheetsStoreHelper.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {GoogleSheetsStore}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: GoogleSheetsStoreHelper.JSON
): GoogleSheetsStore {
    const table = DataTableHelper.fromJSON(json.table),
        store = new GoogleSheetsStore(
            table,
            json.options || { googleAPIKey: '', googleSpreadsheetKey: '' }
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
 * @return {GoogleSheetsStoreHelper.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: GoogleSheetsStore
): GoogleSheetsStoreHelper.JSON {
    return {
        $class: 'Data.GoogleSheetsStore',
        metadata: obj.metadata,
        options: obj.options,
        table: DataTableHelper.toJSON(obj.table)
    };
}

/* *
 *
 *  Namespace
 *
 * */

namespace GoogleSheetsStoreHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.GoogleSheetsStore'> {
        metadata: DataStore.Metadata;
        options: OptionsJSON;
        table: DataTableHelper.JSON;
    }

    export interface OptionsJSON extends Partial<DataConverter.Options> {
        dataRefreshRate: number;
        enablePolling: boolean;
        firstRowAsNames: boolean;
        googleAPIKey: GoogleSheetsStore.Options['googleAPIKey'];
        googleSpreadsheetKey: GoogleSheetsStore.Options['googleSpreadsheetKey'];
        worksheet?: number;
    }

}

/* *
 *
 *  Default Export
 *
 * */

const GoogleSheetsStoreSerializer: Serializable.Helper<GoogleSheetsStore, GoogleSheetsStoreHelper.JSON> = {
    $class: 'Data.GoogleSheetsStore',
    fromJSON,
    jsonSupportFor,
    toJSON
};

export default GoogleSheetsStoreHelper;

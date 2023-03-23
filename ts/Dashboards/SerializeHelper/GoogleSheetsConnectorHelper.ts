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
import type DataConnector from '../../Data/Connectors/DataConnector';
import type Serializable from '../Serializable';

import DataTableHelper from './DataTableHelper.js';
import GoogleSheetsConnector from '../../Data/Connectors/GoogleSheetsConnector.js';
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
 * @param {GoogleSheetsConnectorHelper.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {GoogleSheetsConnector}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: GoogleSheetsConnectorHelper.JSON
): GoogleSheetsConnector {
    const table = DataTableHelper.fromJSON(json.table),
        connector = new GoogleSheetsConnector(
            table,
            json.options || { googleAPIKey: '', googleSpreadsheetKey: '' }
        );

    merge(true, connector.metadata, json.metadata);

    return connector;
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
): obj is GoogleSheetsConnector {
    return obj instanceof GoogleSheetsConnector;
}

/**
 * Converts the given class instance to JSON.
 *
 * @param {GoogleSheetsConnector} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {GoogleSheetsConnectorHelper.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: GoogleSheetsConnector
): GoogleSheetsConnectorHelper.JSON {
    return {
        $class: 'Data.GoogleSheetsConnector',
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

namespace GoogleSheetsConnectorHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.GoogleSheetsConnector'> {
        metadata: DataConnector.Metadata;
        options: OptionsJSON;
        table: DataTableHelper.JSON;
    }

    export interface OptionsJSON extends Partial<DataConverter.Options> {
        dataRefreshRate: number;
        enablePolling: boolean;
        firstRowAsNames: boolean;
        googleAPIKey: GoogleSheetsConnector.Options['googleAPIKey'];
        googleSpreadsheetKey: GoogleSheetsConnector
            .Options['googleSpreadsheetKey'];
        worksheet?: number;
    }

}

/* *
 *
 *  Default Export
 *
 * */

const GoogleSheetsConnectorSerializer: Serializable.Helper<GoogleSheetsConnector, GoogleSheetsConnectorHelper.JSON> = {
    $class: 'Data.GoogleSheetsConnector',
    fromJSON,
    jsonSupportFor,
    toJSON
};

export default GoogleSheetsConnectorHelper;

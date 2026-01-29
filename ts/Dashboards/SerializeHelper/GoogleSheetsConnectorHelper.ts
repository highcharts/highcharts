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
import type { JSONObject } from '../JSON';
import type GoogleSheetsConnectorOptions from '../../Data/Connectors/GoogleSheetsConnectorOptions';

import DataTableHelper from './DataTableHelper.js';
import GoogleSheetsConnector from '../../Data/Connectors/GoogleSheetsConnector.js';
import Serializable from '../Serializable.js';
import type { Helper as SerializableHelper, JSON as SerializableJSON } from '../Serializable';
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
 * @param {JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {GoogleSheetsConnector}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: JSON
): GoogleSheetsConnector {
    return new GoogleSheetsConnector(
        json.options || { googleAPIKey: '', googleSpreadsheetKey: '' }
    );
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
 * @return {JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: GoogleSheetsConnector
): JSON {
    const options =
        merge(obj.options) as OptionsJSON;

    options.dataTable = DataTableHelper.toJSON(obj.getTable());

    return {
        $class: 'Data.GoogleSheetsConnector',
        options
    };
}

/* *
 *
 *  Declarations
 *
 * */

export interface JSON extends SerializableJSON<'Data.GoogleSheetsConnector'> {
    options: OptionsJSON;
}

export type OptionsJSON = (JSONObject&GoogleSheetsConnectorOptions);

/* *
 *
 *  Registry
 *
 * */

const GoogleSheetsConnectorHelper: SerializableHelper<GoogleSheetsConnector, JSON> = {
    $class: 'Data.GoogleSheetsConnector',
    fromJSON,
    jsonSupportFor,
    toJSON
};

Serializable.registerHelper(GoogleSheetsConnectorHelper);

/* *
 *
 *  Default Export
 *
 * */

export default GoogleSheetsConnectorHelper;

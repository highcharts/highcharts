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
import type CSVConnectorOptions from '../../Data/Connectors/CSVConnectorOptions';

import CSVConnector from '../../Data/Connectors/CSVConnector.js';
import DataTableHelper from './DataTableHelper.js';
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
 * @return {CSVConnector}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: JSON
): CSVConnector {
    return new CSVConnector(json.options);
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
): obj is CSVConnector {
    return obj instanceof CSVConnector;
}

/**
 * Converts the given class instance to JSON.
 *
 * @param {CSVConnector} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: CSVConnector
): JSON {
    const options = merge(obj.options) as OptionsJSON;

    options.dataTable = DataTableHelper.toJSON(obj.getTable());

    return {
        $class: 'Data.CSVConnector',
        options
    };
}

/* *
 *
 *  Declarations
 *
 * */

export interface JSON extends SerializableJSON<'Data.CSVConnector'> {
    options: OptionsJSON;
}

export type OptionsJSON = (JSONObject&CSVConnectorOptions);

/* *
 *
 *  Registry
 *
 * */

const CSVConnectorHelper: SerializableHelper<CSVConnector, JSON> = {
    $class: 'Data.CSVConnector',
    fromJSON,
    jsonSupportFor,
    toJSON
};

Serializable.registerHelper(CSVConnectorHelper);

/* *
 *
 *  Default Export
 *
 * */

export default CSVConnectorHelper;

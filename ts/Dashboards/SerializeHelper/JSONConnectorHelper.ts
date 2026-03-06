/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Pawel Lysy
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
import type JSONConnectorOptions from '../../Data/Connectors/JSONConnectorOptions';
import type { Helper as SerializableHelper, JSON as SerializableJSON } from '../Serializable';

import JSONConnector from '../../Data/Connectors/JSONConnector.js';
import DataTableHelper from './DataTableHelper.js';
import { merge } from '../../Shared/Utilities.js';


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
 * @return {JSONConnector}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: JSON
): JSONConnector {
    return new JSONConnector(json.options);
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
function jsonSupportFor(obj: AnyRecord): obj is JSONConnector {
    return obj instanceof JSONConnector;
}

/**
 * Converts the given class instance to JSON.
 *
 * @param {JSONConnector} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: JSONConnector
): JSON {
    const options = merge(obj.options) as OptionsJSON;

    options.dataTable = DataTableHelper.toJSON(obj.getTable());

    return {
        $class: 'Data.JSONConnector',
        options
    };
}

/* *
 *
 *  Declarations
 *
 * */

export interface JSON extends SerializableJSON<'Data.JSONConnector'> {
    options: OptionsJSON;
}

export type OptionsJSON = (JSONObject&JSONConnectorOptions);

/* *
 *
 *  Registry
 *
 * */

const JSONConnectorHelper: SerializableHelper<JSONConnector, JSON> = {
    $class: 'Data.JSONConnector',
    fromJSON,
    jsonSupportFor,
    toJSON
};


/* *
 *
 *  Default Export
 *
 * */

export default JSONConnectorHelper;

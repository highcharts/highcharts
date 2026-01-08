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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type JSON from '../JSON';
import type JSONConnectorOptions from '../../Data/Connectors/JSONConnectorOptions';

import JSONConnector from '../../Data/Connectors/JSONConnector.js';
import DataTableHelper from './DataTableHelper.js';
import Serializable from '../Serializable.js';
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
 * @param {JSONConnectorHelper.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {JSONConnector}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: JSONConnectorHelper.JSON
): JSONConnector {
    return new JSONConnector(json.options);
}

/**
 * Validates the given class instance for JSON support.
 *
 * @param {Globals.AnyRecord} obj
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
 * @return {JSONConnectorHelper.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: JSONConnector
): JSONConnectorHelper.JSON {
    const options = merge(obj.options) as JSONConnectorHelper.OptionsJSON;

    options.dataTable = DataTableHelper.toJSON(obj.getTable());

    return {
        $class: 'Data.JSONConnector',
        options
    };
}

/* *
 *
 *  Namespace
 *
 * */

namespace JSONConnectorHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.JSONConnector'> {
        options: OptionsJSON;
    }

    export type OptionsJSON = (JSON.Object&JSONConnectorOptions);

}

/* *
 *
 *  Registry
 *
 * */

const JSONConnectorHelper: Serializable.Helper<JSONConnector, JSONConnectorHelper.JSON> = {
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

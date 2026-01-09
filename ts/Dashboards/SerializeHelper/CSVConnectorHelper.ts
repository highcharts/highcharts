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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type JSON from '../JSON';
import type CSVConnectorOptions from '../../Data/Connectors/CSVConnectorOptions';

import CSVConnector from '../../Data/Connectors/CSVConnector.js';
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
 * @param {CSVConnectorHelper.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {CSVConnector}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: CSVConnectorHelper.JSON
): CSVConnector {
    return new CSVConnector(json.options);
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
 * @return {CSVConnectorHelper.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: CSVConnector
): CSVConnectorHelper.JSON {
    const options = merge(obj.options) as CSVConnectorHelper.OptionsJSON;

    options.dataTable = DataTableHelper.toJSON(obj.getTable());

    return {
        $class: 'Data.CSVConnector',
        options
    };
}

/* *
 *
 *  Namespace
 *
 * */

namespace CSVConnectorHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.CSVConnector'> {
        options: OptionsJSON;
    }

    export type OptionsJSON = (JSON.Object&CSVConnectorOptions);

}

/* *
 *
 *  Registry
 *
 * */

const CSVConnectorHelper: Serializable.Helper<CSVConnector, CSVConnectorHelper.JSON> = {
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

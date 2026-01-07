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
import type HTMLTableConnectorOptions from '../../Data/Connectors/HTMLTableConnectorOptions';
import type HTMLTableConverterOptions from '../../Data/Converters/HTMLTableConverterOptions';

import DataTableHelper from './DataTableHelper.js';
import HTMLTableConnector from '../../Data/Connectors/HTMLTableConnector.js';
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
 * @param {HTMLTableConnectorHelper.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {HTMLTableConnector}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: HTMLTableConnectorHelper.JSON
): HTMLTableConnector {
    return new HTMLTableConnector(json.options);
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
): obj is HTMLTableConnector {
    return obj instanceof HTMLTableConnector;
}

/**
 * Converts the given class instance to JSON.
 *
 * @param {HTMLTableConnector} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {HTMLTableConnectorHelper.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: HTMLTableConnector
): HTMLTableConnectorHelper.JSON {
    const options = merge(obj.options) as HTMLTableConnectorHelper.OptionsJSON;

    options.dataTable = DataTableHelper.toJSON(obj.getTable());

    return {
        $class: 'Data.HTMLTableConnector',
        options
    };
}

/* *
 *
 *  Namespace
 *
 * */

namespace HTMLTableConnectorHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.HTMLTableConnector'> {
        options: OptionsJSON;
    }

    export type OptionsJSON =
        JSON.Object & HTMLTableConnectorOptions & HTMLTableConverterOptions;

}

/* *
 *
 *  Default Export
 *
 * */

const HTMLTableConnectorHelper: Serializable.Helper<HTMLTableConnector, HTMLTableConnectorHelper.JSON> = {
    $class: 'Data.HTMLTableConnector',
    fromJSON,
    jsonSupportFor,
    toJSON
};

Serializable.registerHelper(HTMLTableConnectorHelper);

/* *
 *
 *  Default Export
 *
 * */

export default HTMLTableConnectorHelper;

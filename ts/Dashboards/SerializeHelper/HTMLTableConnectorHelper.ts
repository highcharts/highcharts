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

import type DataConnector from '../../Data/Connectors/DataConnector';
import type JSON from '../../Core/JSON';
import type Serializable from '../Serializable';

import DataTableHelper from './DataTableHelper.js';
import HTMLTableConnector from '../../Data/Connectors/HTMLTableConnector.js';
import U from '../../Core/Utilities.js';
import HTMLTableConverterHelper from './HTMLTableConverterHelper';
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
    const converter = HTMLTableConverterHelper.fromJSON(json.converter),
        table = DataTableHelper.fromJSON(json.table),
        connector = new HTMLTableConnector(table, json.options, converter);

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
    const json: HTMLTableConnectorHelper.JSON = {
            $class: 'Data.HTMLTableConnector',
            converter: HTMLTableConverterHelper.toJSON(obj.converter),
            metadata: obj.metadata,
            options: {},
            table: DataTableHelper.toJSON(obj.table)
        },
        jsonOptions: HTMLTableConnectorHelper.OptionsJSON = json.options,
        options = obj.options;

    // options

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

    // done

    return json;
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
        converter: HTMLTableConverterHelper.JSON;
        metadata: DataConnector.Metadata;
        options: OptionsJSON;
        table: DataTableHelper.JSON;
    }

    export interface OptionsJSON extends JSON.Object, Partial<HTMLTableConnector.Options> {
        table?: string;
    }

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

export default HTMLTableConnectorHelper;

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
import type Serializable from '../Serializable';

import DataTableHelper from './DataTableHelper.js';
import CSVConnector from '../../Data/Connectors/CSVConnector.js';
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
    const table = DataTableHelper.fromJSON(json.table),
        connector = new CSVConnector(table, json.options);

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
    return {
        $class: 'Data.CSVConnector',
        metadata: (obj.metadata),
        options: (obj.options),
        table: DataTableHelper.toJSON(obj.table)
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
        metadata: DataConnector.Metadata;
        options: CSVConnector.Options;
        table: DataTableHelper.JSON;
    }

}

/* *
 *
 *  Default Export
 *
 * */

const CSVConnectorHelper: Serializable.Helper<CSVConnector, CSVConnectorHelper.JSON> = {
    $class: 'Data.CSVConnector',
    fromJSON,
    jsonSupportFor,
    toJSON
};

export default CSVConnectorHelper;

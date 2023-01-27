/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Pawel Lysy
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Import
 *
 * */

import HTMLTableConverter from '../../Data/Converters/HTMLTableConverter.js';
import Serializable from '../Serializable.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Functions
 *
 * */

/**
 * Change the obj of HTMLTableConverter to its Serialized form.
 * @param obj Object to serialize
 * @return {HTMLTableConverterHelper.JSON} Serialized object
 */
function toJSON(obj: HTMLTableConverter): HTMLTableConverterHelper.JSON {
    return {
        $class: 'Data.HTMLTableConverter',
        options: merge(obj.options),
        tableElementId: obj.tableElement && obj.tableElement.id
    };
}

/**
 * Check if the Object on the input is the correct Object to be serialized
 * @param obj Obj to check
 * @return {obj is HTMLTableConverter} If object is HTMLTableConverter
 */
function jsonSupportFor(obj: unknown): obj is HTMLTableConverter {
    return obj instanceof HTMLTableConverter;
}

/**
 * JSON object as a base.
 * @param json Serialized object
 * @return {HTMLTableConverter} New Data Converter object created from serialized object
 */
function fromJSON(json: HTMLTableConverterHelper.JSON): HTMLTableConverter {
    const id = json.tableElementId,
        tableElement = id ? document.getElementById(id) : null;

    return new HTMLTableConverter(json.options, tableElement);
}

/* *
 *
 *  Namespace
 *
 * */

namespace HTMLTableConverterHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.HTMLTableConverter'>{
        options: HTMLTableConverter.Options;
        tableElementId?: string;
    }

}

/* *
 *
 *  Registry
 *
 * */

const HTMLTableConverterHelper:
Serializable.Helper<HTMLTableConverter, HTMLTableConverterHelper.JSON> = {
    $class: 'Data.HTMLTableConverter',
    fromJSON,
    jsonSupportFor,
    toJSON
};

Serializable.registerHelper(HTMLTableConverterHelper);

/* *
 *
 *  Default Export
 *
 * */

export default HTMLTableConverterHelper;

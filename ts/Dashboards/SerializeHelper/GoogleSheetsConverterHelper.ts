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

import Serializable from '../Serializable.js';
import U from '../../Core/Utilities.js';
import GoogleSheetsConverter from '../../Data/Converters/GoogleSheetsConverter.js';
const { merge } = U;

/* *
 *
 *  Functions
 *
 * */

/**
 * Change the obj of GoogleSheetsConverter its Serialized form.
 * @param obj Object to serialize
 * @return {GoogleSheetsConverterHelper.JSON} Serialized object
 */
function toJSON(obj: GoogleSheetsConverter): GoogleSheetsConverterHelper.JSON {
    return {
        $class: 'Data.GoogleSheetsConverter',
        options: merge(obj.options)
    };
}

/**
 * Check if the Object on the input is the correct Object to be serialized
 * @param obj Obj to check
 * @return {obj is GoogleSheetsConverter} If object is GoogleSheetsConverter
 */
function jsonSupportFor(obj: unknown): obj is GoogleSheetsConverter {
    return obj instanceof GoogleSheetsConverter;
}

/**
 * JSON object as a base.
 * @param json Serialized object
 * @return {GoogleSheetsConverter} New Data Converter object created from
 * serialized object
 */
function fromJSON(
    json: GoogleSheetsConverterHelper.JSON
): GoogleSheetsConverter {
    return new GoogleSheetsConverter(json.options);
}

/*
 *
 *  Namespace
 *
 * */

namespace GoogleSheetsConverterHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.GoogleSheetsConverter'>{
        options: GoogleSheetsConverter.Options;
    }

}

/* *
 *
 *  Registry
 *
 * */

const GoogleSheetsConverterHelper:
Serializable.Helper<GoogleSheetsConverter, GoogleSheetsConverterHelper.JSON> = {
    $class: 'Data.GoogleSheetsConverter',
    fromJSON,
    jsonSupportFor,
    toJSON
};

Serializable.registerHelper(GoogleSheetsConverterHelper);

/* *
 *
 *  Default Export
 *
 * */

export default GoogleSheetsConverterHelper;

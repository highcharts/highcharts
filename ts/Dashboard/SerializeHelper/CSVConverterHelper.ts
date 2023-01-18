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
import CSVConverter from '../../Data/Converters/CSVConverter.js';
const { merge } = U;

/* *
 *
 *  Functions
 *
 * */

/**
 * Change the obj of CSVConverter to its Serialized form.
 * @param obj Object to serialize
 * @return {CSVConverterHelper.JSON} Serialized object
 */
function toJSON(obj: CSVConverter): CSVConverterHelper.JSON {
    return {
        $class: 'Data.CSVConverter',
        options: merge(obj.options)
    };
}

/**
 * Check if the Object on the input is the correct Object to be serialized
 * @param obj Obj to check
 * @return {obj is CSVConverter} If object is CSVConverter
 */
function jsonSupportFor(obj: unknown): obj is CSVConverter {
    return obj instanceof CSVConverter;
}

/**
 * JSON object as a base.
 * @param json Serialized object
 * @return {CSVConverter} New Data Converter object created from serialized object
 */
function fromJSON(json: CSVConverterHelper.JSON): CSVConverter {
    return new CSVConverter(json.options);
}

/*
 *
 *  Namespace
 *
 * */

namespace CSVConverterHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.CSVConverter'>{
        options: CSVConverter.Options;
    }

}

/* *
 *
 *  Registry
 *
 * */

const CSVConverterHelper:
Serializable.Helper<CSVConverter, CSVConverterHelper.JSON> = {
    $class: 'Data.CSVConverter',
    fromJSON,
    jsonSupportFor,
    toJSON
};

Serializable.registerHelper(CSVConverterHelper);

/* *
 *
 *  Default Export
 *
 * */

export default CSVConverterHelper;

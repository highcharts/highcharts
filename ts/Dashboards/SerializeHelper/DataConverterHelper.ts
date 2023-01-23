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

import DataConverter from '../../Data/Converters/DataConverter.js';
import Serializable from '../Serializable.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Functions
 *
 * */
/**
 * Change the obj of DataConverter to its Serialized form.
 * @param obj Object to serialize
 * @return Serialized object
 */

function toJSON(obj: DataConverter): DataConverterHelper.JSON {
    return {
        $class: 'Data.DataConverter',
        options: merge(obj.options),
        parseDateFn: obj.parseDateFn && `${obj.parseDateFn}`
    };
}

/**
 * Check if the Object on the input is the correct Object to be serialized
 * @param obj Obj to check
 * @return {obj is DataConverter} If object is DataConverter
 */
function jsonSupportFor(obj: unknown): obj is DataConverter {
    return obj instanceof DataConverter;
}

/**
 * JSON object as a base.
 * @param json Serialized object
 * @return {DataConverter} New Data Converter object created from serialized object
 */
function fromJSON(json: DataConverterHelper.JSON): DataConverter {
    return new DataConverter(
        json.options,
        // eslint-disable-next-line no-eval
        json.parseDateFn && eval(json.parseDateFn)
    );
}

/*
 *
 *  Namespace
 *
 * */

namespace DataConverterHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.DataConverter'>{
        options: DataConverter.Options;
        parseDateFn?: string;
    }

}

/* *
 *
 *  Registry
 *
 * */

const DataConverterHelper:
Serializable.Helper<DataConverter, DataConverterHelper.JSON> = {
    $class: 'Data.DataConverter',
    fromJSON,
    jsonSupportFor,
    toJSON
};

Serializable.registerHelper(DataConverterHelper);

/* *
 *
 *  Default Export
 *
 * */

export default DataConverterHelper;

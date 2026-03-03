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
 *  - Sophie Bremer
 *
 * */

'use strict';
/* *
 *
 *  Import
 *
 * */

import type { JSONObject } from '../JSON';
import type { Helper as SerializableHelper, JSON as SerializableJSON } from '../Serializable';

import DataConverter, {
    type Options as DataConverterOptions
} from '../../Data/Converters/DataConverter.js';
import Serializable from '../Serializable.js';
import { merge } from '../../Shared/Utilities.js';

/* *
 *
 *  Functions
 *
 * */

/**
 * JSON object as a base.
 * @param json Serialized object
 * @return {DataConverter} New Data Converter object created from serialized object
 */
function fromJSON(json: JSON): DataConverter {
    return new DataConverter(json.options);
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
 * Change the obj of DataConverter to its Serialized form.
 * @param obj Object to serialize
 * @return Serialized object
 */
function toJSON(obj: DataConverter): JSON {
    return {
        $class: 'Data.DataConverter',
        options: merge(obj.options) as OptionsJSON
    };
}

/*
 *
 *  Declarations
 *
 * */

export interface JSON extends SerializableJSON<'Data.DataConverter'>{
    options: OptionsJSON;
}

export type OptionsJSON = (JSONObject&DataConverterOptions);

/* *
 *
 *  Registry
 *
 * */

const DataConverterHelper: SerializableHelper<DataConverter, JSON> = {
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

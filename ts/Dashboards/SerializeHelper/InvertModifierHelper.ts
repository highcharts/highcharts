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

import type Serializable from '../Serializable.js';

import InvertModifier from '../../Data/Modifiers/InvertModifier';

/* *
 *
 *  Functions
 *
 * */

/**
 * Converts the given JSON to a class instance.
 *
 * @param {ChainModifierSerializer.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {ChainModifier}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: InvertModifierHelper.JSON
): InvertModifier {
    return new InvertModifier(json.options);
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
): obj is InvertModifier {
    return obj instanceof InvertModifier;
}

/**
 * Converts the given class instance to JSON.
 *
 * @param {InvertModifier} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {InvertModifierHelper.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: InvertModifier
): InvertModifierHelper.JSON {
    return {
        $class: 'Data.InvertModifier',
        options: obj.options
    };
}

/* *
 *
 *  Namespace
 *
 * */

namespace InvertModifierHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.InvertModifier'> {
        options: InvertModifier.Options;
    }

}

/* *
 *
 *  Default Export
 *
 * */

const InvertModifierHelper: Serializable.Helper<InvertModifier, InvertModifierHelper.JSON> = {
    $class: 'Data.InvertModifier',
    fromJSON,
    jsonSupportFor,
    toJSON
};

export default InvertModifierHelper;

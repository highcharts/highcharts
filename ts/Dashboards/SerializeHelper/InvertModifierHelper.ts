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
import type InvertModifierOptions from '../../Data/Modifiers/InvertModifierOptions';
import type { JSONObject } from '../JSON';

import InvertModifier from '../../Data/Modifiers/InvertModifier';
import Serializable from '../Serializable.js';
import type { Helper as SerializableHelper, JSON as SerializableJSON } from '../Serializable';

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
    json: JSON
): InvertModifier {
    return new InvertModifier(json.options);
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
): obj is InvertModifier {
    return obj instanceof InvertModifier;
}

/**
 * Converts the given class instance to JSON.
 *
 * @param {InvertModifier} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: InvertModifier
): JSON {
    return {
        $class: 'Data.InvertModifier',
        options: obj.options as OptionsJSON
    };
}

/* *
 *
 *  Declarations
 *
 * */

export interface JSON extends SerializableJSON<'Data.InvertModifier'> {
    options: OptionsJSON;
}

export type OptionsJSON = (JSONObject&InvertModifierOptions);

/* *
 *
 *  Registry
 *
 * */

const InvertModifierHelper: SerializableHelper<InvertModifier, JSON> = {
    $class: 'Data.InvertModifier',
    fromJSON,
    jsonSupportFor,
    toJSON
};

Serializable.registerHelper(InvertModifierHelper);

/* *
 *
 *  Default Export
 *
 * */

export default InvertModifierHelper;

/* *
 *
 *  (c) 2020 - 2021 Highsoft AS
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

import type CoreJSON from '../../Core/JSON';
import type DataModifier from '../../Data/Modifiers/DataModifier';

import ChainModifier from '../../Data/Modifiers/ChainModifier.js';
import Serializable from '../Serializable.js';

/* *
 *
 *  Constants
 *
 * */

const ChainModifierSerializer: Serializable<ChainModifier, ChainModifierSerializer.JSON> = {
    fromJSON,
    jsonSupportFor,
    toJSON
};

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
    json: ChainModifierSerializer.JSON
): ChainModifier {
    const jsonModifiers = json.modifiers,
        modifiers: Array<DataModifier> = [],
        iEnd = jsonModifiers.length;

    // modifiers

    for (
        let i = 0,
            modifier: DataModifier,
            modifierJSON: CoreJSON.Object;
        i < iEnd;
        ++i
    ) {
        modifierJSON = jsonModifiers[i];
        modifier = Serializable.fromJSON(modifierJSON) as DataModifier;
        modifiers.push(modifier);
    }

    // done

    return new ChainModifier(json.options, ...modifiers);
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
): obj is ChainModifier {
    return obj instanceof ChainModifier;
}

/**
 * Converts the given class instance to JSON.
 *
 * @param {DataTable} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {DataTableJSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj?: ChainModifier
): ChainModifierSerializer.JSON {
    const json: ChainModifierSerializer.JSON = {
        $class: 'Data.ChainModifier',
        modifiers: [],
        options: (obj && obj.options)
    };

    if (obj) {

        // modifiers

        const jsonModifiers = json.modifiers,
            modifiers = obj.modifiers,
            iEnd = modifiers.length;

        for (let i = 0, modifierJSON: CoreJSON.Object; i < iEnd; ++i) {
            modifierJSON = Serializable.toJSON(modifiers[i]);
            jsonModifiers.push(modifierJSON);
        }

    }

    // done

    return json;
}

/* *
 *
 *  Namespace
 *
 * */

namespace ChainModifierSerializer {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.ChainModifier'> {
        modifiers: CoreJSON.Array<CoreJSON.Object>;
        options?: ChainModifier.Options;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ChainModifierSerializer;

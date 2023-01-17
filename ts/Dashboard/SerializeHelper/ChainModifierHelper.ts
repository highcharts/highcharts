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

import type CoreJSON from '../../Core/JSON';
import type DataModifier from '../../Data/Modifiers/DataModifier';

import ChainModifier from '../../Data/Modifiers/ChainModifier.js';
import GroupModifierHelper from './GroupModifierHelper.js';
import InvertModifierHelper from './InvertModifierHelper.js';
import Serializable from '../Serializable.js';

/* *
 *
 *  Functions
 *
 * */

/**
 * Converts the given JSON to a class instance.
 *
 * @param {ChainModifierHelper.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {ChainModifier}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: ChainModifierHelper.JSON
): ChainModifier {
    const jsonModifiers = json.modifiers,
        modifiers: Array<DataModifier> = [],
        iEnd = jsonModifiers.length;

    // modifiers

    for (
        let i = 0,
            modifier: DataModifier,
            modifierJSON: Serializable.JSON<string>;
        i < iEnd;
        ++i
    ) {
        modifierJSON = jsonModifiers[i];
        switch (modifierJSON.$class) {
            case GroupModifierHelper.$class:
                modifier = GroupModifierHelper
                    .fromJSON(modifierJSON as GroupModifierHelper.JSON);
                break;
            case InvertModifierHelper.$class:
                modifier = InvertModifierHelper
                    .fromJSON(modifierJSON as InvertModifierHelper.JSON);
                break;
            default:
                modifier = Serializable.fromJSON(modifierJSON) as DataModifier;
                break;
        }
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
 * @param {ChainModifier} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {ChainModifierHelper.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: ChainModifier
): ChainModifierHelper.JSON {
    const json: ChainModifierHelper.JSON = {
        $class: 'Data.ChainModifier',
        modifiers: [],
        options: obj.options
    };

    // modifiers

    const jsonModifiers = json.modifiers,
        modifiers = obj.modifiers,
        iEnd = modifiers.length;

    for (
        let i = 0,
            modifier: DataModifier,
            modifierJSON: Serializable.JSON<string>;
        i < iEnd;
        ++i
    ) {
        modifier = modifiers[i];
        if (GroupModifierHelper.jsonSupportFor(modifier)) {
            modifierJSON = GroupModifierHelper.toJSON(modifier);
        } else if (InvertModifierHelper.jsonSupportFor(modifier)) {
            modifierJSON = InvertModifierHelper.toJSON(modifier);
        } else {
            modifierJSON = Serializable.toJSON(modifiers[i]);
        }
        jsonModifiers.push(modifierJSON);
    }

    // done

    return json;
}

/* *
 *
 *  Namespace
 *
 * */

namespace ChainModifierHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.ChainModifier'> {
        modifiers: CoreJSON.Array<Serializable.JSON<string>>;
        options: ChainModifier.Options;
    }

}

/* *
 *
 *  Default Export
 *
 * */

const ChainModifierHelper: Serializable.Helper<ChainModifier, ChainModifierHelper.JSON> = {
    $class: 'Data.ChainModifier',
    fromJSON,
    jsonSupportFor,
    toJSON
};

export default ChainModifierHelper;

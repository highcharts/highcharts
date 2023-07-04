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

import type ChainModifierOptions from '../../Data/Modifiers/ChainModifierOptions';
import type DataModifier from '../../Data/Modifiers/DataModifier';
import type { DataModifierTypeOptions } from '../../Data/Modifiers/DataModifierType';
import type Globals from '../Globals';
import type JSON from '../JSON';

import ChainModifier from '../../Data/Modifiers/ChainModifier.js';
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
    const chainOptions = json.options.chain,
        jsonChain = json.chain,
        modifiers: Array<DataModifier> = [];

    // modifiers

    for (let i = 0, iEnd = jsonChain.length; i < iEnd; ++i) {
        modifiers.push(Serializable.fromJSON(jsonChain[i]) as DataModifier);
    }

    // apply chain options later

    delete json.options.chain;

    const chainModifier = new ChainModifier(json.options, ...modifiers);

    chainModifier.options.chain = chainOptions;

    // done

    return chainModifier;
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
    obj: Globals.AnyRecord
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
    const chain: Array<ChainModifierHelper.ChainJSON> = [],
        options = obj.options as ChainModifierHelper.OptionsJSON;

    // modifiers

    const objChain = obj.chain;

    for (let i = 0, iEnd = objChain.length; i < iEnd; ++i) {
        chain.push(
            Serializable.toJSON(objChain[i]) as ChainModifierHelper.ChainJSON
        );
    }

    // done

    return {
        $class: 'Data.ChainModifier',
        chain: [],
        options
    };
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

    export type ChainJSON = (Serializable.JSON<string>&DataModifierTypeOptions);

    export interface JSON extends Serializable.JSON<'Data.ChainModifier'> {
        chain: Array<ChainJSON>
        options: OptionsJSON;
    }

    export type OptionsJSON = (JSON.Object&ChainModifierOptions);

}

/* *
 *
 *  Registry
 *
 * */

const ChainModifierHelper: Serializable.Helper<ChainModifier, ChainModifierHelper.JSON> = {
    $class: 'Data.ChainModifier',
    fromJSON,
    jsonSupportFor,
    toJSON
};

Serializable.registerHelper(ChainModifierHelper);

/* *
 *
 *  Default Export
 *
 * */

export default ChainModifierHelper;

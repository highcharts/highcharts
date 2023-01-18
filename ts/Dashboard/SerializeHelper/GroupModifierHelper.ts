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

import GroupModifier from '../../Data/Modifiers/GroupModifier.js';

/* *
 *
 *  Functions
 *
 * */

/**
 * Converts the given JSON to a class instance.
 *
 * @param {GroupModifierHelper.JSON} json
 * JSON to deserialize as a class instance or object.
 *
 * @return {GroupModifier}
 * Returns the class instance or object, or throws an exception.
 */
function fromJSON(
    json: GroupModifierHelper.JSON
): GroupModifier {
    return new GroupModifier(json.options);
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
): obj is GroupModifier {
    return obj instanceof GroupModifier;
}

/**
 * Converts the given class instance to JSON.
 *
 * @param {GroupModifier} obj
 * Class instance or object to serialize as JSON.
 *
 * @return {GroupModifierHelper.JSON}
 * Returns the JSON of the class instance or object.
 */
function toJSON(
    obj: GroupModifier
): GroupModifierHelper.JSON {
    return {
        $class: 'Data.GroupModifier',
        options: obj.options
    };
}

/* *
 *
 *  Namespace
 *
 * */

namespace GroupModifierHelper {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends Serializable.JSON<'Data.GroupModifier'> {
        options: GroupModifier.Options;
    }

}

/* *
 *
 *  Default Export
 *
 * */

const GroupModifierHelper: Serializable.Helper<GroupModifier, GroupModifierHelper.JSON> = {
    $class: 'Data.GroupModifier',
    fromJSON,
    jsonSupportFor,
    toJSON
};

export default GroupModifierHelper;

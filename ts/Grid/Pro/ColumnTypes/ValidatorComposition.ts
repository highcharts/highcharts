/* *
 *
 *  Validator Composition.
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type ColumnDataType from './ColumnDataType';
import type Table from '../../Core/Table/Table';
import Validator from './Validator.js';
import Globals from '../../Core/Globals.js';
import U from '../../../Core/Utilities.js';

const {
    addEvent,
    pushUnique
} = U;


/* *
 *
 *  Composition
 *
 * */

/**
 * @internal
 */
namespace ValidatorComposition {

    /**
     * Extends the grid classes with cell editing functionality.
     *
     * @param TableClass
     * The class to extend.
     *
     */
    export function compose(
        TableClass: typeof Table
    ): void {
        if (!pushUnique(Globals.composed, 'Validator')) {
            return;
        }

        addEvent(TableClass, 'afterInit', initValidatorComposition);
        addEvent(TableClass, 'afterDestroy', destroy);
    }

    /**
     * Callback function called after table initialization.
     */
    function initValidatorComposition(this: Table): void {
        this.validator = new Validator(this);
    }

    /**
     * Callback function called after table destroy.
     */
    function destroy(this: Table): void {
        this.validator.destroy();
    }
}

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Table/Table' {
    export default interface Table {
        /**
         * The validator object.
         */
        validator: Validator;
    }
}

declare module '../../Core/Options' {
    interface ColumnOptions {
        /**
         * The data type of the column. Can be one of `string`, `number`,
         * `boolean` or `date`.
         *
         * TODO: Add default (?)
         * If not set, the data type is inferred from the first cell in the
         * column. If the cell is empty, the default type is `string`.
         */
        dataType?: ColumnDataType;

        /**
         * Validation options for the column.
         *
         * If not set, the validation rules are applied according to the data
         * type.
         */
        validationRules?: (Validator.RuleKey|Validator.RuleDefinition)[];
    }
}

declare module '../../Core/Options' {
    interface LangOptions {
        /**
         * Validation options for the column.
         *
         * If not set, the validation rules are applied according to the data
         * type.
         */
        validationErrors?: Validator.RulesRegistryType;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default ValidatorComposition;

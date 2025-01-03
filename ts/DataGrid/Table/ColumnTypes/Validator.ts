/* *
 *
 *  DataGrid cell content validator
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import Table from '../Table.js';
import TableCell from '../Content/TableCell.js';
import Globals from '../../Globals.js';
import DGUtils from '../../Utils.js';

const { makeDiv } = DGUtils;

/* *
 *
 *  Class
 *
 * */

/**
 * Class for validating cell content.
 */
class Validator {


    /* *
     *
     *  Properties
     *
     * */

    public viewport: Table;

    public errorsContainer: HTMLElement;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(viewport: Table) {
        this.viewport = viewport;
        this.errorsContainer = makeDiv(Globals.classNames.errorsContainer);
        this.viewport.dataGrid.contentWrapper?.appendChild(
            this.errorsContainer
        );
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Validates the cell content.
     *
     * @param cell
     * Edited cell
     *
     * @param value
     * New value
     *
     * @param errors
     * An output array for error messages.
     *
     * @returns
     * Returns true if the value is valid, false otherwise.
     */
    public validate(
        cell: TableCell,
        value: string,
        errors: string[] = []
    ): boolean {
        const { column } = cell;
        const rules = column.options.validationRules;

        if (!rules) {
            return true;
        }

        for (const rule of rules) {
            let ruleDef: Validator.RuleDefinition;

            if (typeof rule === 'string') {
                ruleDef = Validator.rulesRegistry[rule];
            } else {
                ruleDef = rule;
            }

            if (!ruleDef.validate.call(cell, value)) {
                errors.push(ruleDef.errorMessage);
            }
        }

        return !errors.length;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public show(cell: TableCell, message: string[]): void {
        cell.htmlElement.classList.add(Globals.classNames.editedCellError);
    }

    public hide(cell: TableCell): void {
        cell.htmlElement.classList.remove(
            Globals.classNames.editedCellError
        );
    }

    public destroy(): void {

    }
}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Namespace for Validation functionality.
 */
namespace Validator {


    /* *
     *
     *  Declarations
     *
     * */

    export type ValidateFunction = (this: TableCell, value: string) => boolean;

    export interface RuleDefinition {
        validate: ValidateFunction;
        errorMessage: string;
    }

    export interface RulesRegistryType {
        notEmpty: RuleDefinition;
        number: RuleDefinition;
        bool: RuleDefinition;
    }

    export type RuleKey = keyof RulesRegistryType;


    /* *
     *
     *  Variables
     *
     * */

    export const rulesRegistry: RulesRegistryType = {
        notEmpty: {
            validate: (value: string): boolean => !!value,
            errorMessage: 'Value cannot be empty.'
        },
        number: {
            validate: (value: string): boolean => !isNaN(Number(value)),
            errorMessage: 'Value has to be a number.'
        },
        bool: {
            validate: (value: string): boolean => (
                value === 'true' || value === 'false' ||
                Number(value) === 1 || Number(value) === 0
            ),
            errorMessage: 'Value has to be a boolean.'
        }
    };
}


/* *
 *
 *  Default Export
 *
 * */

export default Validator;

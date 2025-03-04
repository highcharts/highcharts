/* *
 *
 *  Grid cell content validator
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

import type Table from '../../Core/Table/Table';
import type TableCell from '../../Core/Table/Content/TableCell';
import type ColumnDataType from './ColumnDataType';

import Globals from '../../Core/Globals.js';
import GridUtils from '../../Core/GridUtils.js';
import Cell from '../../Core/Table/Cell.js';

const { makeDiv } = GridUtils;

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

    /**
     * The cell that has an error.
     */
    public errorCell?: Cell;

    /**
     * HTML Element for the errors.
     */
    public errorsContainer: HTMLElement;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(viewport: Table) {
        this.viewport = viewport;
        this.errorsContainer = makeDiv(Validator.classNames.errorsContainer);
        this.viewport.grid.contentWrapper?.appendChild(
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
     * Edited cell.
     *
     * @param value
     * Value to validate.
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
        const { validationRules, dataType } = cell.column.options;
        const rules = Array.from(validationRules || []);

        if (dataType) {
            // TODO: Remove duplicates in rules array
            rules.push(...Validator.predefinedRules[dataType]);
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

    /**
     * Set content and adjust the position.
     *
     * @param cell
     * Cell that is currently edited and is not valid.
     *
     * @param errors
     * An array of error messages.
     *
     */
    public initErrorBox(cell: TableCell, errors: string[]): void {
        this.errorCell = cell;

        // Set error container position
        this.setPosition();
        // Set width and content
        this.errorsContainer.innerHTML = errors.join('<br />');

        this.show();
    }

    /**
     * Highlight the non-valid cell and display error in the box.
     */
    public show(): void {
        this.errorCell?.htmlElement.classList.add(
            Validator.classNames.editedCellError
        );
        this.errorsContainer.style.display = 'block';
    }

    /**
     * Hide the error and unset highlight on cell.
     */
    public hide(
        // hideErrorBox: boolean = true
    ): void {
        this.errorsContainer.style.display = 'none';

        // if (hideErrorBox) {
            this.errorCell?.htmlElement.classList.remove(
                Validator.classNames.editedCellError
            );
        // }
    }

    /**
     * Set the position of the error box.
     */
    public setPosition(): void {
        const errorCell =
            this.errorCell?.htmlElement.getBoundingClientRect();
        const tableElement =
            this.viewport.grid.tableElement?.getBoundingClientRect();


        if (!errorCell) {
            return;
        }

        this.errorsContainer.style.top =
            errorCell.top + errorCell.height - (tableElement?.top || 0) + 'px';
        this.errorsContainer.style.left =
            (errorCell.left - (tableElement?.left || 0)) + 'px';
        this.errorsContainer.style.width = errorCell.width + 'px';
    }

    /**
     * Destroy validator.
     */
    public destroy(): void {
        this.errorCell = void 0;
        this.errorsContainer.remove();
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

    /**
     * Global validation CSS classes.
     */
    export const classNames = {
        errorsContainer: Globals.classNamePrefix + 'errors-container',
        editedCellError: Globals.classNamePrefix + 'edited-cell-error'
    };

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

    export const predefinedRules: Record<ColumnDataType, RuleKey[]> = {
        number: ['number'],
        bool: ['bool'],
        string: [],
        date: ['number']
    };
}


/* *
 *
 *  Default Export
 *
 * */

export default Validator;

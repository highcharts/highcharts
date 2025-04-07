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

import AST from '../../../Core/Renderer/HTML/AST.js';
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
    public notifContainer: HTMLElement;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(viewport: Table) {
        this.viewport = viewport;
        this.notifContainer = makeDiv(Validator.classNames.notifContainer);
        this.viewport.grid.contentWrapper?.appendChild(
            this.notifContainer
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
        const validationErrors =
            cell.row.viewport.grid.options?.lang?.validationErrors;

        if (dataType) {
            // TODO: Remove duplicates in rules array
            rules.push(...Validator.predefinedRules[dataType]);
        }

        for (const rule of rules) {
            let ruleDef: Validator.RuleDefinition;
            let err;

            if (typeof rule === 'string') {
                ruleDef = Validator.rulesRegistry[rule];
                err = validationErrors?.[rule]?.error;
            } else {
                ruleDef = rule;
            }

            if (!ruleDef.validate.call(cell, value)) {
                errors.push(
                    err || ruleDef.error
                );
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
        this.notifContainer.innerHTML = errors.join('<br />');

        this.show();
    }

    /**
     * Highlight the non-valid cell and display error in the box.
     */
    public show(): void {
        this.errorCell?.htmlElement.classList.add(
            Validator.classNames.editedCellError
        );

        this.notifContainer.classList.add(
            Validator.classNames.notifError,
            Validator.classNames.notifAnimation
        );
    }

    /**
     * Hide the error and unset highlight on cell.
     *
     * @param hideErrorBox
     * The flag that hides the error box.
     *
     */
    public hide(
        hideErrorBox: boolean = true
    ): void {
        this.notifContainer.classList.remove(
            Validator.classNames.notifError,
            Validator.classNames.notifAnimation
        );

        if (hideErrorBox) {
            this.errorCell?.htmlElement.classList.remove(
                Validator.classNames.editedCellError
            );
        }

        this.notifContainer.innerHTML = AST.emptyHTML;
    }

    /**
     * Set the position of the error box.
     */
    public setPosition(): void {
        const vp = this.viewport,
            errorCell = this.errorCell?.htmlElement,
            tableElement = vp.grid.tableElement,
            contentWrapper = vp.grid.contentWrapper;

        if (!errorCell || !tableElement || !contentWrapper) {
            return;
        }

        const tableTop = tableElement.offsetTop,
            tableHeight = tableElement.offsetHeight,
            middlePoint = tableTop + (tableHeight / 2),
            errorCellTop = errorCell.offsetTop - tableTop;

        if (errorCellTop > middlePoint) {
            this.notifContainer.style.top = // Avoid header overlap
                tableTop + (vp.theadElement?.offsetHeight || 0) + 'px';
            this.notifContainer.style.bottom = 'auto';
        } else {
            this.notifContainer.style.top = 'auto';
            this.notifContainer.style.bottom =
                contentWrapper.offsetHeight - tableTop - tableHeight + 'px';
        }
    }

    /**
     * Destroy validator.
     */
    public destroy(): void {
        this.errorCell = void 0;
        this.notifContainer.remove();
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
        notifContainer: Globals.classNamePrefix + 'notification',
        notifError: Globals.classNamePrefix + 'notification-error',
        notifAnimation: Globals.classNamePrefix + 'notification-animation',
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
        error: string;
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
            error: 'Value cannot be empty.'
        },
        number: {
            validate: (value: string): boolean => !isNaN(Number(value)),
            error: 'Value has to be a number.'
        },
        bool: {
            validate: (value: string): boolean => (
                value === 'true' || value === 'false' ||
                Number(value) === 1 || Number(value) === 0
            ),
            error: 'Value has to be a boolean.'
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

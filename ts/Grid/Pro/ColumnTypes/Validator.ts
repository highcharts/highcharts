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
        const validationErrors =
            cell.row.viewport.grid.options?.lang?.validationErrors;
        // let err;

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

        this.errorsContainer.classList.add('hcg-edited-cell-error-fadeIn');
    }

    /**
     * Hide the error and unset highlight on cell.
     */
    public hide(
        hideErrorBox: boolean = true
    ): void {
        this.errorsContainer.classList.remove('hcg-edited-cell-error-fadeIn');

        if (hideErrorBox) {
            this.errorCell?.htmlElement.classList.remove(
                Validator.classNames.editedCellError
            );
        }

        this.errorsContainer.innerHTML = AST.emptyHTML;
    }

    /**
     * Get all siblings like credits element that are below the errorbox.
     * 
     * @param element 
     * @returns 
     */
    // private getSiblings(element?: HTMLElement): Array<Element> {
    //     if (!element || !element.parentNode) return [];
        
    //     return Array
    //         .from(element.parentNode.children)
    //         .filter(
    //             child => child !== element &&
    //             !child.classList.contains(Validator.classNames.errorsContainer)
    //         );
    // }

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
            this.errorsContainer.style.top = // avoid header overlap
                tableTop + (vp.theadElement?.offsetHeight || 0) + 'px';
            this.errorsContainer.style.bottom = 'auto';
        } else {
            this.errorsContainer.style.top = 'auto';
            this.errorsContainer.style.bottom =
                contentWrapper.offsetHeight - tableTop - tableHeight + 'px';
        }
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

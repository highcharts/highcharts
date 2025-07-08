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

import type Column from '../../Core/Table/Column';
import type { EditModeContent } from '../CellEditing/CellEditMode';
import type Table from '../../Core/Table/Table';
import type TableCell from '../../Core/Table/Body/TableCell';

import AST from '../../../Core/Renderer/HTML/AST.js';
import Globals from '../../Core/Globals.js';
import GridUtils from '../../Core/GridUtils.js';
import Cell from '../../Core/Table/Cell.js';
import U from '../../../Core/Utilities.js';

const {
    makeDiv,
    setHTMLContent
} = GridUtils;
const { defined } = U;

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
     * @param errors
     * An output array for error messages.
     *
     * @returns
     * Returns true if the value is valid, false otherwise.
     */
    public validate(
        cell: TableCell,
        errors: string[] = []
    ): boolean {
        const { options, dataType } = cell.column;
        const validationErrors =
            cell.row.viewport.grid.options?.lang?.validationErrors;
        let rules = Array.from(options?.cells?.editMode?.validationRules || []);

        // Remove duplicates in validationRules
        const isArrayString = rules.every(
            (rule): Boolean => typeof rule === 'string'
        );

        if (rules.length > 0 && isArrayString) {
            rules = [...new Set(rules)];
        } else {
            const predefined = Validator.predefinedRules[dataType] || [];

            const hasPredefined = rules.some(
                (rule): Boolean =>
                    typeof rule !== 'string' &&
                    typeof rule.validate === 'string' &&
                    predefined.includes(rule.validate)
            );

            if (!hasPredefined) {
                rules.push(...predefined);
            }
        }

        for (const rule of rules) {
            let ruleDef: Validator.RuleDefinition;
            let err;

            if (typeof rule === 'string') {
                ruleDef = Validator.rulesRegistry[rule];
                err = validationErrors?.[rule]?.notification;
            } else {
                ruleDef = rule;
            }

            let validateFn: Validator.ValidateFunction;

            if (typeof ruleDef.validate === 'string') {
                const predefinedRules = (
                    Validator.rulesRegistry[ruleDef.validate]
                ) as Validator.RuleDefinition;
                validateFn =
                    predefinedRules?.validate as Validator.ValidateFunction;
            } else {
                validateFn = ruleDef.validate as Validator.ValidateFunction;
            }

            const { editModeContent } = cell.column.viewport.cellEditing || {};

            if (
                typeof validateFn === 'function' &&
                editModeContent &&
                !validateFn.call(cell, editModeContent)
            ) {
                if (typeof ruleDef.notification === 'function') {
                    err = ruleDef.notification.call(cell, editModeContent);
                }
                errors.push((err || ruleDef.notification) as string);
            }
        }

        return !errors.length;
    }

    /**
     * Set content of notification and adjust the position.
     *
     * @param cell
     * Cell that is currently edited and is not valid.
     *
     * @param errors
     * An array of error messages.
     *
     */
    public initErrorBox(cell: TableCell, errors: string[]): void {
        const { grid } = this.viewport;

        this.errorCell = cell;

        // Set error container position
        this.reflow();

        // Set width and content
        setHTMLContent(this.notifContainer, errors.join('<br />'));

        // A11y announcement
        if (grid.options?.accessibility?.announcements?.cellEditing) {
            this.viewport.grid.accessibility?.announce(
                (grid.options?.lang?.accessibility?.cellEditing
                    ?.announcements?.notValid || ''
                ) + ' ' + errors.join('. '),
                true
            );
        }

        this.show();
    }

    /**
     * Highlight the non-valid cell and display error in the notification box.
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
     * Hide the notification, error and unset highlight on cell.
     *
     * @param hideErrorBox
     * The flag that hides the error on edited cell.
     *
     */
    public hide(
        hideErrorBox: boolean = true
    ): void {
        this.errorCell?.htmlElement.classList.remove(
            Validator.classNames.editedCellError
        );

        this.notifContainer.classList.remove(
            Validator.classNames.notifError,
            Validator.classNames.notifAnimation
        );

        if (hideErrorBox) {
            this.errorCell = void 0;
        }

        this.notifContainer.innerHTML = AST.emptyHTML;
    }

    /**
     * Set the position of the error box.
     */
    public reflow(): void {
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
     * The class names used by the validator functionality.
     */
    export const classNames = {
        notifContainer: Globals.classNamePrefix + 'notification',
        notifError: Globals.classNamePrefix + 'notification-error',
        notifAnimation: Globals.classNamePrefix + 'notification-animation',
        editedCellError: Globals.classNamePrefix + 'edited-cell-error'
    } as const;

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Callback function that checks if field is valid.
     */
    export type ValidateFunction = (
        this: TableCell,
        content: EditModeContent
    ) => boolean;

    /**
     * Callback function that returns a error message.
     */
    export type ValidationErrorFunction = (
        this: TableCell,
        content?: EditModeContent
    ) => string;

    /**
     * Definition of the validation rule that should container validate method
     * and error message displayed in notification.
     */
    export interface RuleDefinition {
        validate: RulesRegistryType|ValidateFunction;
        notification: string|ValidationErrorFunction;
    }

    /**
     *  Definition of default validation rules.
     */
    export interface RulesRegistryType {
        boolean: RuleDefinition;
        datetime: RuleDefinition;
        notEmpty: RuleDefinition;
        number: RuleDefinition;
    }

    /**
     * Type of rule: `notEmpty`, `number` or `boolean`.
     */
    export type RuleKey = keyof RulesRegistryType;

    /* *
     *
     *  Variables
     *
     * */

    /**
     * Definition of default validation rules.
     */
    export const rulesRegistry: RulesRegistryType = {
        notEmpty: {
            validate: ({ value, rawValue }): boolean => (
                defined(value) && rawValue.length > 0
            ),
            notification: 'Value cannot be empty.'
        },
        number: {
            validate: ({ rawValue }): boolean => !isNaN(+rawValue),
            notification: 'Value has to be a number.'
        },
        datetime: {
            validate: ({ value }): boolean => !defined(value) || !isNaN(+value),
            notification: 'Value has to be parsed to a valid timestamp.'
        },
        'boolean': {
            validate: ({ rawValue }): boolean => (
                rawValue === 'true' || rawValue === 'false' ||
                Number(rawValue) === 1 || Number(rawValue) === 0
            ),
            notification: 'Value has to be a boolean.'
        }
    };

    /**
     * Default validation rules for each dataType.
     */
    export const predefinedRules: Record<Column.DataType, RuleKey[]> = {
        'boolean': ['boolean'],
        datetime: ['datetime'],
        number: ['number'],
        string: []
    };
}


/* *
 *
 *  Default Export
 *
 * */

export default Validator;

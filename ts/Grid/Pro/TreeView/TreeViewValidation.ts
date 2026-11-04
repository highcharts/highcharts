/* *
 *
 *  Grid Tree View Validation
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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

import type Grid from '../../Core/Grid';
import type TableCell from '../../Core/Table/Body/TableCell';
import type { RuleDefinition } from '../ColumnTypes/Validator';

import Validator from '../ColumnTypes/Validator.js';
import { hasDataTableProvider } from '../../Core/Data/DataProvider.js';
import {
    buildPathHierarchy,
    getPathSegments
} from './TreeViewCommons.js';
import { getTreeViewRowId } from './TreeViewRowResolver.js';
import { defined } from '../../../Shared/Utilities.js';


/* *
 *
 *  Constants
 *
 * */

const TREE_PATH_RULES = {
    unique: 'treeViewPathUnique',
    syntax: 'treeViewPathSyntax'
} as const;


/* *
 *
 *  Functions
 *
 * */

/**
 * Validates TreeView path uniqueness against the source table.
 *
 * @param cell
 * Edited table cell.
 *
 * @param rawValue
 * Candidate raw path value.
 */
function validateTreePathUnique(
    cell: TableCell,
    rawValue: string
): boolean {
    const grid = cell.row.viewport.grid;
    const controller = grid.treeView;
    const input = controller?.options?.input;
    const sourceColumnId = grid.columnPolicy.getColumnSourceId(
        cell.column.id
    ) || cell.column.id;

    if (
        input?.type !== 'path' ||
        sourceColumnId !== input.pathColumn ||
        cell.value === rawValue
    ) {
        return true;
    }

    if (!hasDataTableProvider(grid.dataProvider)) {
        return true;
    }

    const sourceValues = grid.dataProvider.getDataTable(false)?.getColumn(
        sourceColumnId,
        true
    );

    return !sourceValues?.some((value): boolean => value === rawValue);
}

/**
 * Returns a TreeView path syntax validation message, if any.
 *
 * @param cell
 * Edited table cell.
 *
 * @param rawValue
 * Candidate raw path value.
 */
function getTreePathSyntaxValidationMessage(
    cell: TableCell,
    rawValue: string
): string | undefined {
    const grid = cell.row.viewport.grid;
    const controller = grid.treeView;
    const input = controller?.options?.input;
    const sourceColumnId = grid.columnPolicy.getColumnSourceId(
        cell.column.id
    ) || cell.column.id;

    if (
        input?.type !== 'path' ||
        sourceColumnId !== input.pathColumn
    ) {
        return;
    }

    if (!rawValue.length) {
        return 'TreeView path cannot be empty.';
    }

    const projectionState = controller?.getProjectionState();
    const rowId = getTreeViewRowId(cell.row, projectionState);
    const sourceRowIndex = defined(rowId) ?
        (
            projectionState?.sourceRowIndexesById.get(rowId) ??
            cell.row.index
        ) :
        cell.row.index;

    try {
        const segments = getPathSegments(rawValue, input.separator);
        buildPathHierarchy(
            rawValue,
            sourceColumnId,
            sourceRowIndex,
            segments,
            input.separator
        );
    } catch (error) {
        return (error as { message?: string }).message ||
            'TreeView path is invalid.';
    }
}

/**
 * Registers TreeView-specific validator rules in the shared validator
 * registry.
 */
function registerTreeViewValidationRules(): void {
    if (!Validator.rulesRegistry[TREE_PATH_RULES.unique]) {
        Validator.rulesRegistry[TREE_PATH_RULES.unique] = {
            validate: function (
                this: TableCell,
                content: { rawValue: string }
            ): boolean {
                return validateTreePathUnique(this, content.rawValue);
            },
            notification:
                'TreeView path must be unique within the source table.'
        };
    }

    if (!Validator.rulesRegistry[TREE_PATH_RULES.syntax]) {
        Validator.rulesRegistry[TREE_PATH_RULES.syntax] = {
            validate: function (
                this: TableCell,
                content: { rawValue: string }
            ): boolean {
                return !getTreePathSyntaxValidationMessage(
                    this,
                    content.rawValue
                );
            },
            notification: function (
                this: TableCell,
                content?: { rawValue: string }
            ): string {
                return getTreePathSyntaxValidationMessage(
                    this,
                    content?.rawValue || ''
                ) || 'TreeView path is invalid.';
            }
        };
    }
}

/**
 * Synchronizes TreeView path validation rules with the current path column.
 *
 * @param grid
 * Grid instance owning the current TreeView controller.
 */
function syncTreePathValidationRules(grid: Grid): void {
    const controller = grid.treeView;
    const input = controller?.options?.input;
    const columnIds = grid.columnPolicy.getColumnIds();

    for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
        const columnId = columnIds[i];
        const options = grid.columnPolicy.getIndividualColumnOptions(columnId);
        const sourceColumnId = grid.columnPolicy.getColumnSourceId(columnId) ||
            columnId;
        const shouldApplyPathRules = (
            input?.type === 'path' &&
            sourceColumnId === input.pathColumn
        );

        if (!options || (!options.cells?.editMode && !shouldApplyPathRules)) {
            continue;
        }

        const editMode = shouldApplyPathRules ?
            ((options.cells ??= {}).editMode ??= {}) :
            options.cells?.editMode;

        if (!editMode) {
            continue;
        }

        const rules = Array.from(editMode.validationRules || []).filter((
            rule
        ): boolean => (
            rule !== TREE_PATH_RULES.unique &&
            rule !== TREE_PATH_RULES.syntax
        ));

        if (shouldApplyPathRules) {
            const hasUniqueRule = rules.some((rule): boolean => (
                rule === 'unique' ||
                rule === 'ignoreCaseUnique' ||
                (
                    typeof rule !== 'string' &&
                    (
                        rule.validate === 'unique' ||
                        rule.validate === 'ignoreCaseUnique' ||
                        rule.validate === TREE_PATH_RULES.unique
                    )
                )
            ));

            if (!hasUniqueRule) {
                rules.push(TREE_PATH_RULES.unique);
            }

            const hasSyntaxRule = rules.some((rule): boolean => (
                rule === TREE_PATH_RULES.syntax ||
                (
                    typeof rule !== 'string' &&
                    rule.validate === TREE_PATH_RULES.syntax
                )
            ));

            if (!hasSyntaxRule) {
                rules.push(TREE_PATH_RULES.syntax);
            }
        }

        if (rules.length) {
            editMode.validationRules = rules;
        } else {
            delete editMode.validationRules;
        }
    }
}


/* *
 *
 *  Declarations
 *
 * */

declare module '../ColumnTypes/Validator' {
    interface RulesRegistryType {
        treeViewPathSyntax?: RuleDefinition;
        treeViewPathUnique?: RuleDefinition;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    registerTreeViewValidationRules,
    syncTreePathValidationRules
} as const;

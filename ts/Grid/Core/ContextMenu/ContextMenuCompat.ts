/* *
 *
 *  Grid Context Menu deprecated API
 *
 *  Everything here is the pre-3.3.0 cell context menu API, kept working on top
 *  of the current one. It can be dropped whole in the next major.
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *  Authors:
 *  - Mikkel Espolin Birkeland
 *  - Dawid Dragula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../Grid';
import type TableCell from '../Table/Body/TableCell';
import type { CellMenuTarget, MenuContext } from './ContextMenuTarget';
import type { ContextMenuOptions, MenuItemId } from './ContextMenuOptions';
import type { GridIconName } from '../UI/SvgIcons';
import type { ResolvedMenuItem } from './ContextMenuResolver';
import type { RowId } from '../Data/DataProvider';

import { getCellMenuContext } from './ContextMenuTarget.js';
import { isNumber, isString } from '../../../Shared/Utilities.js';
import { registerMenuItem } from './ContextMenuRegistry.js';
import { resolveContextMenu } from './ContextMenuResolver.js';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Runtime context of a cell context menu action.
 */
export interface CellContextMenuContext {

    /**
     * The cell the menu was opened on.
     */
    cell: TableCell;

    /**
     * Grid column id of the cell.
     */
    columnId: string;

    /**
     * The Grid instance.
     */
    grid: Grid;

    /**
     * Id of the row the cell is in.
     */
    rowId?: RowId;

    /**
     * Source column id the Grid column reads its data from.
     */
    sourceColumnId?: string;
}

/**
 * Behavior of one built-in cell context menu action.
 */
export interface BuiltInActionDefinition {

    /**
     * Returns the label of the action.
     */
    getLabel: (context: CellContextMenuContext) => string;

    /**
     * Icon shown next to the label.
     */
    icon: GridIconName;

    /**
     * Returns whether the action is shown but cannot be used.
     */
    isDisabled?: (context: CellContextMenuContext) => boolean;

    /**
     * Returns whether the action applies to the context at all.
     */
    isVisible?: (context: CellContextMenuContext) => boolean;

    /**
     * Runs the action.
     */
    onClick: (context: CellContextMenuContext) => void;
}

/**
 * Behavior of one built-in cell context menu group.
 */
export interface BuiltInGroupDefinition {

    /**
     * Returns the label of the group.
     */
    getLabel?: (context: CellContextMenuContext) => string;

    /**
     * Icon shown next to the label.
     */
    icon?: string;

    /**
     * Returns whether the group applies to the context at all.
     */
    isVisible?: (context: CellContextMenuContext) => boolean;

    /**
     * Ids of the actions the group holds.
     */
    items: MenuItemId[];
}

/**
 * Cell context menu options.
 */
export type CellContextMenuOptions = ContextMenuOptions<CellMenuTarget>;

/**
 * Id of a built-in cell context menu action.
 */
export type CellContextMenuActionId = MenuItemId;

/**
 * Id of a built-in cell context menu group.
 */
export type CellContextMenuGroupId = MenuItemId;

/* *
 *
 *  Functions
 *
 * */

/**
 * Builds the flat context the pre-3.3.0 definitions expect.
 *
 * @param context
 * The current menu context.
 *
 * @return
 * The deprecated context shape.
 */
function legacyContext(
    context: MenuContext<CellMenuTarget>
): CellContextMenuContext {
    const { cell } = context.target;
    const rowId = cell.row.id;

    return {
        cell,
        columnId: cell.column.id,
        grid: context.grid,
        rowId: isString(rowId) || isNumber(rowId) ? rowId : void 0,
        sourceColumnId: context.grid.columnPolicy.getColumnSourceId(
            cell.column.id
        )
    };
}

/**
 * Registers one built-in cell context menu action.
 *
 * @param actionId
 * Built-in action identifier.
 *
 * @param definition
 * Action behavior definition.
 */
export function registerBuiltInAction(
    actionId: CellContextMenuActionId,
    definition: BuiltInActionDefinition
): void {
    const { isDisabled, isVisible } = definition;

    registerMenuItem<CellMenuTarget>(actionId, {
        disabled: isDisabled && ((context): boolean =>
            isDisabled(legacyContext(context))),
        icon: definition.icon,
        label: (context): string => definition.getLabel(legacyContext(context)),
        onClick: (_target, context): void => {
            definition.onClick(legacyContext(context));
        },
        targets: ['cell'],
        visible: isVisible && ((context): boolean =>
            isVisible(legacyContext(context)))
    });
}

/**
 * Registers one built-in cell context menu group.
 *
 * @param groupId
 * Built-in group identifier.
 *
 * @param definition
 * Group definition.
 *
 * @param useByDefault
 * Whether the group should be included in the default menu.
 */
export function registerBuiltInGroup(
    groupId: CellContextMenuGroupId,
    definition: BuiltInGroupDefinition,
    useByDefault: boolean = false
): void {
    const { getLabel, isVisible } = definition;

    registerMenuItem<CellMenuTarget>(groupId, {
        defaultIn: useByDefault ? ['cell'] : void 0,
        icon: definition.icon,
        items: definition.items,
        label: getLabel && ((context): string =>
            getLabel(legacyContext(context))),
        targets: ['cell'],
        visible: isVisible && ((context): boolean =>
            isVisible(legacyContext(context)))
    });
}

/**
 * Resolves the items of a cell context menu.
 *
 * @param cell
 * Table cell the menu opens on.
 *
 * @return
 * Resolved context menu entries.
 */
export function resolveCellContextMenuItems(
    cell: TableCell
): ResolvedMenuItem[] {
    return resolveContextMenu(getCellMenuContext(cell));
}

/* *
 *
 *  Default Export
 *
 * */

/**
 * Built-in cell context menu action helpers.
 */
export default {
    registerBuiltInAction,
    registerBuiltInGroup,
    resolveCellContextMenuItems
} as const;

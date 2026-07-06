/* *
 *
 *  Grid Cell Context Menu built-in actions
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

import type TableCell from '../Body/TableCell';
import type Grid from '../../Grid';
import type { RowId } from '../../Data/DataProvider';
import type {
    CellContextMenuActionId,
    CellContextMenuBuiltInItemOptions,
    CellContextMenuDividerItemOptions,
    CellContextMenuGroupId,
    CellContextMenuItemOptions,
    CellContextMenuTypedDividerItemOptions
} from './CellContextMenuOptions';
import type { GridIconName } from '../../UI/SvgIcons';

import {
    isNumber,
    isString
} from '../../../../Shared/Utilities.js';

/* *
 *
 *  Constants
 *
 * */

const warnedBuiltInIds = new Set<string>();

const builtInActionDefinitions: Partial<Record<
    CellContextMenuActionId,
    BuiltInActionDefinition
>> = {};

const builtInGroupDefinitions: Partial<Record<
    CellContextMenuGroupId,
    BuiltInGroupDefinition
>> = {};

const defaultBuiltInCellContextMenuGroups: CellContextMenuGroupId[] = [];

export interface CellContextMenuContext {
    cell: TableCell;
    columnId: string;
    grid: Grid;
    rowId?: RowId;
    sourceColumnId?: string;
}

export interface ResolvedCellContextMenuActionItemOptions {
    label: string;
    icon?: string;
    disabled?: boolean;
    onClick?: (
        this: TableCell,
        cell: TableCell
    ) => void;
    items?: ResolvedCellContextMenuItemOptions[];
}

export type ResolvedCellContextMenuItemOptions =
    CellContextMenuDividerItemOptions |
    ResolvedCellContextMenuActionItemOptions;

export interface BuiltInActionDefinition {
    getLabel: (context: CellContextMenuContext) => string;
    icon: GridIconName;
    isVisible?: (
        context: CellContextMenuContext
    ) => boolean;
    isDisabled?: (
        context: CellContextMenuContext
    ) => boolean;
    onClick: (context: CellContextMenuContext) => void;
}

export interface BuiltInGroupDefinition {
    getLabel?: (context: CellContextMenuContext) => string;
    icon?: string;
    isVisible?: (context: CellContextMenuContext) => boolean;
    items: CellContextMenuActionId[];
}

/**
 * Registers one built-in context menu action.
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
    if (builtInGroupDefinitions[actionId as CellContextMenuGroupId]) {
        warnBuiltIn(
            actionId,
            `Grid cell context menu: Built-in action id "${actionId}" ` +
            'is already registered as a group id.'
        );
    }

    builtInActionDefinitions[actionId] = definition;
}

/**
 * Registers one built-in context menu group.
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
    if (builtInActionDefinitions[groupId as CellContextMenuActionId]) {
        warnBuiltIn(
            groupId,
            `Grid cell context menu: Built-in group id "${groupId}" ` +
            'is already registered as an action id.'
        );
    }

    builtInGroupDefinitions[groupId] = definition;

    if (
        useByDefault &&
        !defaultBuiltInCellContextMenuGroups.includes(groupId)
    ) {
        defaultBuiltInCellContextMenuGroups.push(groupId);
    }
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Checks whether a context menu item is a divider item.
 *
 * @param item
 * Context menu item declaration.
 *
 * @return
 * True when the item is a divider.
 */
function isDivider(
    item: CellContextMenuItemOptions
): item is (
    CellContextMenuDividerItemOptions |
    CellContextMenuTypedDividerItemOptions
) {
    return (
        typeof item === 'object' &&
        !!item &&
        (
            ('separator' in item && item.separator === true) ||
            ('type' in item && item.type === 'separator')
        )
    );
}

/**
 * Logs a built-in context menu warning once per id.
 *
 * @param id
 * Built-in id.
 *
 * @param message
 * Warning message.
 */
function warnBuiltIn(id: string, message: string): void {
    if (warnedBuiltInIds.has(id)) {
        return;
    }
    warnedBuiltInIds.add(id);

    // eslint-disable-next-line no-console
    console.warn(message);
}

/**
 * Creates the runtime context passed to built-in actions and groups.
 *
 * @param cell
 * Table cell for the context menu.
 *
 * @return
 * Context menu runtime context.
 */
function getContext(cell: TableCell): CellContextMenuContext {
    const { grid } = cell.row.viewport;
    const rowId = cell.row.id;

    return {
        cell,
        columnId: cell.column.id,
        grid,
        rowId: isString(rowId) || isNumber(rowId) ? rowId : void 0,
        sourceColumnId: grid.columnPolicy.getColumnSourceId(cell.column.id)
    };
}

/**
 * Resolves one built-in action declaration into a regular action item.
 *
 * @param actionId
 * Built-in action id.
 *
 * @param context
 * Runtime context for built-ins.
 *
 * @param override
 * Optional label/icon/disabled overrides.
 *
 * @return
 * Resolved action item or undefined for unknown action ids.
 */
function resolveBuiltInAction(
    actionId: string,
    context: CellContextMenuContext,
    override?: CellContextMenuBuiltInItemOptions
): (ResolvedCellContextMenuActionItemOptions|undefined) {
    const definition =
        builtInActionDefinitions[actionId as CellContextMenuActionId];

    if (!definition) {
        warnBuiltIn(
            actionId,
            'Grid cell context menu: Unknown built-in action or group id ' +
            `"${actionId}".`
        );
        return;
    }

    if (definition.isVisible && !definition.isVisible(context)) {
        return;
    }

    return {
        label: override?.label || definition.getLabel(context),
        icon: override?.icon || definition.icon,
        disabled: !!definition.isDisabled?.(context) || !!override?.disabled,
        onClick: (): void => {
            definition.onClick(context);
        }
    };
}

/**
 * Resolves a built-in group into inline action items.
 *
 * @param groupId
 * Built-in group id.
 *
 * @param context
 * Runtime context for built-ins.
 *
 * @return
 * Resolved group items when the group exists.
 */
function resolveBuiltInGroupItems(
    groupId: string,
    context: CellContextMenuContext
): ResolvedCellContextMenuActionItemOptions[] | undefined {
    const definition =
        builtInGroupDefinitions[groupId as CellContextMenuGroupId];

    if (!definition) {
        return;
    }

    if (definition.isVisible && !definition.isVisible(context)) {
        return [];
    }

    const items: ResolvedCellContextMenuActionItemOptions[] = [];

    for (const actionId of definition.items) {
        const item = resolveBuiltInAction(actionId, context);
        if (item) {
            items.push(item);
        }
    }

    return items;
}

/**
 * Resolves default built-in groups. A single active group is shown inline,
 * while multiple groups are shown as submenus.
 *
 * @param context
 * Runtime context for built-ins.
 *
 * @return
 * Resolved default context menu items.
 */
function resolveDefaultCellContextMenuItems(
    context: CellContextMenuContext
): ResolvedCellContextMenuItemOptions[] {
    const groups: Array<{
        definition: BuiltInGroupDefinition;
        groupId: CellContextMenuGroupId;
        items: ResolvedCellContextMenuActionItemOptions[];
    }> = [];

    for (const groupId of defaultBuiltInCellContextMenuGroups) {
        const definition = builtInGroupDefinitions[groupId];
        const items = resolveBuiltInGroupItems(groupId, context);

        if (definition && items?.length) {
            groups.push({
                definition,
                groupId,
                items
            });
        }
    }

    if (groups.length === 1) {
        return groups[0].items;
    }

    return groups.map((group): ResolvedCellContextMenuActionItemOptions => ({
        label: group.definition.getLabel?.(context) || group.groupId,
        icon: group.definition.icon,
        items: group.items
    }));
}

/**
 * Resolves raw item declarations recursively.
 *
 * @param context
 * Runtime context for built-ins.
 *
 * @param rawItems
 * Source item declarations.
 *
 * @return
 * Resolved context menu items.
 */
function resolveCellContextMenuItemsAtLevel(
    context: CellContextMenuContext,
    rawItems: CellContextMenuItemOptions[]
): ResolvedCellContextMenuItemOptions[] {
    if (!rawItems.length) {
        return [];
    }

    const resolved: ResolvedCellContextMenuItemOptions[] = [];

    for (const rawItem of rawItems) {
        if (isDivider(rawItem)) {
            resolved.push({
                separator: true,
                label: rawItem.label
            });
            continue;
        }

        if (typeof rawItem === 'string') {
            const groupItems = resolveBuiltInGroupItems(rawItem, context);
            if (groupItems) {
                resolved.push(...groupItems);
                continue;
            }

            const builtInItem = resolveBuiltInAction(rawItem, context);
            if (builtInItem) {
                resolved.push(builtInItem);
            }
            continue;
        }

        if (rawItem.type === 'submenu') {
            const childItems = resolveCellContextMenuItemsAtLevel(
                context,
                rawItem.items
            );

            if (childItems.length) {
                resolved.push({
                    label: rawItem.label,
                    icon: rawItem.icon,
                    disabled: rawItem.disabled,
                    items: childItems
                });
            }
            continue;
        }

        if ('actionId' in rawItem) {
            const builtInItem = resolveBuiltInAction(
                rawItem.actionId,
                context,
                rawItem
            );
            if (builtInItem) {
                resolved.push(builtInItem);
            }
            continue;
        }

        if ('groupId' in rawItem) {
            const groupItems = resolveBuiltInGroupItems(
                rawItem.groupId,
                context
            );

            if (groupItems) {
                resolved.push(...groupItems);
            } else {
                warnBuiltIn(
                    rawItem.groupId,
                    'Grid cell context menu: Unknown built-in action or ' +
                    `group id "${rawItem.groupId}".`
                );
            }
            continue;
        }

        const customItem: ResolvedCellContextMenuActionItemOptions = {
            label: rawItem.label,
            icon: rawItem.icon,
            disabled: rawItem.disabled,
            onClick: rawItem.onClick
        };

        resolved.push(customItem);
    }

    return resolved;
}

/**
 * Resolves context menu items, including built-in action declarations.
 *
 * @param cell
 * Table cell for the context menu.
 *
 * @return
 * Resolved context menu items.
 */
export function resolveCellContextMenuItems(
    cell: TableCell
): ResolvedCellContextMenuItemOptions[] {
    const options = cell.column?.options.cells?.contextMenu;

    if (options?.enabled === false) {
        return [];
    }

    const context = getContext(cell);
    const items = options?.items !== void 0 ?
        resolveCellContextMenuItemsAtLevel(context, options.items) :
        resolveDefaultCellContextMenuItems(context);

    if (
        !items.length ||
        options?.enabled === true ||
        options?.items !== void 0
    ) {
        return items;
    }

    return items.some((item): boolean =>
        !('separator' in item) && !item.disabled
    ) ? items : [];
}

/* *
 *
 *  Default export
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

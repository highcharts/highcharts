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

import type TableCell from './TableCell';
import type Grid from '../../Grid';
import type { RowId } from '../../Data/DataProvider';
import type {
    CellContextMenuActionId,
    CellContextMenuActionItemOptions,
    CellContextMenuBuiltInItemOptions,
    CellContextMenuBuiltInGroupItemOptions,
    CellContextMenuDividerItemOptions,
    CellContextMenuGroupId,
    CellContextMenuItemOptions,
    CellContextMenuSubmenuItemOptions,
    CellContextMenuTypedDividerItemOptions
} from '../../Options';
import type { GridIconName } from '../../UI/SvgIcons';

import {
    isArray,
    isNumber,
    isObject,
    isString
} from '../../../../Shared/Utilities.js';

/* *
 *
 *  Constants
 *
 * */

const warnedBuiltInIds = new Set<string>();

export const defaultBuiltInCellContextMenuActions: CellContextMenuActionId[] =
    [];

const builtInActionDefinitions: Partial<Record<
    CellContextMenuActionId,
    BuiltInActionDefinition
>> = {};

const builtInGroupDefinitions: Partial<Record<
    CellContextMenuGroupId,
    BuiltInGroupDefinition
>> = {};

const builtInGroupOrder: CellContextMenuGroupId[] = [];

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

type CellContextMenuBranchItemOptions = (
    CellContextMenuActionItemOptions |
    CellContextMenuBuiltInItemOptions |
    CellContextMenuSubmenuItemOptions
) & {
    items: CellContextMenuItemOptions[];
};

interface ResolvedBuiltInGroup {
    definition: BuiltInGroupDefinition;
    items: ResolvedCellContextMenuActionItemOptions[];
}

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
    getLabel: (context: CellContextMenuContext) => string;
    icon?: GridIconName;
    isActive: (context: CellContextMenuContext) => boolean;
    items: CellContextMenuActionId[];
    order?: number;
}

/**
 * Registers one built-in context menu action.
 *
 * @param actionId
 * Built-in action identifier.
 *
 * @param definition
 * Action behavior definition.
 *
 * @param useByDefault
 * Whether the action should be added to the default menu set.
 */
export function registerBuiltInAction(
    actionId: CellContextMenuActionId,
    definition: BuiltInActionDefinition,
    useByDefault: boolean = false
): void {
    if (builtInGroupDefinitions[actionId as CellContextMenuGroupId]) {
        warnBuiltIn(
            actionId,
            `Grid cell context menu: Built-in action id "${actionId}" ` +
            'is already registered as a group id.'
        );
    }

    builtInActionDefinitions[actionId] = definition;

    if (
        useByDefault &&
        !defaultBuiltInCellContextMenuActions.includes(actionId)
    ) {
        defaultBuiltInCellContextMenuActions.push(actionId);
    }
}

/**
 * Registers one built-in context menu group.
 *
 * @param groupId
 * Built-in group identifier.
 *
 * @param definition
 * Group definition.
 */
export function registerBuiltInGroup(
    groupId: CellContextMenuGroupId,
    definition: BuiltInGroupDefinition
): void {
    if (builtInActionDefinitions[groupId as CellContextMenuActionId]) {
        warnBuiltIn(
            groupId,
            `Grid cell context menu: Built-in group id "${groupId}" ` +
            'is already registered as an action id.'
        );
    }

    if (!builtInGroupDefinitions[groupId]) {
        builtInGroupOrder.push(groupId);
    }

    builtInGroupDefinitions[groupId] = definition;
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
 * Checks whether an item is a built-in override declaration.
 *
 * @param item
 * Context menu item declaration.
 *
 * @return
 * True when the item is a built-in override.
 */
function isBuiltInOverride(
    item: CellContextMenuItemOptions
): item is CellContextMenuBuiltInItemOptions {
    return (
        typeof item === 'object' &&
        !!item &&
        'actionId' in item
    );
}

/**
 * Checks whether an item is a built-in group declaration.
 *
 * @param item
 * Context menu item declaration.
 *
 * @return
 * True when the item is a built-in group declaration.
 */
function isBuiltInGroupItem(
    item: CellContextMenuItemOptions
): item is CellContextMenuBuiltInGroupItemOptions {
    return (
        typeof item === 'object' &&
        !!item &&
        'groupId' in item
    );
}

/**
 * Checks whether an item contains nested submenu items.
 *
 * @param item
 * Context menu item declaration.
 *
 * @return
 * True when submenu items are provided.
 */
function hasNestedItems(
    item: CellContextMenuItemOptions
): item is CellContextMenuBranchItemOptions {
    return (
        isObject(item, true) &&
        'items' in item &&
        isArray(item.items)
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
 * Logs unknown built-in action or group ids once per id.
 *
 * @param id
 * Unknown action or group id.
 */
function warnUnknownBuiltInId(id: string): void {
    warnBuiltIn(
        id,
        `Grid cell context menu: Unknown built-in action or group id "${id}".`
    );
}

/**
 * Returns the current row id if available.
 *
 * @param cell
 * Table cell for the context menu.
 *
 * @return
 * Row id when available.
 */
function getCurrentRowId(cell: TableCell): (string|number|undefined) {
    const rowId = cell.row.id;
    if (isString(rowId) || isNumber(rowId)) {
        return rowId;
    }
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

    return {
        cell,
        columnId: cell.column.id,
        grid,
        rowId: getCurrentRowId(cell),
        sourceColumnId: grid.columnPolicy.getColumnSourceId(cell.column.id)
    };
}

/**
 * Returns the built-in action definition for a given action ID.
 *
 * @param actionId
 * Built-in action id.
 *
 * @return
 * Built-in action definition when known.
 */
function getBuiltInActionDefinition(
    actionId: string
): BuiltInActionDefinition | undefined {
    const definition =
        builtInActionDefinitions[actionId as CellContextMenuActionId];

    if (definition) {
        return definition;
    }

    warnUnknownBuiltInId(actionId);
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
 * @param isBranch
 * Whether this item should be treated as a branch item.
 *
 * @return
 * Resolved action item or undefined for unknown action ids.
 */
function resolveBuiltInAction(
    actionId: string,
    context: CellContextMenuContext,
    override?: CellContextMenuBuiltInItemOptions,
    isBranch?: boolean
): (ResolvedCellContextMenuActionItemOptions|undefined) {
    const definition = getBuiltInActionDefinition(actionId);
    if (!definition) {
        return;
    }

    if (definition.isVisible && !definition.isVisible(context)) {
        return;
    }

    const disabled = isBranch ?
        !!override?.disabled :
        !!definition.isDisabled?.(context) || !!override?.disabled;

    return {
        label: override?.label || definition.getLabel(context),
        icon: override?.icon || definition.icon,
        disabled,
        onClick: isBranch ?
            void 0 :
            (): void => {
                definition.onClick(context);
            }
    };
}

/**
 * Resolves ordered built-in action ids into regular action items.
 *
 * @param actionIds
 * Built-in action ids to resolve.
 *
 * @param context
 * Runtime context for built-ins.
 *
 * @param skipIds
 * Optional action ids that should not be resolved.
 *
 * @return
 * Resolved action items.
 */
function resolveBuiltInActions(
    actionIds: CellContextMenuActionId[],
    context: CellContextMenuContext,
    skipIds?: Set<CellContextMenuActionId>
): ResolvedCellContextMenuActionItemOptions[] {
    const items: ResolvedCellContextMenuActionItemOptions[] = [];

    for (const actionId of actionIds) {
        if (skipIds?.has(actionId)) {
            continue;
        }

        const item = resolveBuiltInAction(actionId, context);
        if (item) {
            items.push(item);
        }
    }

    return items;
}

/**
 * Checks whether a built-in group id is registered.
 *
 * @param groupId
 * Group id candidate.
 *
 * @return
 * True if the group is registered.
 */
function isRegisteredGroup(groupId: string): boolean {
    return builtInGroupDefinitions[groupId as CellContextMenuGroupId] !==
        void 0;
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
 * @param warnUnknown
 * Whether to warn when the group id is unknown.
 *
 * @return
 * Resolved group items when active.
 */
function resolveBuiltInGroupItems(
    groupId: string,
    context: CellContextMenuContext,
    warnUnknown: boolean = true
): ResolvedCellContextMenuActionItemOptions[] | undefined {
    const definition =
        builtInGroupDefinitions[groupId as CellContextMenuGroupId];

    if (!definition) {
        if (warnUnknown) {
            warnUnknownBuiltInId(groupId);
        }
        return;
    }

    if (!definition.isActive(context)) {
        return [];
    }

    return resolveBuiltInActions(definition.items, context);
}

/**
 * Resolves active built-in groups for default menu rendering.
 *
 * @param context
 * Runtime context for built-ins.
 *
 * @return
 * Active groups with visible items.
 */
function getResolvedActiveGroups(
    context: CellContextMenuContext
): ResolvedBuiltInGroup[] {
    const activeGroups: Array<{
        definition: BuiltInGroupDefinition;
        index: number;
    }> = [];

    for (let i = 0, iEnd = builtInGroupOrder.length; i < iEnd; ++i) {
        const groupId = builtInGroupOrder[i];
        const definition = builtInGroupDefinitions[groupId];

        if (definition?.isActive(context)) {
            activeGroups.push({
                definition,
                index: i
            });
        }
    }

    activeGroups.sort((a, b): number =>
        (a.definition.order ?? a.index) -
        (b.definition.order ?? b.index)
    );

    const resolvedGroups: ResolvedBuiltInGroup[] = [];

    for (const { definition } of activeGroups) {
        const items = resolveBuiltInActions(definition.items, context);
        if (items.length) {
            resolvedGroups.push({ definition, items });
        }
    }

    return resolvedGroups;
}

/**
 * Builds the default context menu from active built-in groups and legacy
 * top-level defaults.
 *
 * @param context
 * Runtime context for built-ins.
 *
 * @return
 * Default resolved context menu items.
 */
function buildDefaultCellContextMenuItems(
    context: CellContextMenuContext
): ResolvedCellContextMenuItemOptions[] {
    const groups = getResolvedActiveGroups(context);
    const groupedActionIds = new Set<CellContextMenuActionId>();

    for (const { definition } of groups) {
        for (const actionId of definition.items) {
            groupedActionIds.add(actionId);
        }
    }

    const legacyItems = resolveBuiltInActions(
        defaultBuiltInCellContextMenuActions,
        context,
        groupedActionIds
    );

    if (!groups.length) {
        return legacyItems;
    }

    if (groups.length === 1) {
        return [
            ...groups[0].items,
            ...legacyItems
        ];
    }

    return [
        ...groups.map(
            ({ definition, items }): ResolvedCellContextMenuActionItemOptions =>
                ({
                    label: definition.getLabel(context),
                    icon: definition.icon,
                    disabled: items.every((item): boolean => !!item.disabled),
                    items
                })
        ),
        ...legacyItems
    ];
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
 * @param useDefaults
 * Whether omitted items should resolve to top-level defaults.
 *
 * @return
 * Resolved context menu items.
 */
function resolveCellContextMenuItemsAtLevel(
    context: CellContextMenuContext,
    rawItems: CellContextMenuItemOptions[] | undefined,
    useDefaults: boolean
): ResolvedCellContextMenuItemOptions[] {
    if (rawItems === void 0) {
        return useDefaults ? buildDefaultCellContextMenuItems(context) : [];
    }

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

        const isBranchCandidate = hasNestedItems(rawItem);
        const childItems = isBranchCandidate ?
            resolveCellContextMenuItemsAtLevel(
                context,
                rawItem.items,
                false
            ) :
            [];
        const isBranch = childItems.length > 0;

        if (typeof rawItem === 'string') {
            if (isRegisteredGroup(rawItem)) {
                const groupItems = resolveBuiltInGroupItems(
                    rawItem,
                    context,
                    false
                );

                if (groupItems?.length) {
                    resolved.push(...groupItems);
                }
                continue;
            }

            const builtInItem = resolveBuiltInAction(rawItem, context);
            if (builtInItem) {
                resolved.push(builtInItem);
            }
            continue;
        }

        if (isBuiltInOverride(rawItem)) {
            const builtInItem = resolveBuiltInAction(
                rawItem.actionId,
                context,
                rawItem,
                isBranch
            );
            if (builtInItem) {
                if (isBranch) {
                    builtInItem.items = childItems;
                }
                resolved.push(builtInItem);
            }
            continue;
        }

        if (isBuiltInGroupItem(rawItem)) {
            const groupItems = resolveBuiltInGroupItems(
                rawItem.groupId,
                context
            );

            if (groupItems?.length) {
                resolved.push(...groupItems);
            }
            continue;
        }

        const onClick = rawItem.type === 'submenu' ?
            void 0 :
            rawItem.onClick;

        const customItem: ResolvedCellContextMenuActionItemOptions = {
            label: rawItem.label,
            icon: rawItem.icon,
            disabled: rawItem.disabled,
            onClick: isBranch ? void 0 : onClick,
            items: isBranch ? childItems : void 0
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
    const items = resolveCellContextMenuItemsAtLevel(
        context,
        options?.items,
        true
    );

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
    defaultBuiltInCellContextMenuActions,
    registerBuiltInAction,
    registerBuiltInGroup,
    resolveCellContextMenuItems
} as const;

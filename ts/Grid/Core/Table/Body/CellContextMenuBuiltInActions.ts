/* *
 *
 *  Grid Cell Context Menu built-in actions
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Authors:
 *  - Mikkel Espolin Birkeland
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type TableCell from './TableCell';
import type {
    CellContextMenuActionId,
    CellContextMenuActionItemOptions,
    CellContextMenuBuiltInItemOptions,
    CellContextMenuDividerItemOptions,
    CellContextMenuGroupId,
    CellContextMenuItemOptions
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

const warnedUnknownActionIds = new Set<string>();

/**
 * @deprecated
 * Kept for backwards compatibility. Built-in defaults are now driven by
 * registered groups (see `registerBuiltInGroup`). The `useByDefault` flag
 * on `registerBuiltInAction` still pushes into this array, but the array
 * is no longer consulted by the default resolver.
 */
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
    CellContextMenuBuiltInItemOptions
) & {
    items: CellContextMenuItemOptions[];
};

export interface BuiltInActionDefinition {
    getLabel: (cell: TableCell) => string;
    icon: GridIconName;
    isVisible?: (
        cell: TableCell,
        rowId: string|number|undefined
    ) => boolean;
    isDisabled: (
        cell: TableCell,
        rowId: string|number|undefined
    ) => boolean;
    onClick: (cell: TableCell, rowId: string|number) => void;
}

/**
 * Definition of a built-in context menu group. A group bundles a set of
 * built-in action ids under a single key and activation predicate, so
 * features can contribute a cohesive section to the default menu.
 */
export interface BuiltInGroupDefinition {
    /**
     * Resolves the group's submenu header label at render time.
     * Used when the group renders as a submenu section in the default menu.
     */
    getLabel: (cell: TableCell) => string;

    /**
     * Optional icon shown on the submenu header.
     */
    icon?: GridIconName;

    /**
     * Ordered built-in action ids that make up this group. The order
     * determines the rendering order of items inside the group submenu
     * (or inline when the group is the only active group or when a user
     * references the group id in a custom `items` array).
     */
    items: CellContextMenuActionId[];

    /**
     * Predicate that gates whether the group is active for the given cell.
     * Only active groups participate in the default menu, and a group
     * referenced by id in a user-provided `items` array only expands when
     * this predicate returns true.
     */
    isActive: (
        cell: TableCell,
        rowId: string|number|undefined
    ) => boolean;
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
 * Legacy flag. When `true`, pushes the action id onto the deprecated
 * `defaultBuiltInCellContextMenuActions` array.
 *
 * @deprecated Kept for backwards compatibility only. The default menu is
 * now driven by groups registered via `registerBuiltInGroup` — setting
 * this flag no longer surfaces the action in the default menu.
 * Contribute via a group instead.
 */
export function registerBuiltInAction(
    actionId: CellContextMenuActionId,
    definition: BuiltInActionDefinition,
    useByDefault: boolean = false
): void {
    builtInActionDefinitions[actionId] = definition;

    if (
        useByDefault &&
        !defaultBuiltInCellContextMenuActions.includes(actionId)
    ) {
        defaultBuiltInCellContextMenuActions.push(actionId);
    }
}

/**
 * Registers a built-in context menu group.
 *
 * Groups are activated per-cell via their `isActive` predicate. When the
 * user has not provided a custom `items` array, every active group
 * contributes to the default menu:
 *  - when exactly one group is active, its items render inline (flat);
 *  - when two or more groups are active, each group renders as a submenu
 *    section with the group's label and icon.
 *
 * Groups can also be referenced by id inside a user-provided `items`
 * array; in that case they are always expanded inline and are filtered
 * by the same `isActive` predicate.
 *
 * @param groupId
 * Built-in group identifier.
 *
 * @param definition
 * Group definition (label, icon, items, activation predicate).
 */
export function registerBuiltInGroup(
    groupId: CellContextMenuGroupId,
    definition: BuiltInGroupDefinition
): void {
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
): item is CellContextMenuDividerItemOptions {
    return (
        typeof item === 'object' &&
        !!item &&
        'separator' in item &&
        item.separator === true
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
 * Logs unknown built-in action or group ids once per id.
 *
 * @param id
 * Unknown action or group id.
 */
function warnUnknownBuiltInAction(id: string): void {
    if (warnedUnknownActionIds.has(id)) {
        return;
    }
    warnedUnknownActionIds.add(id);

    // eslint-disable-next-line no-console
    console.warn(
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

    warnUnknownBuiltInAction(actionId);
}

/**
 * Resolves one built-in action declaration into a regular action item.
 *
 * @param actionId
 * Built-in action id.
 *
 * @param cell
 * Table cell for the context menu.
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
    cell: TableCell,
    override?: CellContextMenuBuiltInItemOptions,
    isBranch?: boolean
): (ResolvedCellContextMenuActionItemOptions|undefined) {
    const definition = getBuiltInActionDefinition(actionId);
    if (!definition) {
        return;
    }

    const rowId = getCurrentRowId(cell);
    if (definition.isVisible && !definition.isVisible(cell, rowId)) {
        return;
    }

    const disabled = isBranch ?
        !!override?.disabled :
        definition.isDisabled(cell, rowId) || !!override?.disabled;

    return {
        label: override?.label || definition.getLabel(cell),
        icon: override?.icon || definition.icon,
        disabled,
        onClick: isBranch ?
            void 0 :
            (): void => {
                if (rowId === void 0) {
                    return;
                }

                definition.onClick(cell, rowId);
            }
    };
}

/**
 * Whether the given id has a registered built-in group.
 *
 * @param id
 * Candidate group id.
 *
 * @return
 * True when a group with this id is registered.
 */
function isRegisteredGroup(id: string): boolean {
    return builtInGroupDefinitions[id as CellContextMenuGroupId] !== void 0;
}

/**
 * Resolves an active group's items into resolved action items for inline
 * rendering. Returns `undefined` when the group is unknown or its
 * activation predicate returns false for the given cell.
 *
 * @param groupId
 * Built-in group id.
 *
 * @param cell
 * Table cell for the context menu.
 *
 * @return
 * Resolved action items for an active group, otherwise `undefined`.
 */
function resolveActiveGroupItems(
    groupId: string,
    cell: TableCell
): ResolvedCellContextMenuActionItemOptions[] | undefined {
    const group =
        builtInGroupDefinitions[groupId as CellContextMenuGroupId];

    if (!group) {
        return;
    }

    const rowId = getCurrentRowId(cell);
    if (!group.isActive(cell, rowId)) {
        return;
    }

    const items: ResolvedCellContextMenuActionItemOptions[] = [];
    for (const actionId of group.items) {
        const resolved = resolveBuiltInAction(actionId, cell);
        if (resolved) {
            items.push(resolved);
        }
    }
    return items;
}

/**
 * Enumerates groups whose activation predicate passes for the given cell,
 * preserving registration order.
 *
 * @param cell
 * Table cell for the context menu.
 *
 * @return
 * Array of active group descriptors in registration order.
 */
function getActiveGroupsForCell(
    cell: TableCell
): Array<{ id: CellContextMenuGroupId; def: BuiltInGroupDefinition; }> {
    const rowId = getCurrentRowId(cell);
    const active: Array<{
        id: CellContextMenuGroupId;
        def: BuiltInGroupDefinition;
    }> = [];

    for (const id of builtInGroupOrder) {
        const def = builtInGroupDefinitions[id];
        if (def && def.isActive(cell, rowId)) {
            active.push({ id, def });
        }
    }

    return active;
}

/**
 * Builds the default context menu items from active groups.
 *
 * When no groups are active, returns an empty array.
 * When exactly one group is active, returns its items inline (flat).
 * When two or more groups are active, each group becomes a submenu
 * branch whose label and icon come from the group registration.
 *
 * @param cell
 * Table cell for the context menu.
 *
 * @return
 * Default resolved context menu items.
 */
function buildDefaultCellContextMenuItems(
    cell: TableCell
): ResolvedCellContextMenuItemOptions[] {
    const active = getActiveGroupsForCell(cell);

    if (active.length === 0) {
        return [];
    }

    if (active.length === 1) {
        const items: ResolvedCellContextMenuItemOptions[] = [];
        for (const actionId of active[0].def.items) {
            const resolved = resolveBuiltInAction(actionId, cell);
            if (resolved) {
                items.push(resolved);
            }
        }
        return items;
    }

    const branches: ResolvedCellContextMenuItemOptions[] = [];
    for (const { def } of active) {
        const groupItems: ResolvedCellContextMenuActionItemOptions[] = [];
        for (const actionId of def.items) {
            const resolved = resolveBuiltInAction(actionId, cell);
            if (resolved) {
                groupItems.push(resolved);
            }
        }

        if (!groupItems.length) {
            continue;
        }

        const allDisabled = groupItems.every((i): boolean => !!i.disabled);

        branches.push({
            label: def.getLabel(cell),
            icon: def.icon,
            disabled: allDisabled,
            onClick: void 0,
            items: groupItems
        });
    }

    return branches;
}

/**
 * Resolves raw item declarations recursively.
 *
 * @param cell
 * Table cell for the context menu.
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
    cell: TableCell,
    rawItems: CellContextMenuItemOptions[] | undefined,
    useDefaults: boolean
): ResolvedCellContextMenuItemOptions[] {
    if (rawItems === void 0) {
        return useDefaults ? buildDefaultCellContextMenuItems(cell) : [];
    }

    if (!rawItems.length) {
        return [];
    }

    const resolved: ResolvedCellContextMenuItemOptions[] = [];

    for (const rawItem of rawItems) {
        if (isDivider(rawItem)) {
            resolved.push(rawItem);
            continue;
        }

        const isBranchCandidate = hasNestedItems(rawItem);
        const childItems = isBranchCandidate ?
            resolveCellContextMenuItemsAtLevel(cell, rawItem.items, false) :
            [];
        const isBranch = childItems.length > 0;

        if (typeof rawItem === 'string') {
            // Group ids take precedence over action ids. A registered
            // group that is currently inactive contributes nothing and
            // does NOT fall through to action-id resolution (which would
            // otherwise produce a misleading "unknown id" warning).
            if (isRegisteredGroup(rawItem)) {
                const groupItems = resolveActiveGroupItems(rawItem, cell);
                if (groupItems) {
                    for (const groupItem of groupItems) {
                        resolved.push(groupItem);
                    }
                }
                continue;
            }

            const builtInItem = resolveBuiltInAction(rawItem, cell);
            if (builtInItem) {
                resolved.push(builtInItem);
            }
            continue;
        }

        if (isBuiltInOverride(rawItem)) {
            const builtInItem = resolveBuiltInAction(
                rawItem.actionId,
                cell,
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

        const customItem: ResolvedCellContextMenuActionItemOptions = {
            label: rawItem.label,
            icon: rawItem.icon,
            disabled: rawItem.disabled,
            onClick: isBranch ? void 0 : rawItem.onClick,
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

    const items = resolveCellContextMenuItemsAtLevel(
        cell,
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

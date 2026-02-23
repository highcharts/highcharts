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
    CellContextMenuItemOptions
} from '../../Options';
import type { GridIconName } from '../../UI/SvgIcons';

/* *
 *
 *  Constants
 *
 * */

const warnedUnknownActionIds = new Set<string>();

export const defaultBuiltInCellContextMenuActions: CellContextMenuActionId[] = [
    'pinRowTop',
    'pinRowBottom',
    'unpinRow'
];

export interface ResolvedCellContextMenuActionItemOptions {
    label: string;
    icon?: GridIconName;
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
): item is (
    CellContextMenuActionItemOptions |
    CellContextMenuBuiltInItemOptions
) & {
    items: CellContextMenuItemOptions[];
} {
    return (
        typeof item === 'object' &&
        !!item &&
        'items' in item &&
        Array.isArray(item.items)
    );
}

/**
 * Logs unknown built-in action ids once per id.
 *
 * @param actionId
 * Unknown action id.
 */
function warnUnknownBuiltInAction(actionId: string): void {
    if (warnedUnknownActionIds.has(actionId)) {
        return;
    }
    warnedUnknownActionIds.add(actionId);

    // eslint-disable-next-line no-console
    console.warn(
        `Grid cell context menu: Unknown built-in actionId "${actionId}".`
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
    if (typeof rowId === 'string' || typeof rowId === 'number') {
        return rowId;
    }
}

/**
 * Returns whether row pinning option is enabled.
 *
 * @param cell
 * Table cell for the context menu.
 *
 * @return
 * True when row pinning option is enabled.
 */
function isPinningOptionEnabled(cell: TableCell): boolean {
    const rowPinning = (cell.row.viewport.grid as {
        rowPinning?: { isOptionEnabled?: () => boolean };
    }).rowPinning;

    return rowPinning?.isOptionEnabled?.() !== false;
}

/**
 * Returns whether row pinning was explicitly configured by the user.
 *
 * @param cell
 * Table cell for the context menu.
 *
 * @return
 * True when row pinning exists in user options and is not disabled.
 */
function isPinningExplicitlyConfigured(cell: TableCell): boolean {
    const userPinning = cell.row.viewport.grid.userOptions
        ?.rendering
        ?.rows
        ?.pinning;

    return !!(userPinning && userPinning.enabled !== false);
}

/**
 * Returns whether the context menu should be enabled for a cell.
 *
 * @param cell
 * Table cell for the context menu.
 *
 * @return
 * True when the context menu is effectively enabled.
 */
function isContextMenuEnabled(cell: TableCell): boolean {
    const options = cell.column?.options.cells?.contextMenu;

    if (options?.enabled === false) {
        return false;
    }

    if (options?.enabled === true) {
        return true;
    }

    if (options?.items !== void 0) {
        return true;
    }

    return isPinningExplicitlyConfigured(cell);
}

/**
 * Resolves the default built-in action label.
 *
 * @param cell
 * Table cell for the context menu.
 *
 * @param actionId
 * Built-in action id.
 *
 * @return
 * Built-in label.
 */
function getBuiltInLabel(
    cell: TableCell,
    actionId: CellContextMenuActionId
): string {
    const lang = cell.row.viewport.grid.options?.lang;
    switch (actionId) {
        case 'pinRowTop':
            return lang?.pinRowTop || 'Pin row to top';
        case 'pinRowBottom':
            return lang?.pinRowBottom || 'Pin row to bottom';
        case 'unpinRow':
            return lang?.unpinRow || 'Unpin row';
    }
}

/**
 * Resolves the default built-in action icon.
 *
 * @param actionId
 * Built-in action id.
 *
 * @return
 * Built-in icon id.
 */
function getBuiltInIcon(
    actionId: CellContextMenuActionId
): GridIconName {
    switch (actionId) {
        case 'pinRowTop':
        case 'pinRowBottom':
            return 'pin01';
        case 'unpinRow':
            return 'pin02';
    }
}

/**
 * Returns disabled state for a built-in action based on row pinning state.
 *
 * @param actionId
 * Built-in action id.
 *
 * @param cell
 * Table cell for the context menu.
 *
 * @param rowId
 * Current row id.
 *
 * @return
 * True when the action should be disabled.
 */
function isPinnedStateDisabled(
    actionId: CellContextMenuActionId,
    cell: TableCell,
    rowId: string|number|undefined
): boolean {
    if (rowId === void 0 || !isPinningOptionEnabled(cell)) {
        return true;
    }

    const pinned = cell.row.viewport.grid.getPinnedRows?.() || {
        topIds: [],
        bottomIds: []
    };
    const inTop = pinned.topIds.includes(rowId);
    const inBottom = pinned.bottomIds.includes(rowId);

    if (actionId === 'pinRowTop') {
        return inTop;
    }
    if (actionId === 'pinRowBottom') {
        return inBottom;
    }

    return !inTop && !inBottom;
}

/**
 * Returns the click handler for a built-in row pinning action.
 *
 * @param actionId
 * Built-in action id.
 *
 * @param cell
 * Table cell for the context menu.
 *
 * @return
 * Click callback for the built-in action.
 */
function getBuiltInActionClick(
    actionId: CellContextMenuActionId,
    cell: TableCell
): (() => void) {
    return (): void => {
        const rowId = getCurrentRowId(cell);
        if (rowId === void 0) {
            return;
        }

        const grid = cell.row.viewport.grid;
        if (actionId === 'pinRowTop') {
            void grid.pinRow(rowId, 'top');
            return;
        }
        if (actionId === 'pinRowBottom') {
            void grid.pinRow(rowId, 'bottom');
            return;
        }

        void grid.unpinRow(rowId);
    };
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
    if (
        actionId !== 'pinRowTop' &&
        actionId !== 'pinRowBottom' &&
        actionId !== 'unpinRow'
    ) {
        warnUnknownBuiltInAction(actionId);
        return;
    }

    const rowId = getCurrentRowId(cell);
    const disabled = isBranch ?
        !!override?.disabled :
        isPinnedStateDisabled(actionId, cell, rowId) || !!override?.disabled;

    return {
        label: override?.label || getBuiltInLabel(cell, actionId),
        icon: override?.icon || getBuiltInIcon(actionId),
        disabled,
        onClick: isBranch ?
            void 0 :
            function (): void {
                getBuiltInActionClick(actionId, cell)();
            }
    };
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
    const sourceItems = rawItems === void 0 ?
        (useDefaults ? defaultBuiltInCellContextMenuActions : []) :
        rawItems;

    if (!sourceItems.length) {
        return [];
    }

    const resolved: ResolvedCellContextMenuItemOptions[] = [];

    for (const rawItem of sourceItems) {
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
    if (!isContextMenuEnabled(cell)) {
        return [];
    }

    const options = cell.column?.options.cells?.contextMenu;
    return resolveCellContextMenuItemsAtLevel(cell, options?.items, true);
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
    resolveCellContextMenuItems
} as const;

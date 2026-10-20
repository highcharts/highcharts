/* *
 *
 *  Grid Context Menu item registry
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

import type {
    MenuItemDefinition,
    MenuItemId
} from './ContextMenuOptions';
import type {
    CellMenuTarget,
    MenuTarget,
    MenuTargetType
} from './ContextMenuTarget';

import { error } from '../../../Core/Utilities.js';

/* *
 *
 *  Constants
 *
 * */

const definitions: Record<string, MenuItemDefinition> = {};

const defaultIds: Partial<Record<MenuTargetType, MenuItemId[]>> = {};

const warnedIds = new Set<string>();

const defaultTargets: MenuTargetType[] = ['cell'];

/* *
 *
 *  Functions
 *
 * */

/**
 * Registers one menu item. An item with `items` is a branch, an item with
 * `onClick` is a leaf.
 *
 * @param id
 * Id the item is referred to by.
 *
 * @param definition
 * How the item behaves.
 */
export function registerMenuItem<T extends MenuTarget = CellMenuTarget>(
    id: MenuItemId,
    definition: MenuItemDefinition<T>
): void {
    // Stored widened: the registry never calls the callbacks, it only hands
    // them to the resolver, which treats every surface alike.
    definitions[id] = definition as MenuItemDefinition;

    for (const targetType of definition.defaultIn || []) {
        const ids = defaultIds[targetType] || (defaultIds[targetType] = []);

        if (!ids.includes(id)) {
            ids.push(id);
        }
    }
}

/**
 * Returns a registered menu item.
 *
 * @param id
 * Id of the item.
 *
 * @return
 * The item, or undefined when nothing is registered under the id.
 */
export function getMenuItem(id: string): MenuItemDefinition | undefined {
    return definitions[id];
}

/**
 * Returns the ids making up the menu of a surface when nothing is configured.
 *
 * @param targetType
 * Surface the menu opens on.
 *
 * @return
 * Ids in registration order.
 */
export function getDefaultMenuItemIds(
    targetType: MenuTargetType
): MenuItemId[] {
    return defaultIds[targetType] || [];
}

/**
 * Checks whether an item applies to a surface.
 *
 * @param definition
 * Item to check.
 *
 * @param targetType
 * Surface the menu opens on.
 *
 * @return
 * True when the item may be used there.
 */
export function menuItemAppliesTo(
    definition: MenuItemDefinition,
    targetType: MenuTargetType
): boolean {
    return (definition.targets || defaultTargets).includes(targetType);
}

/**
 * Logs a menu warning, once per id, so that a menu rebuilt on every open does
 * not repeat itself.
 *
 * @param id
 * Id the warning is about.
 *
 * @param message
 * Warning text.
 */
export function warnMenuItem(id: string, message: string): void {
    if (warnedIds.has(id)) {
        return;
    }
    warnedIds.add(id);

    error(message, false);
}

/* *
 *
 *  Default Export
 *
 * */

/**
 * The Grid context menu API.
 */
export default {
    registerItem: registerMenuItem
} as const;

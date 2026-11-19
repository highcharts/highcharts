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

/* *
 *
 *  Constants
 *
 * */

/**
 * Registered items by id.
 *
 * @internal
 */
export const menuItemDefinitions: Record<string, MenuItemDefinition> = {};

/**
 * Ids making up the menu of a surface that configures none, in registration
 * order.
 *
 * @internal
 */
export const defaultMenuItemIds:
Partial<Record<MenuTargetType, MenuItemId[]>> = {};

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
    menuItemDefinitions[id] = definition as MenuItemDefinition;

    for (const targetType of definition.defaultIn || []) {
        const ids = defaultMenuItemIds[targetType] ||
            (defaultMenuItemIds[targetType] = []);

        if (!ids.includes(id)) {
            ids.push(id);
        }
    }
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

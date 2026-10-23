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

import { warnOnce } from '../GridUtils.js';

/* *
 *
 *  Constants
 *
 * */

const definitions: Record<string, MenuItemDefinition> = {};

const defaultIds: Partial<Record<MenuTargetType, MenuItemId[]>> = {};

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
 * Returns a registered menu item usable on a surface, and says why not when
 * there is none.
 *
 * @param id
 * Id of the item.
 *
 * @param targetType
 * Surface the menu opens on.
 *
 * @return
 * The item, or undefined when nothing is registered under the id or it does
 * not apply here.
 */
export function getMenuItemFor(
    id: string,
    targetType: MenuTargetType
): MenuItemDefinition | undefined {
    const definition = definitions[id];

    if (!definition) {
        warnOnce(
            'menuItem:' + id,
            `Grid context menu: Unknown menu item id "${id}".`
        );
        return;
    }

    // An item applies to the cell menu unless it names its surfaces.
    if (!(definition.targets || ['cell']).includes(targetType)) {
        warnOnce(
            'menuItem:' + id,
            `Grid context menu: Menu item "${id}" does not apply to a ` +
            `"${targetType}" context menu.`
        );
        return;
    }

    return definition;
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

/* *
 *
 *  Grid Context Menu options
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
    MenuContext,
    MenuTarget,
    MenuTargetObject,
    MenuTargetType
} from './ContextMenuTarget';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Registry of menu item ids known at compile time. Features extend it through
 * module augmentation, so that their ids autocomplete while custom ids stay
 * allowed.
 */
export interface MenuItemIdRegistry {}

/**
 * Id of a registered menu item. The registered ids autocomplete, while any
 * other string stays allowed, which is what `string & {}` keeps from
 * swallowing them.
 */
export type MenuItemId = keyof MenuItemIdRegistry extends never ?
    (string & {}) :
    keyof MenuItemIdRegistry | (string & {});

/**
 * A menu item value that is either given up front or derived from the context
 * the menu was opened in.
 */
export type MenuItemResolvable<V, T extends MenuTarget = MenuTarget> =
    V | ((context: MenuContext<T>) => V);

/**
 * Callback run when a menu item is clicked.
 *
 * The target is bound to `this` and passed as the first argument, so that both
 * arrow functions and Highcharts-style callbacks reach it.
 */
export type MenuItemClickCallback<T extends MenuTarget = MenuTarget> = (
    this: MenuTargetObject<T>,
    target: MenuTargetObject<T>,
    context: MenuContext<T>
) => void;

/**
 * One entry of a context menu. An item with `items` is a branch, an item with
 * `onClick` is a leaf, an item with `separator` is a divider, and an item with
 * nothing but `id` refers to a registered item as it was registered.
 */
export interface MenuItemOptions<T extends MenuTarget = MenuTarget> {

    /**
     * Whether the item is shown but cannot be used. Prefer it over hiding when
     * the action applies here but cannot run right now.
     */
    disabled?: MenuItemResolvable<boolean, T>;

    /**
     * Icon shown next to the label. Built-in name, or a custom name from
     * `rendering.icons`.
     */
    icon?: string;

    /**
     * Id of a registered item to use. Any other property given alongside it
     * overrides what was registered.
     */
    id?: MenuItemId;

    /**
     * Items of the branch this item opens.
     */
    items?: Array<MenuItemOptions<T> | MenuItemId>;

    /**
     * The label shown in the menu.
     */
    label?: MenuItemResolvable<string, T>;

    /**
     * Callback run when the item is clicked.
     */
    onClick?: MenuItemClickCallback<T>;

    /**
     * Whether to render a divider instead of a button.
     */
    separator?: boolean;

    /**
     * Whether the item applies at all. A hidden item is left out of the menu,
     * and a branch whose items are all hidden is left out with them.
     */
    visible?: MenuItemResolvable<boolean, T>;

    /**
     * Id of a registered action to use.
     *
     * @deprecated 3.3.0
     * @deprnote Use `id` instead.
     */
    actionId?: MenuItemId;

    /**
     * Id of a registered group to use.
     *
     * @deprecated 3.3.0
     * @deprnote Use `id` instead.
     */
    groupId?: MenuItemId;

    /**
     * Type of the menu item.
     *
     * @deprecated 3.3.0
     * @deprnote Leave it out. `items` makes an item a branch and `separator`
     * makes it a divider.
     */
    type?: 'action' | 'group' | 'separator' | 'submenu';
}

/**
 * How a registered item behaves across the surfaces a menu can open on.
 */
export interface MenuItemDefinition<T extends MenuTarget = MenuTarget>
    extends MenuItemOptions<T> {

    /**
     * Surfaces whose default menu the item is part of, used when no `items`
     * are configured. Defaults to none, so a registered item has to be asked
     * for.
     */
    defaultIn?: MenuTargetType[];

    /**
     * Surfaces the item applies to. Referring to it from any other menu is
     * ignored with a warning.
     *
     * @default ['cell']
     */
    targets?: MenuTargetType[];
}

/**
 * Context menu options of one surface.
 */
export interface ContextMenuOptions<T extends MenuTarget = MenuTarget> {

    /**
     * Whether the context menu is enabled. When omitted, the menu opens when
     * `items` are given, or when a composed feature contributes an item that
     * applies to the current target.
     */
    enabled?: boolean;

    /**
     * Items to show in the menu. When omitted, the default items registered
     * for this surface are used.
     */
    items?: Array<MenuItemOptions<T> | MenuItemId>;
}

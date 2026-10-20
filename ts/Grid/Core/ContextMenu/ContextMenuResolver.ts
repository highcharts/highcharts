/* *
 *
 *  Grid Context Menu item resolver
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
    ContextMenuOptions,
    MenuItemDefinition,
    MenuItemId,
    MenuItemOptions,
    MenuItemResolvable
} from './ContextMenuOptions';
import type { MenuContext, MenuTarget } from './ContextMenuTarget';

import { getMenuTargetObject } from './ContextMenuTarget.js';

import {
    getDefaultMenuItemIds,
    getMenuItem,
    menuItemAppliesTo,
    warnMenuItem
} from './ContextMenuRegistry.js';

/* *
 *
 *  Declarations
 *
 * */

/**
 * One menu entry, with everything the renderer needs already resolved against
 * the context the menu was opened in.
 */
export interface ResolvedMenuItem {

    /**
     * Whether the entry is shown but cannot be used.
     */
    disabled: boolean;

    /**
     * Icon shown next to the label.
     */
    icon?: string;

    /**
     * Entries of the branch this entry opens.
     */
    items?: ResolvedMenuItem[];

    /**
     * The label shown in the menu.
     */
    label: string;

    /**
     * Callback run when the entry is clicked.
     */
    onClick?: () => void;

    /**
     * Whether the entry is a divider rather than a button.
     */
    separator?: boolean;
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Resolves a value that may have been given as a callback.
 *
 * @param value
 * Value or callback to resolve.
 *
 * @param context
 * Context the menu was opened in.
 *
 * @return
 * The resolved value.
 */
function resolveValue<V>(
    value: MenuItemResolvable<V> | undefined,
    context: MenuContext
): V | undefined {
    return typeof value === 'function' ?
        (value as (ctx: MenuContext) => V)(context) :
        value;
}

/**
 * Looks up an item by id and merges the properties given at the reference over
 * it. An override may restrict an item but never loosen it, so a feature
 * cannot have its visibility or disabled rules undone from the options.
 *
 * @param id
 * Id of the registered item.
 *
 * @param context
 * Context the menu was opened in.
 *
 * @param override
 * Properties given at the reference.
 *
 * @return
 * The merged item, without the id keys so that it resolves as a plain item, or
 * undefined when the id is unknown or does not apply to this surface.
 */
function dereference(
    id: MenuItemId,
    context: MenuContext,
    override: MenuItemOptions
): MenuItemOptions | undefined {
    const definition: MenuItemDefinition | undefined = getMenuItem(id);

    if (!definition) {
        warnMenuItem(id, `Grid context menu: Unknown menu item id "${id}".`);
        return;
    }

    if (!menuItemAppliesTo(definition, context.target.type)) {
        warnMenuItem(
            id,
            `Grid context menu: Menu item "${id}" does not apply to a ` +
            `"${context.target.type}" context menu.`
        );
        return;
    }

    return {
        ...definition,
        ...override,
        actionId: void 0,
        groupId: void 0,
        id: void 0,
        visible: (ctx): boolean => (
            resolveValue(definition.visible, ctx) !== false &&
            resolveValue(override.visible, ctx) !== false
        ),
        disabled: (ctx): boolean => (
            resolveValue(definition.disabled, ctx) === true ||
            resolveValue(override.disabled, ctx) === true
        )
    };
}

/**
 * Resolves one item declaration.
 *
 * @param item
 * Item declaration.
 *
 * @param context
 * Context the menu was opened in.
 *
 * @param seen
 * Ids already being resolved further up, used to stop a cycle.
 *
 * @return
 * The resolved entry, the entries of a registered branch that expands in
 * place, or undefined when the item does not apply.
 */
function resolveItem(
    item: MenuItemOptions | MenuItemId,
    context: MenuContext,
    seen: Set<string>
): ResolvedMenuItem | ResolvedMenuItem[] | undefined {
    const options: MenuItemOptions =
        typeof item === 'string' ? { id: item } : item;

    if (options.separator === true || options.type === 'separator') {
        return {
            disabled: false,
            label: resolveValue(options.label, context) || '',
            separator: true
        };
    }

    const id = options.id || options.actionId || options.groupId;

    if (id) {
        if (seen.has(id)) {
            warnMenuItem(
                id,
                `Grid context menu: Menu item "${id}" refers to itself.`
            );
            return;
        }

        const referenced = dereference(id, context, options);

        if (!referenced) {
            return;
        }

        seen.add(id);

        // A registered branch referred to by id expands in place, which is
        // what makes a registered group usable as a bundle of items. Giving
        // the reference its own `items` makes a branch of it instead.
        const result = (referenced.items && !options.items) ?
            (
                resolveValue(referenced.visible, context) === false ?
                    void 0 :
                    resolveItems(referenced.items, context, seen)
            ) :
            resolveItem(referenced, context, seen);

        seen.delete(id);

        return result;
    }

    if (resolveValue(options.visible, context) === false) {
        return;
    }

    const resolved: ResolvedMenuItem = {
        disabled: resolveValue(options.disabled, context) === true,
        icon: options.icon,
        label: resolveValue(options.label, context) || ''
    };

    if (options.items) {
        const children = resolveItems(options.items, context, seen);

        // A branch nobody can reach is not worth a line in the menu.
        if (!children.length) {
            return;
        }

        resolved.items = children;
        return resolved;
    }

    const { onClick } = options;

    if (onClick) {
        const targetObject = getMenuTargetObject(context.target);

        resolved.onClick = (): void => {
            onClick.call(targetObject, targetObject, context);
        };
    }

    return resolved;
}

/**
 * Drops the dividers that ended up with nothing to divide, which is what a
 * list filtered by visibility tends to leave behind.
 *
 * @param items
 * Resolved entries.
 *
 * @return
 * The entries without leading, trailing and repeated dividers.
 */
function withoutOrphanDividers(
    items: ResolvedMenuItem[]
): ResolvedMenuItem[] {
    const result: ResolvedMenuItem[] = [];

    for (const item of items) {
        if (
            item.separator &&
            (!result.length || result[result.length - 1].separator)
        ) {
            continue;
        }

        result.push(item);
    }

    while (result.length && result[result.length - 1].separator) {
        result.pop();
    }

    return result;
}

/**
 * Resolves a list of item declarations.
 *
 * @param items
 * Item declarations.
 *
 * @param context
 * Context the menu was opened in.
 *
 * @param seen
 * Ids already being resolved further up, used to stop a cycle.
 *
 * @return
 * The resolved entries.
 */
function resolveItems(
    items: Array<MenuItemOptions | MenuItemId>,
    context: MenuContext,
    seen: Set<string> = new Set()
): ResolvedMenuItem[] {
    const resolved: ResolvedMenuItem[] = [];

    for (const item of items) {
        const result = resolveItem(item, context, seen);

        if (Array.isArray(result)) {
            resolved.push(...result);
        } else if (result) {
            resolved.push(result);
        }
    }

    return withoutOrphanDividers(resolved);
}

/**
 * Resolves the menu of a surface that has nothing configured. A single branch
 * is shown in place, so that the only feature contributing to the menu does
 * not hide its actions behind one more click.
 *
 * @param context
 * Context the menu was opened in.
 *
 * @return
 * The resolved entries.
 */
function resolveDefaultItems(context: MenuContext): ResolvedMenuItem[] {
    const resolved: ResolvedMenuItem[] = [];

    for (const id of getDefaultMenuItemIds(context.target.type)) {
        // Dereferencing here rather than resolving the id keeps a registered
        // branch a branch, so that the rule below gets to choose.
        const referenced = dereference(id, context, {});
        const result = referenced &&
            resolveItem(referenced, context, new Set([id]));

        if (result && !Array.isArray(result)) {
            resolved.push({ ...result, label: result.label || id });
        }
    }

    if (resolved.length === 1 && resolved[0].items) {
        return resolved[0].items;
    }

    return resolved;
}

/**
 * Returns the options a surface keeps in the Grid options. Only the cell menu
 * keeps any; a feature adding a surface of its own reads them wherever it
 * put them and hands them to `ContextMenu.open`.
 *
 * @param context
 * Context the menu was opened in.
 *
 * @return
 * The options, when the surface keeps any there.
 */
function getSurfaceOptions(
    context: MenuContext
): ContextMenuOptions | undefined {
    return context.target.type === 'cell' ?
        context.target.column.options.cells?.contextMenu as
            ContextMenuOptions | undefined :
        void 0;
}

/**
 * Resolves the items of one context menu.
 *
 * @param context
 * Context the menu was opened in.
 *
 * @param surfaceOptions
 * Options to use. Left out for a surface that keeps them in the Grid options.
 *
 * @return
 * The resolved entries, empty when no menu should open and the native browser
 * menu should be left alone.
 */
export function resolveContextMenu<T extends MenuTarget>(
    context: MenuContext<T>,
    surfaceOptions?: ContextMenuOptions<T>
): ResolvedMenuItem[] {
    // Widened here and nowhere else. The target type only ever narrowed the
    // callbacks for whoever wrote them; resolving treats all surfaces alike.
    const ctx = context as MenuContext;
    const options = (
        surfaceOptions || getSurfaceOptions(ctx)
    ) as ContextMenuOptions | undefined;

    if (options?.enabled === false) {
        return [];
    }

    const items = options?.items ?
        resolveItems(options.items, ctx) :
        resolveDefaultItems(ctx);

    if (
        !items.length ||
        options?.enabled === true ||
        options?.items !== void 0
    ) {
        return items;
    }

    // Nothing the user can actually do means the browser menu is the more
    // useful one to leave in place.
    return items.some(
        (item): boolean => !item.separator && !item.disabled
    ) ? items : [];
}

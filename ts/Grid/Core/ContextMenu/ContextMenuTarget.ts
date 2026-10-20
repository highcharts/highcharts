/* *
 *
 *  Grid Context Menu Target
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

import type Column from '../Table/Column';
import type Grid from '../Grid';
import type TableCell from '../Table/Body/TableCell';
import type TableRow from '../Table/Body/TableRow';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A table body cell the menu was opened on.
 */
export interface CellMenuTarget {

    /**
     * The cell the menu belongs to.
     */
    cell: TableCell;

    /**
     * The column the cell belongs to.
     */
    column: Column;

    /**
     * The row the cell belongs to.
     */
    row: TableRow;

    /**
     * Discriminator of the target variant.
     */
    type: 'cell';
}

/**
 * An element a menu was attached to with `grid.contextMenu.attach()`.
 */
export interface ElementMenuTarget {

    /**
     * The element the menu belongs to.
     */
    element: HTMLElement;

    /**
     * Discriminator of the target variant.
     */
    type: 'element';
}

/**
 * The surfaces a context menu can open on, keyed by the discriminator of
 * each. A feature adds its own through module augmentation, so that opening
 * menus somewhere new needs no change here:
 *
 * ```ts
 * declare module '.../ContextMenuTarget' {
 *     interface MenuTargetRegistry {
 *         header: HeaderMenuTarget;
 *     }
 * }
 * ```
 *
 * Carry what the menu was opened on as `cell` when it is a cell of some
 * kind, and as `element` when it is a plain node, so that `MenuTargetObject`
 * and the callbacks find it.
 */
export interface MenuTargetRegistry {

    /**
     * A table body cell.
     */
    cell: CellMenuTarget;

    /**
     * An element given a menu with `grid.contextMenu.attach()`.
     */
    element: ElementMenuTarget;
}

/**
 * The thing a context menu was opened on.
 */
export type MenuTarget = MenuTargetRegistry[keyof MenuTargetRegistry];

/**
 * Discriminator value of a menu target.
 */
export type MenuTargetType = MenuTarget['type'];

/**
 * The object a menu item callback receives, which is whatever the menu was
 * opened on.
 */
export type MenuTargetObject<T extends MenuTarget = MenuTarget> =
    T extends { cell: infer C } ? C :
        T extends { element: infer E } ? E : never;

/**
 * Runtime context handed to every menu item callback.
 */
export interface MenuContext<T extends MenuTarget = MenuTarget> {

    /**
     * The Grid instance the menu belongs to.
     */
    grid: Grid;

    /**
     * What the menu was opened on.
     */
    target: T;
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Returns what a menu item callback receives: whatever the target was opened
 * on. A variant carries it as `cell` when it is a cell of some kind, and as
 * `element` when it is a plain node, which is what `MenuTargetObject` reads.
 *
 * @param target
 * What the menu was opened on.
 *
 * @return
 * The target object.
 */
export function getMenuTargetObject<T extends MenuTarget>(
    target: T
): MenuTargetObject<T> {
    return (
        'cell' in target ? target.cell : target.element
    ) as MenuTargetObject<T>;
}

/**
 * Returns the element a target occupies, which is the cell's own element when
 * the target carries a cell, and the node itself when it carries one.
 *
 * @param target
 * What the menu was opened on.
 *
 * @return
 * The element.
 */
export function getMenuTargetElement(target: MenuTarget): HTMLElement {
    return 'cell' in target ? target.cell.htmlElement : target.element;
}

/**
 * Builds the context of a menu opened on a table body cell.
 *
 * @param cell
 * The cell the menu opens on.
 *
 * @return
 * The menu context.
 */
export function getCellMenuContext(
    cell: TableCell
): MenuContext<CellMenuTarget> {
    return {
        grid: cell.row.viewport.grid,
        target: {
            cell,
            column: cell.column,
            row: cell.row,
            type: 'cell'
        }
    };
}

/* *
 *
 *  Grid Cell Context Menu options
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

/* *
 *
 *  Imports
 *
 * */

import type TableCell from '../Body/TableCell';
/* *
 *
 *  Declarations
 *
 * */

/**
 * Built-in menu item ID with support for custom IDs.
 */
type CellContextMenuId<T> =
    keyof T extends never ? (string & {}) : keyof T | (string & {});

/**
 * Registry of built-in action IDs for the cell context menu.
 * Composed features can extend this via module augmentation.
 */
export interface CellContextMenuBuiltInActionIdRegistry {}

/**
 * Built-in action ID for the cell context menu.
 */
export type CellContextMenuActionId =
    CellContextMenuId<CellContextMenuBuiltInActionIdRegistry>;

/**
 * Registry of built-in group IDs for the cell context menu.
 * Composed features can extend this via module augmentation.
 */
export interface CellContextMenuBuiltInGroupIdRegistry {}

/**
 * Built-in group ID for the cell context menu.
 */
export type CellContextMenuGroupId =
    CellContextMenuId<CellContextMenuBuiltInGroupIdRegistry>;

/**
 * Options for a single cell context menu item.
 */
export interface CellContextMenuActionItemOptions {
    /**
     * Type of the menu item.
     */
    type?: 'action';

    /**
     * The label shown in the menu.
     */
    label: string;

    /**
     * Optional icon name for the menu item (built-in name from the default
     * registry or custom name from `rendering.icons`).
     */
    icon?: string;

    /**
     * Whether the menu item should be disabled.
     */
    disabled?: boolean;

    /**
     * Whether to render a divider instead of a button.
     */
    separator?: false;

    /**
     * Callback executed when the menu item is clicked.
     *
     * The cell is available on `this` and is also passed as the first argument
     * to support arrow functions.
     */
    onClick?: (
        this: TableCell,
        cell: TableCell
    ) => void;
}

/**
 * Options for a submenu item in the cell context menu.
 */
export interface CellContextMenuSubmenuItemOptions {
    /**
     * Type of the menu item.
     */
    type: 'submenu';

    /**
     * The label shown in the menu.
     */
    label: string;

    /**
     * Optional icon name for the menu item (built-in name from the default
     * registry or custom name from rendering.icons).
     */
    icon?: string;

    /**
     * Whether the menu item should be disabled.
     */
    disabled?: boolean;

    /**
     * Nested submenu items.
     */
    items: Array<CellContextMenuItemOptions>;
}

/**
 * Options for a divider item in the cell context menu.
 */
export interface CellContextMenuDividerItemOptions {
    /**
     * Type of the menu item.
     */
    type?: 'separator';

    /**
     * Whether to render a divider instead of a button.
     */
    separator: true;

    /**
     * Optional label for accessibility or testing.
     * Not rendered as a clickable item.
     */
    label?: string;
}

/**
 * Options for a typed divider item in the cell context menu.
 */
export interface CellContextMenuTypedDividerItemOptions {
    /**
     * Type of the menu item.
     */
    type: 'separator';

    /**
     * Whether to render a divider instead of a button.
     */
    separator?: true;

    /**
     * Optional label for accessibility or testing.
     * Not rendered as a clickable item.
     */
    label?: string;
}

/**
 * Options for a built-in item in the cell context menu.
 */
export interface CellContextMenuBuiltInItemOptions {
    /**
     * Type of the menu item.
     */
    type?: 'action';

    /**
     * Built-in action ID.
     */
    actionId: CellContextMenuActionId;

    /**
     * Optional custom label for this built-in action.
     */
    label?: string;

    /**
     * Optional icon override for this built-in action.
     */
    icon?: string;

    /**
     * Whether this built-in action should be disabled.
     */
    disabled?: boolean;
}

/**
 * Options for including a built-in group in a custom cell context menu.
 */
export interface CellContextMenuBuiltInGroupItemOptions {
    /**
     * Type of the menu item.
     */
    type?: 'group';

    /**
     * Built-in group ID.
     */
    groupId: CellContextMenuGroupId;
}

/**
 * Options for a single cell context menu item.
 *
 * Bare strings are resolved as built-in group IDs first and then as built-in
 * action IDs. A group string expands inline in a user-configured menu.
 */
export type CellContextMenuItemOptions =
    CellContextMenuDividerItemOptions |
    CellContextMenuTypedDividerItemOptions |
    CellContextMenuActionItemOptions |
    CellContextMenuSubmenuItemOptions |
    CellContextMenuBuiltInItemOptions |
    CellContextMenuBuiltInGroupItemOptions |
    CellContextMenuActionId |
    CellContextMenuGroupId;

/**
 * Cell context menu options.
 */
export interface CellContextMenuOptions {
    /**
     * Whether the cell context menu is enabled. When omitted, the menu is
     * enabled when `items` are provided, or when a composed feature registers
     * visible built-in actions for the current cell.
     */
    enabled?: boolean;

    /**
     * List of items to show in the cell context menu.
     */
    items?: Array<CellContextMenuItemOptions>;
}

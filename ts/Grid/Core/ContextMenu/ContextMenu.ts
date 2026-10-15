/* *
 *
 *  Grid Context Menu
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

import type { ContextMenuOptions } from './ContextMenuOptions';
import type {
    ElementMenuTarget,
    MenuContext,
    MenuTarget
} from './ContextMenuTarget';
import type { ResolvedMenuItem } from './ContextMenuResolver';

import Globals from '../Globals.js';
import Menu from '../UI/Menu.js';
import {
    openFocusedSubMenu,
    renderMenuItems
} from './ContextMenuRenderer.js';
import { addEvent } from '../../../Shared/Utilities.js';
import { resolveContextMenu } from './ContextMenuResolver.js';

/* *
 *
 *  Class
 *
 * */

/**
 * The menu that opens at the cursor, whatever it was opened on.
 */
class ContextMenu extends Menu {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Context the menu is open in.
     */
    public context?: MenuContext;

    /**
     * Zero sized element the menu is anchored to, placed at the cursor.
     */
    private cursorAnchorElement?: HTMLElement;

    /**
     * Entries rendered on the next `renderContent` call.
     */
    private items: ResolvedMenuItem[] = [];

    /**
     * Removes the listener that closes the menu when its target goes away.
     */
    private removeOutdateListener?: Function;

    /* *
     *
     *  Methods
     *
     * */

    /**
     * Opens the menu, when any item applies to the context.
     *
     * @param context
     * Context to open the menu in.
     *
     * @param clientX
     * Viewport X coordinate to anchor at.
     *
     * @param clientY
     * Viewport Y coordinate to anchor at.
     *
     * @param options
     * Options to use. Left out for a surface that keeps them in the Grid
     * options.
     *
     * @return
     * True when the menu was opened.
     */
    public open<T extends MenuTarget>(
        context: MenuContext<T>,
        clientX: number,
        clientY: number,
        options?: ContextMenuOptions<T>
    ): boolean {
        const items = resolveContextMenu(context, options);

        // Nothing to show, or nowhere to show it yet: keep the native menu
        // rather than swallow the event for an empty popup.
        if (!items.length || !this.grid.contentWrapper) {
            return false;
        }

        // Close any other popup first. Copied to an array, because hiding
        // mutates the set.
        for (const popup of Array.from(this.grid.popups)) {
            if (popup !== this) {
                popup.hide();
            }
        }

        if (this.isVisible) {
            this.hide();
        }

        this.showAt(context, items, clientX, clientY);

        return true;
    }

    /**
     * Gives an element of your own the same context menu the Grid uses.
     *
     * @param element
     * Element to open the menu on.
     *
     * @param options
     * The menu to open.
     *
     * @return
     * Callback that detaches the menu again.
     */
    public attach(
        element: HTMLElement,
        options: ContextMenuOptions<ElementMenuTarget>
    ): () => void {
        const context: MenuContext<ElementMenuTarget> = {
            grid: this.grid,
            target: {
                element,
                type: 'element'
            }
        };

        const onContextMenu = (e: MouseEvent): void => {
            if (this.open(context, e.clientX, e.clientY, options)) {
                e.preventDefault();
            }
        };

        const onKeyDown = (e: KeyboardEvent): void => {
            if (e.key !== 'ContextMenu' && !(e.key === 'F10' && e.shiftKey)) {
                return;
            }

            const rect = element.getBoundingClientRect();

            if (this.open(context, rect.left + 4, rect.bottom - 2, options)) {
                e.preventDefault();
            }
        };

        element.addEventListener('contextmenu', onContextMenu);
        element.addEventListener('keydown', onKeyDown);

        return (): void => {
            element.removeEventListener('contextmenu', onContextMenu);
            element.removeEventListener('keydown', onKeyDown);
        };
    }

    /**
     * Opens the menu at the cursor.
     *
     * @param context
     * Context the menu was opened in.
     *
     * @param items
     * Resolved entries to render.
     *
     * @param clientX
     * Viewport X coordinate to anchor at.
     *
     * @param clientY
     * Viewport Y coordinate to anchor at.
     */
    public showAt(
        context: MenuContext,
        items: ResolvedMenuItem[],
        clientX: number,
        clientY: number
    ): void {
        const wrapper = this.grid.contentWrapper;

        if (!wrapper) {
            return;
        }

        this.context = context;
        this.items = items;

        const { target } = context;

        if (target.type === 'cell') {
            // The menu takes the focus, so the cell needs its own marker to
            // keep showing what the actions apply to.
            target.cell.htmlElement.classList.add(
                Globals.getClassName('contextMenuCell')
            );

            this.removeOutdateListener?.();
            this.removeOutdateListener = addEvent(
                target.cell,
                'outdate',
                (): void => {
                    this.hide();
                    delete this.context;
                }
            );
        }

        const rect = wrapper.getBoundingClientRect();
        const anchor = this.cursorAnchorElement = document.createElement('div');

        anchor.style.position = 'absolute';
        anchor.style.left = (clientX - rect.left) + 'px';
        anchor.style.top = (clientY - rect.top) + 'px';
        anchor.style.width = '0px';
        anchor.style.height = '0px';
        anchor.style.pointerEvents = 'none';
        wrapper.appendChild(anchor);

        super.show(anchor);
    }

    protected override get prefersPopover(): boolean {
        // An element given a menu with `attach` may sit anywhere on the page,
        // which the grid container cannot contain.
        return this.context?.target.type === 'element' || super.prefersPopover;
    }

    public override hide(): void {
        const target = this.context?.target;

        super.hide();

        if (target?.type === 'cell') {
            target.cell.htmlElement.classList.remove(
                Globals.getClassName('contextMenuCell')
            );
        }

        this.cursorAnchorElement?.remove();
        this.removeOutdateListener?.();
        delete this.cursorAnchorElement;
        delete this.removeOutdateListener;
    }

    protected override renderContent(): void {
        if (this.context) {
            renderMenuItems(this, this.context, this.items);
        }
    }

    protected override onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            openFocusedSubMenu(this);
            return;
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            return;
        }

        super.onKeyDown(event);
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default ContextMenu;

/* *
 *
 * Grid Context Menu abstract class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import Popup from './Popup.js';
import Globals from '../Globals.js';
import GridUtils from '../GridUtils.js';
import ContextMenuButton from './ContextMenuButton.js';

const { makeHTMLElement } = GridUtils;


/* *
 *
 *  Class
 *
 * */

/**
 * The context menu.
 */
export abstract class ContextMenu extends Popup {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The array of buttons in the context menu.
     */
    public readonly buttons: ContextMenuButton[] = [];

    /**
     * The index of the focused button in the context menu.
     */
    public focusCursor: number = 0;

    /**
     * The items container element.
     */
    private itemsContainer?: HTMLElement;


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Ensures that the items container element is created.
     *
     * @returns
     * The items container element.
     */
    public ensureItemsContainer(): HTMLElement | undefined {
        if (!this.content) {
            return;
        }

        if (this.itemsContainer) {
            return this.itemsContainer;
        }

        this.itemsContainer = makeHTMLElement('ul', {
            className: Globals.getClassName('menuContainer')
        }, this.content);

        return this.itemsContainer;
    }

    public override show(anchorElement?: HTMLElement): void {
        super.show(anchorElement);
        this.buttons[0]?.focus();
    }

    public override hide(): void {
        for (const btn of this.buttons) {
            btn.destroy();
        }
        this.buttons.length = 0;

        this.itemsContainer?.remove();
        delete this.itemsContainer;
        super.hide();
    }

    /**
     * Adds a divider to the context menu.
     *
     * @returns
     * The divider element.
     */
    protected addDivider(): HTMLElement | undefined {
        if (!this.ensureItemsContainer()) {
            return;
        }

        return makeHTMLElement('li', {
            className: Globals.getClassName('menuDivider')
        }, this.itemsContainer);
    }

    protected override onClickOutside(event: MouseEvent): void {
        const buttons = this.buttons;
        for (let i = 0, iEnd = buttons.length; i < iEnd; ++i) {
            if (buttons[i].popup?.container?.contains(event.target as Node)) {
                return;
            }
        }

        super.onClickOutside(event);
    }

    protected override onKeyDown(e: KeyboardEvent): void {
        super.onKeyDown(e);
        const len = this.buttons.length;
        const cursor = this.focusCursor;

        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                this.buttons[Math.abs((cursor - 1 + len) % len)].focus();
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                this.buttons[(cursor + 1) % len].focus();
                break;
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default ContextMenu;

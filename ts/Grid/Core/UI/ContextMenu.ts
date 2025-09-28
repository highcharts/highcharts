/* *
 *
 * Grid Context Menu abstract class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
abstract class ContextMenu extends Popup {

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
    public focusCursor: number = -1;

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
            className: Globals.getClassName('menuPopupContainer')
        }, this.content);

        return this.itemsContainer;
    }

    /**
     * Adds a header to the context menu.
     *
     * @param label
     * The label shown in the header of the context menu.
     *
     * @param category
     * The category shown in the header of the context menu, before the label.
     *
     * @returns
     * The header element.
     */
    protected addHeader(
        label: string,
        category?: string
    ): HTMLElement | undefined {
        if (!this.content) {
            return;
        }

        const container = makeHTMLElement('div', {
            className: Globals.getClassName('menuPopupHeader')
        }, this.content);

        if (category) {
            makeHTMLElement('span', {
                className: Globals.getClassName('menuPopupHeaderCategory'),
                innerText: category + ' '
            }, container);
        }

        makeHTMLElement('span', {
            className: Globals.getClassName('menuPopupHeaderName'),
            innerText: label
        }, container);

        return container;
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
            className: Globals.getClassName('menuPopupDivider')
        }, this.itemsContainer);
    }

    public override hide(): void {
        this.itemsContainer?.remove();
        delete this.itemsContainer;
        super.hide();
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
}


/* *
 *
 *  Default Export
 *
 * */

export default ContextMenu;

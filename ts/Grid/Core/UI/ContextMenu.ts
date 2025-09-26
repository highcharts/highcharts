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
import SvgIcons from './SvgIcons.js';
import Globals from '../Globals.js';
import GridUtils from '../GridUtils.js';

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
    private ensureItemsContainer(): HTMLElement | undefined {
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
     * Adds an item to the context menu.
     *
     * @param label
     * The label shown in the item of the context menu.
     *
     * @param icon
     * The icon shown in the item of the context menu.
     *
     * @param collapsable
     * Whether the item is collapsable.
     *
     * @returns
     * The item element.
     */
    protected addItem(
        label: string,
        icon?: SvgIcons.GridIconName,
        collapsable: boolean = false
    ): HTMLElement | undefined {
        if (!this.ensureItemsContainer()) {
            return;
        }

        const liEl = makeHTMLElement('li', void 0, this.itemsContainer);

        const buttonEl = makeHTMLElement('button', {
            className: Globals.getClassName('menuPopupItem')
        }, liEl);

        const iconEl = makeHTMLElement('span', {
            className: Globals.getClassName('menuPopupItemIcon')
        }, buttonEl);
        iconEl.setAttribute('aria-hidden', 'true');

        makeHTMLElement('span', {
            className: Globals.getClassName('menuPopupItemLabel'),
            innerText: label
        }, buttonEl);

        const chevronEl = makeHTMLElement('span', {
            className: Globals.getClassName('menuPopupItemIcon')
        }, buttonEl);
        chevronEl.setAttribute('aria-hidden', 'true');

        if (icon) {
            iconEl.appendChild(SvgIcons.createGridIcon(icon));
        }

        if (collapsable) {
            chevronEl.appendChild(SvgIcons.createGridIcon('chevronRight'));
        }

        return liEl;
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
}


/* *
 *
 *  Default Export
 *
 * */

export default ContextMenu;

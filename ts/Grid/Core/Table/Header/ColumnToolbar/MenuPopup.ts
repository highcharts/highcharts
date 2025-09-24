/* *
 *
 *  Grid Menu Popup class
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

import type MenuToolbarButton from './Buttons/MenuToolbarButton.js';
import type Grid from '../../../Grid.js';

import Popup from '../../../UI/Popup.js';
import SvgIcons from '../../../UI/SvgIcons.js';
import Globals from '../../../Globals.js';
import GridUtils from '../../../GridUtils.js';

const { makeHTMLElement } = GridUtils;


/* *
 *
 *  Class
 *
 * */

/**
 * The column filtering popup.
 */
class MenuPopup extends Popup {

    /* *
     *
     *  Properties
     *
     * */

    public button: MenuToolbarButton;

    /* *
     *
     *  Constructor
     *
     * */

    constructor(grid: Grid, button: MenuToolbarButton) {
        super(grid);
        this.button = button;
    }

    /* *
     *
     *  Methods
     *
     * */

    protected override renderContent(contentElement: HTMLElement): void {
        this.createHeader(contentElement);

        const ul = makeHTMLElement('ul', {
            className: Globals.getClassName('menuPopupContainer')
        }, contentElement);

        this.createItem(ul, 'Sort descending');
        this.createItem(ul, 'Sort ascending');
        this.createDivider(ul);
        this.createItem(ul, 'Filter', 'filter', true);
    }

    private createHeader(parent: HTMLElement): HTMLElement {
        const container = makeHTMLElement('div', {
            className: Globals.getClassName('menuPopupHeader')
        }, parent);

        makeHTMLElement('span', {
            className: Globals.getClassName('menuPopupHeaderCategory'),
            innerText: 'Column '
        }, container);

        makeHTMLElement('span', {
            className: Globals.getClassName('menuPopupHeaderName'),
            innerText: this.button.toolbar?.column.header?.value || ''
        }, container);

        return container;
    }

    private createItem(
        parent: HTMLElement,
        label: string,
        icon?: SvgIcons.GridIconName,
        collapsable: boolean = false
    ): HTMLElement {
        const liEl = makeHTMLElement('li', void 0, parent);

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

    private createDivider(parent: HTMLElement): HTMLElement {
        return makeHTMLElement('li', {
            className: Globals.getClassName('menuPopupDivider')
        }, parent);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default MenuPopup;

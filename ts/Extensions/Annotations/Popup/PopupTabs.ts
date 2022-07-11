/* *
 *
 *  Popup generator for Stock tools
 *
 *  (c) 2009-2021 Sebastian Bochan
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType';
import type Popup from './Popup';

import H from '../../../Core/Globals.js';
const { doc } = H;
import PopupHTML from './PopupHTML.js';
const {
    DIV,
    PREFIX,
    SPAN
} = PopupHTML;
import U from '../../../Core/Utilities.js';
const {
    addEvent,
    createElement
} = U;

/* *
 *
 *  Functions
 *
 * */

/**
 * Create tab content
 * @private
 * @return {HTMLDOMElement} - created HTML tab-content element
 */
function addContentItem(this: Popup): HTMLDOMElement {
    const popupDiv = this.container;

    return createElement(
        DIV,
        {
            // #12100
            className: PREFIX + 'tab-item-content ' +
                PREFIX + 'no-mousewheel'
        },
        void 0,
        popupDiv
    );
}

/**
 * Create tab menu item
 * @private
 * @param {string} tabName
 * `add` or `edit`
 * @param {number} [disableTab]
 * Disable tab when 0
 * @return {Highcharts.HTMLDOMElement}
 * Created HTML tab-menu element
 */
function addMenuItem(
    this: Popup,
    tabName: string,
    disableTab?: number
): HTMLDOMElement {
    let popupDiv = this.container,
        className = PREFIX + 'tab-item',
        lang = this.lang,
        menuItem;

    if (disableTab === 0) {
        className += ' ' + PREFIX + 'tab-disabled';
    }

    // tab 1
    menuItem = createElement(
        SPAN,
        {
            className
        },
        void 0,
        popupDiv
    );
    menuItem.appendChild(
        doc.createTextNode(lang[tabName + 'Button'] || tabName)
    );

    menuItem.setAttribute(PREFIX + 'data-tab-type', tabName);

    return menuItem;
}

/**
 * Set all tabs as invisible.
 * @private
 */
function deselectAll(this: Popup): void {
    let popupDiv = this.container,
        tabs = popupDiv
            .querySelectorAll('.' + PREFIX + 'tab-item'),
        tabsContent = popupDiv
            .querySelectorAll('.' + PREFIX + 'tab-item-content'),
        i;

    for (i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove(PREFIX + 'tab-item-active');
        tabsContent[i].classList.remove(PREFIX + 'tab-item-show');
    }
}

/**
 * Init tabs. Create tab menu items, tabs containers
 * @private
 * @param {Highcharts.Chart} chart
 * Reference to current chart
 */
function init(
    this: Popup,
    chart: Highcharts.AnnotationChart
): void {
    let indicatorsCount = this.indicators.getAmount.call(chart),
        firstTab; // run by default

    if (!chart) {
        return;
    }

    // create menu items
    firstTab = addMenuItem.call(this, 'add');
    addMenuItem.call(this, 'edit', indicatorsCount);

    // create tabs containers
    addContentItem.call(this);
    addContentItem.call(this);

    switchTabs.call(this, indicatorsCount);

    // activate first tab
    selectTab.call(this, firstTab, 0);
}

/**
 * Set tab as visible
 * @private
 * @param {globals.Element} - current tab
 * @param {number} - Index of tab in menu
 */
function selectTab(
    this: Popup,
    tab: Element,
    index: number
): void {
    const allTabs = this.container
        .querySelectorAll('.' + PREFIX + 'tab-item-content');

    tab.className += ' ' + PREFIX + 'tab-item-active';
    allTabs[index].className += ' ' + PREFIX + 'tab-item-show';
}

/**
 * Add click event to each tab
 * @private
 * @param {number} disableTab
 * Disable tab when 0
 */
function switchTabs(
    this: Popup,
    disableTab: number
): void {
    let _self = this,
        popupDiv = this.container,
        tabs = popupDiv.querySelectorAll('.' + PREFIX + 'tab-item'),
        dataParam;

    tabs.forEach(function (tab: Element, i: number): void {

        dataParam = tab.getAttribute(PREFIX + 'data-tab-type');

        if (dataParam === 'edit' && disableTab === 0) {
            return;
        }

        ['click', 'touchstart'].forEach(function (
            eventName: string
        ): void {
            addEvent(tab, eventName, function (): void {

                // reset class on other elements
                deselectAll.call(_self);
                selectTab.call(_self, this, i);
            });
        });
    });
}

/* *
 *
 *  Default Export
 *
 * */

const PopupTabs = {
    init
};

export default PopupTabs;

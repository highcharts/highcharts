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

import type {
    HTMLDOMElement,
    SVGDOMElement
} from '../../../Core/Renderer/DOMElementType';
import type NavigationBindings from '../NavigationBindings';
import type Pointer from '../../../Core/Pointer';

import Popup from './Popup.js';
import U from '../../../Core/Utilities.js';
const {
    addEvent,
    wrap
} = U;

/* *
 *
 *  Constants
 *
 * */

const composedClasses: Array<Function> = [];

/* *
 *
 *  Functions
 *
 * */

function compose(
    NagivationBindingsClass: typeof NavigationBindings,
    PointerClass: typeof Pointer
): void {

    if (composedClasses.indexOf(NagivationBindingsClass) === -1) {
        composedClasses.push(NagivationBindingsClass);


        addEvent(
            NagivationBindingsClass,
            'closePopup',
            onNavigationBindingsClosePopup
        );
        addEvent(
            NagivationBindingsClass,
            'showPopup',
            onNavigationBindingsShowPopup
        );
    }

    if (composedClasses.indexOf(PointerClass) === -1) {
        composedClasses.push(PointerClass);

        wrap(
            PointerClass.prototype,
            'onContainerMouseDown',
            wrapPointerOnContainerMouserDown
        );
    }
}

function onNavigationBindingsClosePopup(this: NavigationBindings): void {
    if (this.popup) {
        this.popup.closePopup();
    }
}

function onNavigationBindingsShowPopup(
    this: NavigationBindings,
    config: Highcharts.PopupConfigObject
): void {
    if (!this.popup) {
        // Add popup to main container
        this.popup = new Popup(
            this.chart.container, (
                this.chart.options.navigation.iconsURL ||
                (
                    this.chart.options.stockTools &&
                    this.chart.options.stockTools.gui.iconsURL
                ) ||
                'https://code.highcharts.com/@product.version@/gfx/stock-icons/'
            ), this.chart
        );
    }

    this.popup.showForm(
        config.formType,
        this.chart,
        config.options,
        config.onSubmit
    );
}

/**
 * onContainerMouseDown blocks internal popup events, due to e.preventDefault.
 * Related issue #4606
 * @private
 */
function wrapPointerOnContainerMouserDown(
    this: Pointer,
    proceed: Function,
    e: MouseEvent
): void {
    // elements is not in popup
    if (!this.inClass(
        e.target as (HTMLDOMElement|SVGDOMElement),
        'highcharts-popup'
    )) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
}

/* *
 *
 *  Default Export
 *
 * */

const PopupComposition = {
    compose
};

export default PopupComposition;

/* *
 *
 *  (c) 2009-2019 Sebastian Bochann
 *
 *  Full screen for Highcharts
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class FullScreen {
            public constructor(container: HTMLDOMElement);
            public init(container: HTMLDOMElement): void;
        }
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * The FullScreen class.
 * The module allows user to enable full screen mode in StockTools.
 * Based on default solutions in browsers.
 *
 * @private
 * @class
 * @name Highcharts.FullScreen
 *
 * @param {Highcharts.HTMLDOMElement} container
 *        Chart container
 */
var FullScreen = H.FullScreen = function (
    this: Highcharts.FullScreen,
    container: Highcharts.HTMLDOMElement
): void {
    this.init(container.parentNode as any);
} as any;

FullScreen.prototype = {
    /**
     * Init function
     * @private
     * @param {Highcharts.HTMLDOMElement} container
     *        Chart container's parent
     * @return {void}
     */
    init: function (
        this: Highcharts.FullScreen,
        container: Highcharts.HTMLDOMElement
    ): void {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    }
};

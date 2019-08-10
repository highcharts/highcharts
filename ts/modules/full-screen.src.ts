/* *
 * (c) 2009-2019 Sebastian Bochann
 *
 * Full screen for Highcharts
 *
 * License: www.highcharts.com/license
 */

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
 * @param {Highcharts.HTMLDOMElement} container chart div
 */
var FullScreen = H.FullScreen = function (
    this: Highcharts.FullScreen,
    container: Highcharts.HTMLDOMElement): void {
    // main div of the chart
    this.init(container.parentNode as Highcharts.HTMLDOMElement);
} as any;

FullScreen.prototype = {
    /**
     * Init function
     *
     * @param {Highcharts.HTMLDOMElement} - chart div
     *
     */
    init: function (container: Highcharts.HTMLDOMElement): void {
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

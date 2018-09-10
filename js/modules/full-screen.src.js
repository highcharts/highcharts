/**
 * (c) 2009-2018 Sebastian Bochann
 *
 * Full screen for Highcharts
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';

H.FullScreen = function (container) {
    this.init(container.parentNode); // main div of the chart
};

/**
 * The module allows user to enable full screen mode in StockTools.
 * Based on default solutions in browsers.
 *
 */

H.FullScreen.prototype = {
    /**
     * Init function
     *
     * @param {HTMLDOMElement} - chart div
     *
     */
    init: function (container) {
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




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
var FullScreen = H.FullScreen = function (container) {
    this.init(container.parentNode);
};
FullScreen.prototype = {
    /**
     * Init function
     * @private
     * @param {Highcharts.HTMLDOMElement} container
     *        Chart container's parent
     * @return {void}
     */
    init: function (container) {
        var promise;
        if (container.requestFullscreen) {
            promise = container.requestFullscreen();
        }
        else if (container.mozRequestFullScreen) {
            promise = container.mozRequestFullScreen();
        }
        else if (container.webkitRequestFullscreen) {
            promise = container.webkitRequestFullscreen();
        }
        else if (container.msRequestFullscreen) {
            promise = container.msRequestFullscreen();
        }
        if (promise) {
            promise['catch'](function () {
                alert('Full screen is not supported inside a frame'); // eslint-disable-line no-alert
            });
        }
    }
};

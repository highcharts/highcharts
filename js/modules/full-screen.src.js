/* *
 * (c) 2009-2020 Rafal Sebestjanski
 *
 * Full screen for Highcharts
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
var addEvent = H.addEvent, Chart = H.Chart;
/**
 * The module allows user to enable display chart in full screen mode.
 * Used in StockTools too.
 * Based on default solutions in browsers.
 *
 */
/**
 * The flag is set to `true` if the chart is displayed in fullscreen mode.
 *
 * @name Highcharts.Chart#isFullscreen
 * @type {boolean|undefined}
 * @since next
 */
/* eslint-disable no-invalid-this, valid-jsdoc */
var FullscreenController = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    /**
     * Handle color operations. Some object methods are chainable.
     *
     * @param {Highcharts.ColorType} input
     *        The input color in either rbga or hex format
     */
    function FullscreenController(chart) {
        var fullscreenController = this;
        this.chart = chart;
        if (!(chart.container.parentNode instanceof HTMLElement)) {
            return;
        }
        var container = chart.container.parentNode;
        // Hold event and methods available only for a current browser.
        if (!fullscreenController.browserProps) {
            if (typeof container.requestFullscreen === 'function') {
                fullscreenController.browserProps = {
                    fullscreenChange: 'fullscreenchange',
                    requestFullscreen: 'requestFullscreen',
                    exitFullscreen: 'exitFullscreen'
                };
            }
            else if (container.mozRequestFullScreen) {
                fullscreenController.browserProps = {
                    fullscreenChange: 'mozfullscreenchange',
                    requestFullscreen: 'mozRequestFullScreen',
                    exitFullscreen: 'mozCancelFullScreen'
                };
            }
            else if (container.webkitRequestFullScreen) {
                fullscreenController.browserProps = {
                    fullscreenChange: 'webkitfullscreenchange',
                    requestFullscreen: 'webkitRequestFullScreen',
                    exitFullscreen: 'webkitExitFullscreen'
                };
            }
            else if (container.msRequestFullscreen) {
                fullscreenController.browserProps = {
                    fullscreenChange: 'MSFullscreenChange',
                    requestFullscreen: 'msRequestFullscreen',
                    exitFullscreen: 'msExitFullscreen'
                };
            }
        }
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
    /**
     * Toggles displaying the chart in fullscreen mode.
     * By default, when the exporting module is enabled, a context button with
     * a drop down menu in the upper right corner accesses this function.
     * Exporting module required.
     *
     * @since       next
     *
     * @sample      highcharts/members/chart-togglefullscreen/
     *              Toggle fullscreen mode from a HTML button
     *
     * @function Highcharts.FullscreenController#toggleFullscreen
     * @return      {void}
     * @requires    modules/exporting
     * @requires    modules/full-screen
     */
    FullscreenController.prototype.toggleFullscreen = function () {
        var fullscreenController = this;
        if (!fullscreenController.chart.isFullscreen) {
            fullscreenController.openFullscreen();
        }
        else {
            fullscreenController.closeFullscreen();
        }
    };
    ;
    // Helping function - to close fullscreen, use toggleFullscreen() instead.
    FullscreenController.prototype.closeFullscreen = function () {
        var fullscreenController = this, chart = fullscreenController.chart;
        // Don't fire exitFullscreen() when user exited using 'Escape' button.
        if (chart.isFullscreen &&
            fullscreenController.browserProps &&
            chart.container.ownerDocument instanceof Document) {
            chart.container.ownerDocument[fullscreenController.browserProps.exitFullscreen]();
        }
        // Unbind event as it's necessary only before exiting from fullscreen.
        if (fullscreenController.unbindFullscreenEvent) {
            fullscreenController.unbindFullscreenEvent();
        }
        chart.isFullscreen = false;
        fullscreenController.setButtonText();
    };
    ;
    // Helping function - to close fullscreen, use toggleFullscreen() instead.
    FullscreenController.prototype.openFullscreen = function () {
        var fullscreenController = this, chart = fullscreenController.chart;
        // Handle exitFullscreen() method when user clicks 'Escape' button.
        if (fullscreenController.browserProps) {
            fullscreenController.unbindFullscreenEvent = H.addEvent(chart.container.ownerDocument, // chart's document
            fullscreenController.browserProps.fullscreenChange, function () {
                // Handle lack of async of browser's fullScreenChange event.
                if (chart.isFullscreen) {
                    chart.isFullscreen = false;
                    fullscreenController.closeFullscreen();
                }
                else {
                    chart.isFullscreen = true;
                    fullscreenController.setButtonText();
                }
            });
            if (chart.container.parentNode instanceof Element) {
                var promise = chart.container.parentNode[fullscreenController.browserProps.requestFullscreen]();
                if (promise) {
                    promise.catch(function () {
                        alert(// eslint-disable-line no-alert
                        'Full screen is not supported inside a frame.');
                    });
                }
            }
            H.addEvent(chart, 'destroy', fullscreenController.unbindFullscreenEvent);
        }
    };
    ;
    /**
     * Replace button text. When toggleFullscreen() will be fired customly
     * by user before exporting context button is created, text will not be
     * replaced - it's on the user side.
     * @private
     * @return {void}
     */
    FullscreenController.prototype.setButtonText = function () {
        var _a, _b, _c, _d;
        var chart = this.chart, exportDivElements = chart.exportDivElements, exportingOptions = chart.options.exporting, menuItems = (_b = (_a = exportingOptions) === null || _a === void 0 ? void 0 : _a.buttons) === null || _b === void 0 ? void 0 : _b.contextButton.menuItems, lang = chart.options.lang;
        if (((_c = exportingOptions) === null || _c === void 0 ? void 0 : _c.menuItemDefinitions) && ((_d = lang) === null || _d === void 0 ? void 0 : _d.exitFullscreen) &&
            lang.viewFullscreen &&
            menuItems &&
            exportDivElements &&
            exportDivElements.length) {
            exportDivElements[menuItems.indexOf('viewFullscreen')]
                .innerHTML = !chart.isFullscreen ?
                (exportingOptions.menuItemDefinitions.viewFullscreen.text ||
                    lang.viewFullscreen) : lang.exitFullscreen;
        }
    };
    ;
    return FullscreenController;
}());
;
H.FullscreenController = FullscreenController;
export default H.FullscreenController;
// Initialize fullscreen
addEvent(Chart, 'beforeRender', function () {
    /**
     * @name Highcharts.Chart#fullscreenController
     * @type {Highcharts.FullscreenController}
     * @requires modules/exporting
     * @requires modules/full-screen
     */
    this.fullscreenController = new H.FullscreenController(this);
});

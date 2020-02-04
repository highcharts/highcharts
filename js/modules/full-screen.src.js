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
H.FullscreenController = function (chart) {
    this.chart = chart;
};
// Initialize fullscreen
addEvent(Chart, 'beforeRender', function () {
    this.fullscreenController = new H.FullscreenController(this);
});
H.FullscreenController.prototype = {
    /**
     * Replace button text. When toggleFullscreen() will be fired customly
     * by user before exporting context button is created, text will not be
     * replaced - it's on the user side.
     * @private
     * @return {void}
     */
    setButtonText: function () {
        var _a, _b, _c, _d;
        var chart = this.chart, exportDivElements = chart.exportDivElements, exportingOptions = chart.options.exporting, menuItems = (_b = (_a = exportingOptions) === null || _a === void 0 ? void 0 : _a.buttons) === null || _b === void 0 ? void 0 : _b.contextButton.menuItems, lang = chart.options.lang;
        if (((_c = exportingOptions) === null || _c === void 0 ? void 0 : _c.menuItemDefinitions) && ((_d = lang) === null || _d === void 0 ? void 0 : _d.exitFullscreen) &&
            lang.viewFullscreen &&
            menuItems &&
            exportDivElements &&
            exportDivElements.length) {
            exportDivElements[menuItems.indexOf('viewFullscreen')]
                .innerHTML = chart.isFullscreen ?
                (exportingOptions.menuItemDefinitions.viewFullscreen.text ||
                    lang.viewFullscreen) : lang.exitFullscreen;
        }
    },
    // Helping function - to open fullscreen, use toggleFullscreen() instead.
    openFullscreen: function () {
        var fullscreenController = this, chart = fullscreenController.chart;
        // Handle closeFullscreen() method when user clicks 'Escape' button.
        chart.unbindFullscreenEvent = H.addEvent(chart.container.ownerDocument, // chart's document
        fullscreenController.browserProps.fullscreenChange, function () {
            // Handle lack of async of browser's fullScreenChange event.
            if (chart.isFullscreen) {
                chart.isFullscreen = false;
                fullscreenController.closeFullscreen();
            }
            else {
                chart.isFullscreen = true;
            }
        });
        if (chart.container.parentNode instanceof Element) {
            var promise = chart.container.parentNode[fullscreenController.browserProps.requestFullscreen]();
            if (promise) {
                promise.catch(function () {
                    alert(// eslint-disable-line no-alert
                    'Full screen is not supported inside a frame');
                });
            }
            fullscreenController.setButtonText();
        }
        H.addEvent(chart, 'destroy', chart.unbindFullscreenEvent);
    },
    // Helping function - to close fullscreen, use toggleFullscreen() instead.
    closeFullscreen: function () {
        var fullscreenController = this, chart = fullscreenController.chart;
        // Don't fire exitFullscreen() when user exited using 'Escape' button.
        if (chart.isFullscreen &&
            chart.container.ownerDocument instanceof Document) {
            chart.container.ownerDocument[fullscreenController.browserProps.exitFullscreen]();
            this.setButtonText();
        }
        // Unbind event as it's necessary only before exiting from fullscreen.
        if (chart.unbindFullscreenEvent) {
            chart.unbindFullscreenEvent();
        }
        chart.isFullscreen = false;
    },
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
     * @function    Highcharts.Chart#toggleFullscreen
     * @return      {void}
     * @requires    modules/exporting
     * @requires    modules/fullscreen
     */
    toggleFullscreen: function () {
        var fullscreenController = this, chart = fullscreenController.chart;
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
        if (!chart.isFullscreen) {
            fullscreenController.openFullscreen();
        }
        else {
            fullscreenController.closeFullscreen();
        }
    }
};

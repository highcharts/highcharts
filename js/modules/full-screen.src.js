/* *
 * (c) 2009-2020 Rafal Sebestjanski
 *
 * Full screen for Highcharts
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
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
// Helping function - to open fullscreen, use toggleFullscreen() instead.
H.Chart.prototype.openFullscreen = function () {
    var _a, _b;
    var chart = this, menuItems = (_b = (_a = chart.options.exporting) === null || _a === void 0 ? void 0 : _a.buttons) === null || _b === void 0 ? void 0 : _b.contextButton.menuItems;
    // Handle closeFullscreen() method when user clicks 'Escape' button.
    chart.unbindFullscreenEvent = H.addEvent(chart.container.ownerDocument, // chart's document
    chart.browserProps.fullscreenChange, function () {
        // Handle lack of async of browser's fullScreenChange event.
        if (chart.isFullscreen) {
            chart.isFullscreen = false;
            chart.closeFullscreen();
        }
        else {
            chart.isFullscreen = true;
        }
    });
    chart.container.parentNode[chart.browserProps.requestFullscreen]();
    // Replace button text. When chart.toggleFullscreen() will be fired customly
    // by user before exporting context button is created, text will not be
    // replaced - it's on the user side.
    if (chart.exportDivElements &&
        chart.exportDivElements.length &&
        menuItems &&
        chart.options.lang &&
        chart.options.lang.exitFullscreen) {
        chart.exportDivElements[menuItems.indexOf('viewFullscreen')].innerHTML =
            chart.options.lang.exitFullscreen;
    }
    H.addEvent(chart, 'destroy', chart.unbindFullscreenEvent);
};
// Helping function - to close fullscreen, use toggleFullscreen() instead.
H.Chart.prototype.closeFullscreen = function () {
    var _a, _b, _c, _d, _e;
    var chart = this, exportingOptions = chart.options.exporting, exportDivElements = chart.exportDivElements, menuItems = (_b = (_a = exportingOptions) === null || _a === void 0 ? void 0 : _a.buttons) === null || _b === void 0 ? void 0 : _b.contextButton.menuItems;
    // Don't fire exitFullscreen() when user exited using 'Escape' button.
    if (chart.isFullscreen) {
        chart.container.ownerDocument[chart.browserProps.exitFullscreen]();
    }
    // Replace button text.
    if (exportDivElements &&
        exportDivElements.length && ((_d = (_c = exportingOptions) === null || _c === void 0 ? void 0 : _c.menuItemDefinitions) === null || _d === void 0 ? void 0 : _d.viewFullscreen) &&
        menuItems && ((_e = chart.options.lang) === null || _e === void 0 ? void 0 : _e.viewFullscreen)) {
        exportDivElements[menuItems.indexOf('viewFullscreen')].innerHTML = (exportingOptions.menuItemDefinitions.viewFullscreen.text ||
            chart.options.lang.viewFullscreen);
    }
    // Unbind event as it's necessary only before exiting from fullscreen.
    if (chart.unbindFullscreenEvent) {
        chart.unbindFullscreenEvent();
    }
    chart.isFullscreen = false;
};
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * Exporting module required. Toggles displaying the chart in fullscreen mode.
 * By default, when the exporting module is enabled, a context button with
 * a drop down menu in the upper right corner accesses this function.
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
H.Chart.prototype.toggleFullscreen = function () {
    var chart = this, container = chart.container.parentNode;
    // Hold event and methods available only for a current browser.
    if (!chart.browserProps) {
        if (container.requestFullscreen) {
            chart.browserProps = {
                fullscreenChange: 'fullscreenchange',
                requestFullscreen: 'requestFullscreen',
                exitFullscreen: 'exitFullscreen'
            };
        }
        else if (container.mozRequestFullScreen) {
            chart.browserProps = {
                fullscreenChange: 'mozfullscreenchange',
                requestFullscreen: 'mozRequestFullscreen',
                exitFullscreen: 'mozCancelFullScreen'
            };
        }
        else if (container.webkitRequestFullscreen) {
            chart.browserProps = {
                fullscreenChange: 'webkitfullscreenchange',
                requestFullscreen: 'webkitRequestFullscreen',
                exitFullscreen: 'webkitExitFullscreen'
            };
        }
        else if (container.msRequestFullscreen) {
            chart.browserProps = {
                fullscreenChange: 'MSFullscreenChange',
                requestFullscreen: 'msRequestFullscreen',
                exitFullscreen: 'msExitFullscreen'
            };
        }
    }
    if (!chart.isFullscreen) {
        chart.openFullscreen();
    }
    else {
        chart.closeFullscreen();
    }
};

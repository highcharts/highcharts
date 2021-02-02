/* *
 * (c) 2009-2021 Rafal Sebestjanski
 *
 * Full screen for Highcharts
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
var doc = H.doc;
import AST from '../Core/Renderer/HTML/AST.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent;
/**
 * The module allows user to enable display chart in full screen mode.
 * Used in StockTools too.
 * Based on default solutions in browsers.
 *
 */
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * Handles displaying chart's container in the fullscreen mode.
 *
 * **Note**: Fullscreen is not supported on iPhone due to iOS limitations.
 *
 * @class
 * @name Highcharts.Fullscreen
 * @hideconstructor
 * @requires modules/full-screen
 */
var Fullscreen = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function Fullscreen(chart) {
        /**
         * Chart managed by the fullscreen controller.
         * @name Highcharts.Fullscreen#chart
         * @type {Highcharts.Chart}
         */
        this.chart = chart;
        /**
         * The flag is set to `true` when the chart is displayed in
         * the fullscreen mode.
         *
         * @name Highcharts.Fullscreen#isOpen
         * @type {boolean|undefined}
         * @since 8.0.1
         */
        this.isOpen = false;
        var container = chart.renderTo;
        // Hold event and methods available only for a current browser.
        if (!this.browserProps) {
            if (typeof container.requestFullscreen === 'function') {
                this.browserProps = {
                    fullscreenChange: 'fullscreenchange',
                    requestFullscreen: 'requestFullscreen',
                    exitFullscreen: 'exitFullscreen'
                };
            }
            else if (container.mozRequestFullScreen) {
                this.browserProps = {
                    fullscreenChange: 'mozfullscreenchange',
                    requestFullscreen: 'mozRequestFullScreen',
                    exitFullscreen: 'mozCancelFullScreen'
                };
            }
            else if (container.webkitRequestFullScreen) {
                this.browserProps = {
                    fullscreenChange: 'webkitfullscreenchange',
                    requestFullscreen: 'webkitRequestFullScreen',
                    exitFullscreen: 'webkitExitFullscreen'
                };
            }
            else if (container.msRequestFullscreen) {
                this.browserProps = {
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
     * Stops displaying the chart in fullscreen mode.
     * Exporting module required.
     *
     * @since       8.0.1
     *
     * @function    Highcharts.Fullscreen#close
     * @return      {void}
     * @requires    modules/full-screen
     */
    Fullscreen.prototype.close = function () {
        var fullscreen = this, chart = fullscreen.chart, optionsChart = chart.options.chart;
        // Don't fire exitFullscreen() when user exited using 'Escape' button.
        if (fullscreen.isOpen &&
            fullscreen.browserProps &&
            chart.container.ownerDocument instanceof Document) {
            chart.container.ownerDocument[fullscreen.browserProps.exitFullscreen]();
        }
        // Unbind event as it's necessary only before exiting from fullscreen.
        if (fullscreen.unbindFullscreenEvent) {
            fullscreen.unbindFullscreenEvent();
        }
        chart.setSize(fullscreen.origWidth, fullscreen.origHeight, false);
        fullscreen.origWidth = void 0;
        fullscreen.origHeight = void 0;
        if (optionsChart) {
            optionsChart.width = fullscreen.origWidthOption;
            optionsChart.height = fullscreen.origHeightOption;
        }
        fullscreen.origWidthOption = void 0;
        fullscreen.origHeightOption = void 0;
        fullscreen.isOpen = false;
        fullscreen.setButtonText();
    };
    /**
     * Displays the chart in fullscreen mode.
     * When fired customly by user before exporting context button is created,
     * button's text will not be replaced - it's on the user side.
     * Exporting module required.
     *
     * @since       8.0.1
     *
     * @function Highcharts.Fullscreen#open
     * @return      {void}
     * @requires    modules/full-screen
     */
    Fullscreen.prototype.open = function () {
        var fullscreen = this, chart = fullscreen.chart, optionsChart = chart.options.chart;
        if (optionsChart) {
            fullscreen.origWidthOption = optionsChart.width;
            fullscreen.origHeightOption = optionsChart.height;
        }
        fullscreen.origWidth = chart.chartWidth;
        fullscreen.origHeight = chart.chartHeight;
        // Handle exitFullscreen() method when user clicks 'Escape' button.
        if (fullscreen.browserProps) {
            fullscreen.unbindFullscreenEvent = addEvent(chart.container.ownerDocument, // chart's document
            fullscreen.browserProps.fullscreenChange, function () {
                // Handle lack of async of browser's fullScreenChange event.
                if (fullscreen.isOpen) {
                    fullscreen.isOpen = false;
                    fullscreen.close();
                }
                else {
                    chart.setSize(null, null, false);
                    fullscreen.isOpen = true;
                    fullscreen.setButtonText();
                }
            });
            var promise = chart.renderTo[fullscreen.browserProps.requestFullscreen]();
            if (promise) {
                // No dot notation because of IE8 compatibility
                promise['catch'](function () {
                    alert(// eslint-disable-line no-alert
                    'Full screen is not supported inside a frame.');
                });
            }
            addEvent(chart, 'destroy', fullscreen.unbindFullscreenEvent);
        }
    };
    /**
     * Replaces the exporting context button's text when toogling the
     * fullscreen mode.
     *
     * @private
     *
     * @since 8.0.1
     *
     * @requires modules/full-screen
     * @return {void}
     */
    Fullscreen.prototype.setButtonText = function () {
        var _a;
        var chart = this.chart, exportDivElements = chart.exportDivElements, exportingOptions = chart.options.exporting, menuItems = (_a = exportingOptions === null || exportingOptions === void 0 ? void 0 : exportingOptions.buttons) === null || _a === void 0 ? void 0 : _a.contextButton.menuItems, lang = chart.options.lang;
        if ((exportingOptions === null || exportingOptions === void 0 ? void 0 : exportingOptions.menuItemDefinitions) && (lang === null || lang === void 0 ? void 0 : lang.exitFullscreen) &&
            lang.viewFullscreen &&
            menuItems &&
            exportDivElements &&
            exportDivElements.length) {
            AST.setElementHTML(exportDivElements[menuItems.indexOf('viewFullscreen')], !this.isOpen ?
                (exportingOptions.menuItemDefinitions.viewFullscreen.text ||
                    lang.viewFullscreen) : lang.exitFullscreen);
        }
    };
    /**
     * Toggles displaying the chart in fullscreen mode.
     * By default, when the exporting module is enabled, a context button with
     * a drop down menu in the upper right corner accesses this function.
     * Exporting module required.
     *
     * @since 8.0.1
     *
     * @sample      highcharts/members/chart-togglefullscreen/
     *              Toggle fullscreen mode from a HTML button
     *
     * @function Highcharts.Fullscreen#toggle
     * @requires    modules/full-screen
     */
    Fullscreen.prototype.toggle = function () {
        var fullscreen = this;
        if (!fullscreen.isOpen) {
            fullscreen.open();
        }
        else {
            fullscreen.close();
        }
    };
    return Fullscreen;
}());
H.Fullscreen = Fullscreen;
export default H.Fullscreen;
// Initialize fullscreen
addEvent(Chart, 'beforeRender', function () {
    /**
     * @name Highcharts.Chart#fullscreen
     * @type {Highcharts.Fullscreen}
     * @requires modules/full-screen
     */
    this.fullscreen = new H.Fullscreen(this);
});

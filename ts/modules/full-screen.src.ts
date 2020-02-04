/* *
 * (c) 2009-2020 Rafal Sebestjanski
 *
 * Full screen for Highcharts
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';

const addEvent = H.addEvent,
    Chart = H.Chart;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Chart {
            fullscreenController: FullscreenController;
            isFullscreen?: boolean;
            unbindFullscreenEvent?: Function;
        }
        class FullscreenController {
            public browserProps: {
                fullscreenChange: (
                    'fullscreenchange'|
                    'mozfullscreenchange'|
                    'webkitfullscreenchange'|
                    'MSFullscreenChange'
                );
                requestFullscreen: (
                    'msRequestFullscreen'|
                    'mozRequestFullScreen'|
                    'requestFullscreen'|
                    'webkitRequestFullScreen'
                );
                exitFullscreen: (
                    'exitFullscreen'|
                    'mozCancelFullScreen'|
                    'webkitExitFullscreen'|
                    'msExitFullscreen'
                );
            };
            public chart: Chart;
            public closeFullscreen(): void;
            public constructor(chart: Chart);
            public openFullscreen(): void;
            public setButtonText(): void;
            public toggleFullscreen(): void;
        }
    }
}

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

H.FullscreenController = function (
    this: Highcharts.FullscreenController,
    chart: Highcharts.Chart
): void {
    this.chart = chart;
} as any;

// Initialize fullscreen
addEvent(Chart, 'beforeRender', function (this: Highcharts.Chart): void {
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
    setButtonText: function (): void {
        const chart = this.chart,
            exportDivElements = chart.exportDivElements,
            exportingOptions = chart.options.exporting,
            menuItems = exportingOptions?.buttons?.contextButton.menuItems,
            lang = chart.options.lang;

        if (
            exportingOptions?.menuItemDefinitions &&
            lang?.exitFullscreen &&
            lang.viewFullscreen &&
            menuItems &&
            exportDivElements &&
            exportDivElements.length
        ) {
            exportDivElements[menuItems.indexOf('viewFullscreen')]
                .innerHTML = chart.isFullscreen ?
                    (
                        exportingOptions.menuItemDefinitions.viewFullscreen.text ||
                        lang.viewFullscreen
                    ) : lang.exitFullscreen;
        }
    },
    // Helping function - to open fullscreen, use toggleFullscreen() instead.
    openFullscreen: function (): void {
        const fullscreenController = this,
            chart = fullscreenController.chart;

        // Handle closeFullscreen() method when user clicks 'Escape' button.
        chart.unbindFullscreenEvent = H.addEvent(
            chart.container.ownerDocument, // chart's document
            fullscreenController.browserProps.fullscreenChange,
            function (): void {
                // Handle lack of async of browser's fullScreenChange event.
                if (chart.isFullscreen) {
                    chart.isFullscreen = false;
                    fullscreenController.closeFullscreen();
                } else {
                    chart.isFullscreen = true;
                }
            }
        );

        if (chart.container.parentNode instanceof Element) {
            const promise = chart.container.parentNode[
                fullscreenController.browserProps.requestFullscreen
            ]();
            if (promise) {
                promise.catch(function (): void {
                    alert( // eslint-disable-line no-alert
                        'Full screen is not supported inside a frame'
                    );
                });
            }
            fullscreenController.setButtonText();
        }

        H.addEvent(chart, 'destroy', chart.unbindFullscreenEvent);
    },
    // Helping function - to close fullscreen, use toggleFullscreen() instead.
    closeFullscreen: function (): void {
        const fullscreenController = this,
            chart = fullscreenController.chart;

        // Don't fire exitFullscreen() when user exited using 'Escape' button.
        if (
            chart.isFullscreen &&
            chart.container.ownerDocument instanceof Document
        ) {
            chart.container.ownerDocument[
                fullscreenController.browserProps.exitFullscreen
            ]();
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
    toggleFullscreen: function (): void {
        const fullscreenController = this,
            chart = fullscreenController.chart;

        if (!(chart.container.parentNode instanceof HTMLElement)) {
            return;
        }

        const container = chart.container.parentNode;

        // Hold event and methods available only for a current browser.
        if (!fullscreenController.browserProps) {
            if (typeof container.requestFullscreen === 'function') {
                fullscreenController.browserProps = {
                    fullscreenChange: 'fullscreenchange',
                    requestFullscreen: 'requestFullscreen',
                    exitFullscreen: 'exitFullscreen'
                };
            } else if (container.mozRequestFullScreen) {
                fullscreenController.browserProps = {
                    fullscreenChange: 'mozfullscreenchange',
                    requestFullscreen: 'mozRequestFullScreen',
                    exitFullscreen: 'mozCancelFullScreen'
                };
            } else if (container.webkitRequestFullScreen) {
                fullscreenController.browserProps = {
                    fullscreenChange: 'webkitfullscreenchange',
                    requestFullscreen: 'webkitRequestFullScreen',
                    exitFullscreen: 'webkitExitFullscreen'
                };
            } else if (container.msRequestFullscreen) {
                fullscreenController.browserProps = {
                    fullscreenChange: 'MSFullscreenChange',
                    requestFullscreen: 'msRequestFullscreen',
                    exitFullscreen: 'msExitFullscreen'
                };
            }
        }

        if (!chart.isFullscreen) {
            fullscreenController.openFullscreen();
        } else {
            fullscreenController.closeFullscreen();
        }
    }
} as any;

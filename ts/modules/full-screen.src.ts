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
        }
        class FullscreenController {
            public constructor(chart: Chart);
            public browserProps?: {
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
            public openFullscreen(): void;
            public toggleFullscreen(): void;
            public unbindFullscreenEvent?: Function;
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

/**
 * Handles displaying chart's container in the fullscreen mode.
 *
 * @class
 * @name Highcharts.FullscreenController
 * @hideconstructor
 * @requires modules/full-screen
 */
class FullscreenController {

    /* *
     *
     *  Constructors
     *
     * */

    /** @private */
    public constructor(chart: Highcharts.Chart) {
        /**
         * Chart managed by the fullscreen controller.
         * @name Highcharts.FullscreenController#chart
         * @type {Highcharts.Chart}
         */
        this.chart = chart;

        if (!(chart.container.parentNode instanceof HTMLElement)) {
            return;
        }

        const container = chart.container.parentNode;

        // Hold event and methods available only for a current browser.
        if (!this.browserProps) {
            if (typeof container.requestFullscreen === 'function') {
                this.browserProps = {
                    fullscreenChange: 'fullscreenchange',
                    requestFullscreen: 'requestFullscreen',
                    exitFullscreen: 'exitFullscreen'
                };
            } else if (container.mozRequestFullScreen) {
                this.browserProps = {
                    fullscreenChange: 'mozfullscreenchange',
                    requestFullscreen: 'mozRequestFullScreen',
                    exitFullscreen: 'mozCancelFullScreen'
                };
            } else if (container.webkitRequestFullScreen) {
                this.browserProps = {
                    fullscreenChange: 'webkitfullscreenchange',
                    requestFullscreen: 'webkitRequestFullScreen',
                    exitFullscreen: 'webkitExitFullscreen'
                };
            } else if (container.msRequestFullscreen) {
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
     *  Properties
     *
     * */

    public chart: Highcharts.Chart;

    /** @private */
    public browserProps: Highcharts.FullscreenController['browserProps'];

    /** @private */
    public unbindFullscreenEvent?: Function;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Stops displaying the chart in fullscreen mode.
     * Exporting module required.
     *
     * @since       next
     *
     * @function    Highcharts.FullscreenController#closeFullscreen
     * @return      {void}
     * @requires    modules/full-screen
     */
    public closeFullscreen(): void {
        const fullscreenController = this,
            chart = fullscreenController.chart;

        // Don't fire exitFullscreen() when user exited using 'Escape' button.
        if (
            chart.isFullscreen &&
            fullscreenController.browserProps &&
            chart.container.ownerDocument instanceof Document
        ) {
            chart.container.ownerDocument[
                fullscreenController.browserProps.exitFullscreen
            ]();
        }

        // Unbind event as it's necessary only before exiting from fullscreen.
        if (fullscreenController.unbindFullscreenEvent) {
            fullscreenController.unbindFullscreenEvent();
        }

        chart.isFullscreen = false;

        fullscreenController.setButtonText();
    }
    /**
     * Displays the chart in fullscreen mode.
     * When fired customly by user before exporting context button is created,
     * button's text will not be replaced - it's on the user side.
     * Exporting module required.
     *
     * @since       next
     *
     * @function Highcharts.FullscreenController#openFullscreen
     * @return      {void}
     * @requires    modules/full-screen
     */
    public openFullscreen(): void {
        const fullscreenController = this,
            chart = fullscreenController.chart;

        // Handle exitFullscreen() method when user clicks 'Escape' button.
        if (fullscreenController.browserProps) {
            fullscreenController.unbindFullscreenEvent = H.addEvent(
                chart.container.ownerDocument, // chart's document
                fullscreenController.browserProps.fullscreenChange,
                function (): void {
                    // Handle lack of async of browser's fullScreenChange event.
                    if (chart.isFullscreen) {
                        chart.isFullscreen = false;
                        fullscreenController.closeFullscreen();
                    } else {
                        chart.isFullscreen = true;
                        fullscreenController.setButtonText();
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
                            'Full screen is not supported inside a frame.'
                        );
                    });
                }
            }

            H.addEvent(chart, 'destroy', fullscreenController.unbindFullscreenEvent);
        }
    }
    /**
     * Replaces the exporting context button's text when toogling the
     * fullscreen mode.
     *
     * @private
     *
     * @since       next
     *
     * @requires modules/full-screen
     * @return {void}
     */
    private setButtonText(): void {
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
                .innerHTML = !chart.isFullscreen ?
                    (
                        exportingOptions.menuItemDefinitions.viewFullscreen.text ||
                        lang.viewFullscreen
                    ) : lang.exitFullscreen;
        }
    }
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
     * @requires    modules/full-screen
     */
    public toggleFullscreen(): void {
        const fullscreenController = this;

        if (!fullscreenController.chart.isFullscreen) {
            fullscreenController.openFullscreen();
        } else {
            fullscreenController.closeFullscreen();
        }
    }
}

H.FullscreenController = FullscreenController;

export default H.FullscreenController;

// Initialize fullscreen
addEvent(Chart, 'beforeRender', function (this: Highcharts.Chart): void {
    /**
     * @name Highcharts.Chart#fullscreenController
     * @type {Highcharts.FullscreenController}
     * @requires modules/full-screen
     */
    this.fullscreenController = new H.FullscreenController(this);
});

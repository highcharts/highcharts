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
const {
    doc
} = H;
import AST from '../Core/Renderer/HTML/AST.js';
import U from '../Core/Utilities.js';
const {
    addEvent
} = U;

declare module '../Core/Chart/ChartLike' {
    interface ChartLike {
        fullscreen: Highcharts.Fullscreen;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class Fullscreen {
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
            public close(): void;
            public isOpen: boolean;
            public open(): void;
            public origHeight?: number;
            public origHeightOption?: (number|string|null);
            public origWidth?: number;
            public origWidthOption?: (number|string|null);
            public toggle(): void;
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
class Fullscreen {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(chart: Chart) {
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

        const container = chart.renderTo;

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

    /** @private */
    public browserProps: Highcharts.Fullscreen['browserProps'];

    public chart: Chart;

    public isOpen: boolean;

    /** @private */
    public origHeight?: number;
    /** @private */
    public origHeightOption?: (number|string|null);
    /** @private */
    public origWidth?: number;
    /** @private */
    public origWidthOption?: (number|string|null);

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
     * @since       8.0.1
     *
     * @function    Highcharts.Fullscreen#close
     * @return      {void}
     * @requires    modules/full-screen
     */
    public close(): void {
        const fullscreen = this,
            chart = fullscreen.chart,
            optionsChart = chart.options.chart;

        // Don't fire exitFullscreen() when user exited using 'Escape' button.
        if (
            fullscreen.isOpen &&
            fullscreen.browserProps &&
            chart.container.ownerDocument instanceof Document
        ) {
            chart.container.ownerDocument[
                fullscreen.browserProps.exitFullscreen
            ]();
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
    }
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
    public open(): void {
        const fullscreen = this,
            chart = fullscreen.chart,
            optionsChart = chart.options.chart;

        if (optionsChart) {
            fullscreen.origWidthOption = optionsChart.width;
            fullscreen.origHeightOption = optionsChart.height;
        }
        fullscreen.origWidth = chart.chartWidth;
        fullscreen.origHeight = chart.chartHeight;

        // Handle exitFullscreen() method when user clicks 'Escape' button.
        if (fullscreen.browserProps) {
            fullscreen.unbindFullscreenEvent = addEvent(
                chart.container.ownerDocument, // chart's document
                fullscreen.browserProps.fullscreenChange,
                function (): void {
                    // Handle lack of async of browser's fullScreenChange event.
                    if (fullscreen.isOpen) {
                        fullscreen.isOpen = false;
                        fullscreen.close();
                    } else {
                        chart.setSize(null, null, false);
                        fullscreen.isOpen = true;
                        fullscreen.setButtonText();
                    }
                }
            );

            const promise = chart.renderTo[
                fullscreen.browserProps.requestFullscreen
            ]();

            if (promise) {
                // No dot notation because of IE8 compatibility
                promise['catch'](function (): void { // eslint-disable-line dot-notation
                    alert( // eslint-disable-line no-alert
                        'Full screen is not supported inside a frame.'
                    );
                });
            }

            addEvent(chart, 'destroy', fullscreen.unbindFullscreenEvent);
        }
    }
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
            AST.setElementHTML(
                exportDivElements[menuItems.indexOf('viewFullscreen')],
                !this.isOpen ?
                    (
                        exportingOptions.menuItemDefinitions.viewFullscreen.text ||
                        lang.viewFullscreen
                    ) : lang.exitFullscreen
            );
        }
    }
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
    public toggle(): void {
        const fullscreen = this;

        if (!fullscreen.isOpen) {
            fullscreen.open();
        } else {
            fullscreen.close();
        }
    }
}

H.Fullscreen = Fullscreen;

export default H.Fullscreen;

// Initialize fullscreen
addEvent(Chart, 'beforeRender', function (): void {
    /**
     * @name Highcharts.Chart#fullscreen
     * @type {Highcharts.Fullscreen}
     * @requires modules/full-screen
     */
    this.fullscreen = new H.Fullscreen(this);
});

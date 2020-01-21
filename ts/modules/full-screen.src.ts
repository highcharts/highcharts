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
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Chart {
            browserProps: {
                fullscreenChange: string;
                requestFullscreen: string;
                exitFullscreen: string;
            };
            isFullscreen?: boolean;
            /** @requires modules/full-screen */
            closeFullscreen(): void;
            /** @requires modules/full-screen */
            openFullscreen(): void;
            /** @requires modules/full-screen */
            toggleFullscreen(): void;
            unbindFullscreenEvent?: Function;
        }
        class FullScreen {
            public constructor(container: HTMLDOMElement);
            public init(container: HTMLDOMElement): void;
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

// Helping function - to open fullscreen, use toggleFullscreen() instead.
H.Chart.prototype.openFullscreen = function (this: Highcharts.Chart): void {
    const chart = this,
        menuItems = chart.options.exporting?.buttons?.contextButton.menuItems;

    // Handle closeFullscreen() method when user clicks 'Escape' button.
    chart.unbindFullscreenEvent = H.addEvent(
        chart.container.ownerDocument, // chart's document
        chart.browserProps.fullscreenChange,
        function (): void {
            // Handle lack of async of browser's fullScreenChange event.
            if (chart.isFullscreen) {
                chart.isFullscreen = false;
                chart.closeFullscreen();
            } else {
                chart.isFullscreen = true;
            }
        }
    );

    (chart as any).container.parentNode[chart.browserProps.requestFullscreen]();

    // Replace button text. When chart.toggleFullscreen() will be fired customly
    // by user before exporting context button is created, text will not be
    // replaced - it's on the user side.
    if (
        chart.exportDivElements &&
        chart.exportDivElements.length &&
        menuItems &&
        chart.options.lang &&
        chart.options.lang.exitFullscreen
    ) {
        chart.exportDivElements[menuItems.indexOf('viewFullscreen')].innerHTML =
        chart.options.lang.exitFullscreen;
    }

    H.addEvent(chart, 'destroy', chart.unbindFullscreenEvent);
};

// Helping function - to close fullscreen, use toggleFullscreen() instead.
H.Chart.prototype.closeFullscreen = function (this: Highcharts.Chart): void {
    var chart = this,
        exportingOptions = chart.options.exporting,
        exportDivElements = chart.exportDivElements,
        menuItems = exportingOptions?.buttons?.contextButton.menuItems;

    // Don't fire exitFullscreen() when user exited using 'Escape' button.
    if (chart.isFullscreen) {
        (chart as any).container.ownerDocument[chart.browserProps.exitFullscreen]();
    }

    // Replace button text.
    if (
        exportDivElements &&
        exportDivElements.length &&
        exportingOptions?.menuItemDefinitions?.viewFullscreen &&
        menuItems &&
        chart.options.lang?.viewFullscreen
    ) {
        exportDivElements[menuItems.indexOf('viewFullscreen')].innerHTML = (
            exportingOptions.menuItemDefinitions.viewFullscreen.text ||
            chart.options.lang.viewFullscreen
        );
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
H.Chart.prototype.toggleFullscreen = function (this: Highcharts.Chart): void {
    var chart = this,
        container = chart.container.parentNode as Highcharts.HTMLDOMElement;

    // Hold event and methods available only for a current browser.
    if (!chart.browserProps) {
        if (container.requestFullscreen as unknown) {
            chart.browserProps = {
                fullscreenChange: 'fullscreenchange',
                requestFullscreen: 'requestFullscreen',
                exitFullscreen: 'exitFullscreen'
            };
        } else if (container.mozRequestFullScreen) {
            chart.browserProps = {
                fullscreenChange: 'mozfullscreenchange',
                requestFullscreen: 'mozRequestFullscreen',
                exitFullscreen: 'mozCancelFullScreen'
            };
        } else if (container.webkitRequestFullscreen) {
            chart.browserProps = {
                fullscreenChange: 'webkitfullscreenchange',
                requestFullscreen: 'webkitRequestFullscreen',
                exitFullscreen: 'webkitExitFullscreen'
            };
        } else if (container.msRequestFullscreen) {
            chart.browserProps = {
                fullscreenChange: 'MSFullscreenChange',
                requestFullscreen: 'msRequestFullscreen',
                exitFullscreen: 'msExitFullscreen'
            };
        }
    }

    if (!chart.isFullscreen) {
        chart.openFullscreen();
    } else {
        chart.closeFullscreen();
    }
};

/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Rafal Sebestjanski
 *
 *  Full screen for Highcharts
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/**
 * The module allows user to enable display chart in full screen mode.
 * Used in StockTools too.
 * Based on default solutions in browsers.
 */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Chart from '../../Core/Chart/Chart';

import AST from '../../Core/Renderer/HTML/AST.js';
import H from '../../Core/Globals.js';
const { composed } = H;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartBase' {
    interface ChartBase {
        /**
         * @name Highcharts.Chart#fullscreen
         * @type {Highcharts.Fullscreen}
         * @requires modules/full-screen
         */
        fullscreen?: Fullscreen;
    }
}

declare module '../../Core/Chart/ChartOptions' {
    interface ChartEventsOptions {
        /**
         * Fires when a fullscreen is closed through the context menu item,
         * or a fullscreen is closed on the `Escape` button click,
         * or the `Chart.fullscreen.close` method.
         *
         * @sample highcharts/chart/events-fullscreen
         *         Title size change on fullscreen open
         *
         * @type      {Highcharts.FullScreenfullscreenCloseCallbackFunction}
         * @since     10.1.0
         * @context   Highcharts.Chart
         * @requires  modules/full-screen
         * @apioption chart.events.fullscreenClose
         */
        fullscreenClose?: FullScreenfullscreenCloseCallbackFunction;

        /**
         * Fires when a fullscreen is opened through the context menu item,
         * or the `Chart.fullscreen.open` method.
         *
         * @sample highcharts/chart/events-fullscreen
         *         Title size change on fullscreen open
         *
         * @type      {Highcharts.FullScreenfullscreenOpenCallbackFunction}
         * @since     10.1.0
         * @context   Highcharts.Chart
         * @requires  modules/full-screen
         * @apioption chart.events.fullscreenOpen
         */
        fullscreenOpen?: FullScreenfullscreenOpenCallbackFunction;
    }
}

/**
 * Gets fired when closing the fullscreen.
 *
 * @callback Highcharts.FullScreenfullscreenCloseCallbackFunction
 *
 * @param {Highcharts.Chart} chart
 *        The chart on which the event occurred.
 *
 * @param {global.Event} event
 *        The event that occurred.
 */
export interface FullScreenfullscreenCloseCallbackFunction {
    (chart: Chart, event: Event): void;
}

/**
 * Gets fired when opening the fullscreen.
 *
 * @callback Highcharts.FullScreenfullscreenOpenCallbackFunction
 *
 * @param {Highcharts.Chart} chart
 *        The chart on which the event occurred.
 *
 * @param {global.Event} event
 *        The event that occurred.
 */
export interface FullScreenfullscreenOpenCallbackFunction {
    (chart: Chart, event: Event): void;
}

/* *
 *
 *  Functions
 *
 * */

/** @internal */
function onChartBeforeRender(
    this: Chart
): void {
    /**
     * @name Highcharts.Chart#fullscreen
     * @type {Highcharts.Fullscreen}
     * @requires modules/full-screen
     */
    this.fullscreen = new Fullscreen(this);
}

/** @internal */
const scrollBottomTolerance = 2;

/** @internal */
const scrollRestoreDuration = 900;

/* *
 *
 *  Class
 *
 * */

/**
 * Handles displaying chart's container in the fullscreen mode.
 *
 * **Note**: Fullscreen is not supported on iPhone due to iOS limitations.
 *
 * @class
 * @name Highcharts.Fullscreen
 *
 * @param {Highcharts.Chart} chart
 *
 * @requires modules/exporting
 */
class Fullscreen {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Prepares the chart class to support fullscreen.
     *
     * @internal
     * @param {typeof_Highcharts.Chart} ChartClass
     * The chart class to decorate with fullscreen support.
     */
    public static compose(
        ChartClass: typeof Chart
    ): void {

        if (pushUnique(composed, 'Fullscreen')) {
            // Initialize fullscreen
            addEvent(ChartClass, 'beforeRender', onChartBeforeRender);
        }

    }

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
         * @type {boolean | undefined}
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

    /** @internal */
    public browserProps?: Fullscreen.BrowserProperties;

    /**
     * Chart managed by the fullscreen controller.
     * @name Highcharts.Fullscreen#chart
     * @type {Highcharts.Chart}
     */
    public chart: Chart;

    /**
     * The flag is set to `true` when the chart is displayed in
     * the fullscreen mode.
     *
     * @name Highcharts.Fullscreen#isOpen
     * @type {boolean | undefined}
     * @since 8.0.1
     */
    public isOpen: boolean;

    /** @internal */
    public origHeight?: number;

    /** @internal */
    public origHeightOption?: (number | string | null);

    /** @internal */
    public origWidth?: number;

    /** @internal */
    public origWidthOption?: (number | null);

    /** @internal */
    public restoreScrollRAF?: number;

    /** @internal */
    public restoreScrollTop?: number;

    /** @internal */
    public restoreScrollWasAtBottom?: boolean;

    /** @internal */
    public restoreScrollWasBlurred?: boolean;

    /** @internal */
    public restoreScrollUntil?: number;

    /** @internal */
    public unbindScrollRestore?: Function;

    /** @internal */
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

        fireEvent(chart, 'fullscreenClose', void 0, function (): void {

            // Don't fire exitFullscreen() when user exited
            // using 'Escape' button.
            if (
                fullscreen.isOpen &&
                fullscreen.browserProps &&
                chart.container.ownerDocument instanceof Document
            ) {
                chart.container.ownerDocument[
                    fullscreen.browserProps.exitFullscreen
                ]();
            }

            // Unbind event as it's necessary only before exiting
            // from fullscreen.
            if (fullscreen.unbindFullscreenEvent) {
                fullscreen.unbindFullscreenEvent = fullscreen
                    .unbindFullscreenEvent();
            }

            chart.setSize(fullscreen.origWidth, fullscreen.origHeight, false);
            fullscreen.origWidth = void 0;
            fullscreen.origHeight = void 0;

            optionsChart.width = fullscreen.origWidthOption;
            optionsChart.height = fullscreen.origHeightOption;

            fullscreen.origWidthOption = void 0;
            fullscreen.origHeightOption = void 0;

            fullscreen.isOpen = false;

            fullscreen.setButtonText();
            fullscreen.restoreScrollPosition();

        });
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

        fireEvent(chart, 'fullscreenOpen', void 0, function (): void {

            if (optionsChart) {
                fullscreen.origWidthOption = optionsChart.width;
                fullscreen.origHeightOption = optionsChart.height;
            }
            fullscreen.origWidth = chart.chartWidth;
            fullscreen.origHeight = chart.chartHeight;
            fullscreen.saveScrollPosition();

            // Handle exitFullscreen() method when user clicks 'Escape' button.
            if (fullscreen.browserProps) {
                const unbindChange = addEvent(
                    chart.container.ownerDocument, // Chart's document
                    fullscreen.browserProps.fullscreenChange,
                    function (): void {
                        // Handle lack of async of browser's
                        // fullScreenChange event.
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

                const unbindDestroy = addEvent(chart, 'destroy', unbindChange);

                fullscreen.unbindFullscreenEvent = (): void => {
                    unbindChange();
                    unbindDestroy();
                };

                const promise = chart.renderTo[
                    fullscreen.browserProps.requestFullscreen
                ]();

                if (promise) {
                    promise['catch'](function (): void { // eslint-disable-line dot-notation
                        alert( // eslint-disable-line no-alert
                            'Full screen is not supported inside a frame.'
                        );
                    });
                }
            }

        });
    }

    /**
     * Replaces the exporting context button's text when toggling the
     * fullscreen mode.
     *
     * @internal
     *
     * @since 8.0.1
     *
     * @requires modules/full-screen
     */
    private setButtonText(): void {
        const chart = this.chart,
            exportDivElements = chart.exporting?.divElements,
            exportingOptions = chart.options.exporting,
            menuItems = (
                exportingOptions &&
                exportingOptions.buttons &&
                exportingOptions.buttons.contextButton.menuItems
            ),
            lang = chart.options.lang;

        if (
            exportingOptions?.menuItemDefinitions &&
            lang?.exitFullscreen &&
            lang.viewFullscreen &&
            menuItems &&
            exportDivElements
        ) {
            const exportDivElement = exportDivElements[
                menuItems.indexOf('viewFullscreen')
            ];
            if (exportDivElement) {
                AST.setElementHTML(
                    exportDivElement,
                    !this.isOpen ?
                        (
                            exportingOptions.menuItemDefinitions.viewFullscreen
                                ?.textKey ||
                            lang.viewFullscreen
                        ) : lang.exitFullscreen
                );
            }
        }
    }

    /**
     * Gets vertical scroll position and maximum available scroll.
     *
     * @private
     * @return {Highcharts.FullscreenScrollPosition|undefined}
     * Current vertical scroll data.
     */
    private getScrollPosition():
    (Fullscreen.ScrollPosition|undefined) {
        const doc = this.chart.container.ownerDocument,
            win = doc.defaultView;

        if (!win) {
            return;
        }

        const scrollingElement = (doc.scrollingElement || doc.documentElement),
            maxY = Math.max(0, scrollingElement.scrollHeight - win.innerHeight);

        return {
            maxY,
            y: win.scrollY
        };
    }

    /**
     * Saves scroll position before entering fullscreen mode.
     *
     * @private
     * @return {void}
     */
    private saveScrollPosition(): void {
        const position = this.getScrollPosition();

        this.stopScrollRestore();

        if (!position) {
            return;
        }

        this.restoreScrollTop = position.y;
        this.restoreScrollWasAtBottom = (
            position.maxY - position.y <= scrollBottomTolerance
        );
    }

    /**
     * Restores scroll position after exiting fullscreen mode.
     *
     * @private
     * @return {void}
     */
    private restoreScrollPosition(): void {
        const fullscreen = this,
            chart = fullscreen.chart,
            doc = chart.container.ownerDocument,
            win = doc.defaultView,
            originalY = fullscreen.restoreScrollTop;

        if (
            !win ||
            typeof originalY !== 'number'
        ) {
            return;
        }

        fullscreen.stopScrollRestore();

        const tick = (): void => {
            const position = fullscreen.getScrollPosition();

            if (!position || !win) {
                fullscreen.stopScrollRestore();
                return;
            }

            const targetY = fullscreen.restoreScrollWasAtBottom ?
                position.maxY :
                Math.min(originalY, position.maxY);

            win.scrollTo(0, targetY);

            if (Date.now() < (fullscreen.restoreScrollUntil || 0)) {
                fullscreen.restoreScrollRAF = win.requestAnimationFrame(tick);
            } else {
                fullscreen.stopScrollRestore();
            }
        };

        const bump = (): void => {
            // 900ms should be enough to restore scroll position after exiting
            // fullscreen, even if browser fires scroll event with a delay
            // (e.g. Safari).
            fullscreen.restoreScrollUntil = Date.now() + scrollRestoreDuration;
            if (!fullscreen.restoreScrollRAF) {
                fullscreen.restoreScrollRAF = win.requestAnimationFrame(tick);
            }
        };

        const blur = (): void => {
            if (fullscreen.restoreScrollWasBlurred) {
                return;
            }
            const activeElement = doc.activeElement;
            if (
                activeElement instanceof HTMLElement &&
                chart.renderTo.contains(activeElement)
            ) {
                activeElement.blur();
            }
            fullscreen.restoreScrollWasBlurred = true;
        };

        const stopOnUserScroll = (
            e: Event
        ): void => {
            const event = e as KeyboardEvent;
            if (
                event.type !== 'keydown' ||
                (
                    event.key === 'ArrowDown' ||
                    event.key === 'ArrowUp' ||
                    event.key === 'PageDown' ||
                    event.key === 'PageUp' ||
                    event.key === 'Home' ||
                    event.key === 'End' ||
                    event.key === ' '
                )
            ) {
                fullscreen.stopScrollRestore();
            }
        };

        const unbindResize = addEvent(win, 'resize', bump),
            unbindFocusin = addEvent(doc, 'focusin', bump),
            unbindWheel = addEvent(win, 'wheel', stopOnUserScroll),
            unbindTouchMove = addEvent(win, 'touchmove', stopOnUserScroll),
            unbindKeyDown = addEvent(doc, 'keydown', stopOnUserScroll),
            unbindDestroy = addEvent(chart, 'destroy', (): void => {
                fullscreen.stopScrollRestore();
            }),
            unbindViewport = (
                win.visualViewport &&
                addEvent(win.visualViewport as any, 'resize', bump)
            );

        fullscreen.unbindScrollRestore = (): void => {
            unbindResize();
            unbindFocusin();
            unbindWheel();
            unbindTouchMove();
            unbindKeyDown();
            unbindDestroy();
            if (unbindViewport) {
                unbindViewport();
            }
        };

        fullscreen.restoreScrollWasBlurred = false;
        blur();
        bump();
    }

    /**
     * Stops pending scroll restoration.
     *
     * @private
     * @return {void}
     */
    private stopScrollRestore(): void {
        const win = this.chart.container.ownerDocument.defaultView;

        if (win && this.restoreScrollRAF) {
            win.cancelAnimationFrame(this.restoreScrollRAF);
        }

        this.restoreScrollRAF = 0;
        this.restoreScrollWasBlurred = false;
        this.restoreScrollUntil = void 0;

        if (this.unbindScrollRestore) {
            this.unbindScrollRestore = this.unbindScrollRestore();
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

/* *
 *
 *  Class Namespace
 *
 * */

/** @internal */
namespace Fullscreen {

    /* *
     *
     *  Declarations
     *
     * */

    export interface BrowserProperties {
        fullscreenChange: (
            'fullscreenchange' |
            'mozfullscreenchange' |
            'webkitfullscreenchange' |
            'MSFullscreenChange'
        );
        requestFullscreen: (
            'msRequestFullscreen' |
            'mozRequestFullScreen' |
            'requestFullscreen' |
            'webkitRequestFullScreen'
        );
        exitFullscreen: (
            'exitFullscreen' |
            'mozCancelFullScreen' |
            'webkitExitFullscreen' |
            'msExitFullscreen'
        );
    }

    export interface ScrollPosition {
        maxY: number;
        y: number;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Fullscreen;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Gets fired when closing the fullscreen.
 *
 * @callback Highcharts.FullScreenfullscreenCloseCallbackFunction
 *
 * @param {Highcharts.Chart} chart
 *        The chart on which the event occurred.
 *
 * @param {global.Event} event
 *        The event that occurred.
 */

/**
 * Gets fired when opening the fullscreen.
 *
 * @callback Highcharts.FullScreenfullscreenOpenCallbackFunction
 *
 * @param {Highcharts.Chart} chart
 *        The chart on which the event occurred.
 *
 * @param {global.Event} event
 *        The event that occurred.
 */

(''); // Keeps doclets above separated from following code

/* *
 *
 *  API Options
 *
 * */

/**
 * Fires when a fullscreen is closed through the context menu item,
 * or a fullscreen is closed on the `Escape` button click,
 * or the `Chart.fullscreen.close` method.
 *
 * @sample highcharts/chart/events-fullscreen
 *         Title size change on fullscreen open
 *
 * @type      {Highcharts.FullScreenfullscreenCloseCallbackFunction}
 * @since     10.1.0
 * @context   Highcharts.Chart
 * @requires  modules/full-screen
 * @apioption chart.events.fullscreenClose
 */

/**
 * Fires when a fullscreen is opened through the context menu item,
 * or the `Chart.fullscreen.open` method.
 *
 * @sample highcharts/chart/events-fullscreen
 *         Title size change on fullscreen open
 *
 * @type      {Highcharts.FullScreenfullscreenOpenCallbackFunction}
 * @since     10.1.0
 * @context   Highcharts.Chart
 * @requires  modules/full-screen
 * @apioption chart.events.fullscreenOpen
 */

(''); // Keeps doclets above in transpiled file

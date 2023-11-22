/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Chart from '../../Core/Chart/Chart';

import type Navigator from './Navigator';
import type Scrollbar from '../Scrollbar/Scrollbar';
import type Series from '../../Core/Series/Series';

import H from '../../Core/Globals.js';
const { isTouchDevice } = H;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    merge,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        navigator?: Navigator;
        scrollbar?: Scrollbar;
        scroller?: Navigator;
    }
}

declare module '../../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        'navigator-handle': SymbolFunction;
    }
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        baseSeries?: Series;
        navigatorSeries?: Series;
    }
}

/* *
 *
 *  Constants
 *
 * */

const composedMembers: Array<unknown> = [];

/* *
 *
 *  Variables
 *
 * */

let NavigatorConstructor: typeof Navigator;

/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 */
function compose(ChartClass: typeof Chart, NavigatorClass: typeof Navigator): void {

    if (U.pushUnique(composedMembers, ChartClass)) {
        const chartProto = ChartClass.prototype;
        NavigatorConstructor = NavigatorClass;

        chartProto.callbacks.push(onChartCallback);

        addEvent(ChartClass, 'afterAddSeries', onChartAfterAddSeries);
        addEvent(ChartClass, 'afterSetChartSize', onChartAfterSetChartSize);
        addEvent(ChartClass, 'afterUpdate', onChartAfterUpdate);
        addEvent(ChartClass, 'beforeRender', onChartBeforeRender);
        addEvent(ChartClass, 'beforeShowResetZoom', onChartBeforeShowResetZoom);
        addEvent(ChartClass, 'update', onChartUpdate);
    }
}

/**
 * Handle adding new series.
 * @private
 */
function onChartAfterAddSeries(
    this: Chart
): void {
    if (this.navigator) {
        // Recompute which series should be shown in navigator, and add them
        this.navigator.setBaseSeries(null as any, false);
    }
}

/**
 * For stock charts, extend the Chart.setChartSize method so that we can set the
 * final top position of the navigator once the height of the chart, including
 * the legend, is determined. #367. We can't use Chart.getMargins, because
 * labels offsets are not calculated yet.
 * @private
 */
function onChartAfterSetChartSize(
    this: Chart
): void {
    const legend = this.legend,
        navigator = this.navigator;

    let legendOptions,
        xAxis,
        yAxis;

    if (navigator) {
        legendOptions = legend && legend.options;
        xAxis = navigator.xAxis;
        yAxis = navigator.yAxis;
        const {
            scrollbarHeight,
            scrollButtonSize
        } = navigator;

        // Compute the top position
        if (this.inverted) {
            navigator.left = navigator.opposite ?
                this.chartWidth - scrollbarHeight -
                    navigator.height :
                this.spacing[3] + scrollbarHeight;
            navigator.top = this.plotTop + scrollButtonSize;
        } else {
            navigator.left = pick(
                xAxis.left,
                this.plotLeft + scrollButtonSize
            );
            navigator.top = (navigator.navigatorOptions.top as any) ||
                this.chartHeight -
                navigator.height -
                scrollbarHeight -
                (this.scrollbar?.options.margin || 0) -
                this.spacing[2] -
                (
                    this.rangeSelector && this.extraBottomMargin ?
                        this.rangeSelector.getHeight() :
                        0
                ) -
                (
                    (
                        legendOptions &&
                        legendOptions.verticalAlign === 'bottom' &&
                        legendOptions.layout !== 'proximate' && // #13392
                        legendOptions.enabled &&
                        !legendOptions.floating
                    ) ?
                        legend.legendHeight +
                        pick(legendOptions.margin, 10) :
                        0
                ) -
                (
                    this.titleOffset ? this.titleOffset[2] : 0
                );
        }

        if (xAxis && yAxis) { // false if navigator is disabled (#904)

            if (this.inverted) {
                xAxis.options.left = yAxis.options.left = navigator.left;
            } else {
                xAxis.options.top = yAxis.options.top = navigator.top;
            }

            xAxis.setAxisSize();
            yAxis.setAxisSize();
        }
    }
}

/**
 * Initialize navigator, if no scrolling exists yet.
 * @private
 */
function onChartAfterUpdate(
    this: Chart,
    event: Chart.AfterUpdateEventObject
): void {

    if (!this.navigator && !this.scroller &&
        ((this.options.navigator as any).enabled ||
        (this.options.scrollbar as any).enabled)
    ) {
        this.scroller = this.navigator = new NavigatorConstructor(this);

        if (pick(event.redraw, true)) {
            this.redraw(event.animation); // #7067
        }
    }

}

/**
 * Initialize navigator for stock charts
 * @private
 */
function onChartBeforeRender(
    this: Chart
): void {
    const options = this.options;

    if ((options.navigator as any).enabled ||
        (options.scrollbar as any).enabled
    ) {
        this.scroller = this.navigator = new NavigatorConstructor(this);
    }
}

/**
 * For Stock charts. For x only zooming, do not to create the zoom button
 * because X axis zooming is already allowed by the Navigator and Range
 * selector. (#9285)
 * @private
 */
function onChartBeforeShowResetZoom(
    this: Chart
): (boolean|undefined) {
    const chartOptions = this.options,
        navigator = chartOptions.navigator,
        rangeSelector = chartOptions.rangeSelector;

    if (((navigator && navigator.enabled) ||
        (rangeSelector && rangeSelector.enabled)) &&
        ((!isTouchDevice &&
        this.zooming.type === 'x') ||
        (isTouchDevice && this.zooming.pinchType === 'x'))
    ) {
        return false;
    }
}

/**
 * @private
 */
function onChartCallback(
    chart: Chart
): void {
    const navigator = chart.navigator;

    // Initialize the navigator
    if (navigator && chart.xAxis[0]) {
        const extremes = chart.xAxis[0].getExtremes();
        navigator.render(extremes.min, extremes.max);
    }
}

/**
 * Merge options, if no scrolling exists yet
 * @private
 */
function onChartUpdate(
    this: Chart,
    e: Chart
): void {

    const navigatorOptions = (e.options.navigator || {}),
        scrollbarOptions = (e.options.scrollbar || {});

    if (!this.navigator && !this.scroller &&
        (navigatorOptions.enabled || scrollbarOptions.enabled)
    ) {
        merge(true, this.options.navigator, navigatorOptions);
        merge(true, this.options.scrollbar, scrollbarOptions);
        delete e.options.navigator;
        delete e.options.scrollbar;
    }

}


/* *
 *
 *  Default Export
 *
 * */

const ChartNavigatorComposition = {
    compose
};

export default ChartNavigatorComposition;

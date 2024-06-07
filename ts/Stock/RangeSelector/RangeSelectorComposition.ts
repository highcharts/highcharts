/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import type Axis from '../../Core/Axis/Axis';
import type Chart from '../../Core/Chart/Chart';
import type RangeSelector from './RangeSelector';
import type Time from '../../Core/Time';
import D from '../../Core/Defaults.js';
const { defaultOptions } = D;
import H from '../../Core/Globals.js';
const { composed } = H;
import RangeSelectorDefaults from './RangeSelectorDefaults.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    defined,
    extend,
    isNumber,
    merge,
    pick,
    pushUnique
} = U;

/* *
 *
 *  Constants
 *
 * */

const chartDestroyEvents: Array<[Chart, Array<Function>]> = [];

/* *
 *
 *  Variables
 *
 * */

let RangeSelectorConstructor: typeof RangeSelector;

/* *
 *
 *  Functions
 *
 * */

/**
 * Get the axis min value based on the range option and the current max. For
 * stock charts this is extended via the {@link RangeSelector} so that if the
 * selected range is a multiple of months or years, it is compensated for
 * various month lengths.
 *
 * @private
 * @function Highcharts.Axis#minFromRange
 * @return {number|undefined}
 *         The new minimum value.
 */
function axisMinFromRange(
    this: Axis
): (number|undefined) {
    const rangeOptions = this.range,
        type = (rangeOptions as any).type,
        max = this.max as any,
        time = this.chart.time,
        // Get the true range from a start date
        getTrueRange = function (base: number, count: number): number {
            const timeName: Time.TimeUnitValue = type === 'year' ?
                'FullYear' : 'Month';
            const date = new time.Date(base);
            const basePeriod = time.get(timeName, date);

            time.set(timeName, date, basePeriod + count);

            if (basePeriod === time.get(timeName, date)) {
                time.set('Date', date, 0); // #6537
            }

            return date.getTime() - base;
        };

    let min,
        range;

    if (isNumber(rangeOptions)) {
        min = max - rangeOptions;
        range = rangeOptions;
    } else if (rangeOptions) {
        min = max + getTrueRange(max, -(rangeOptions.count || 1));

        // Let the fixedRange reflect initial settings (#5930)
        if (this.chart) {
            this.chart.setFixedRange(max - min);
        }
    }

    const dataMin = pick(this.dataMin, Number.MIN_VALUE);

    if (!isNumber(min)) {
        min = dataMin;
    }

    if (min <= dataMin) {
        min = dataMin;
        if (typeof range === 'undefined') { // #4501
            range = getTrueRange(min, (rangeOptions as any).count);
        }
        this.newMax = Math.min(
            min + range,
            pick(this.dataMax, Number.MAX_VALUE)
        );
    }

    if (!isNumber(max)) {
        min = void 0;
    } else if (
        !isNumber(rangeOptions) &&
        rangeOptions &&
        rangeOptions._offsetMin
    ) {
        min += rangeOptions._offsetMin;
    }

    return min;
}

/**
 * @private
 */
function compose(
    AxisClass: typeof Axis,
    ChartClass: typeof Chart,
    RangeSelectorClass: typeof RangeSelector
): void {

    RangeSelectorConstructor = RangeSelectorClass;

    if (pushUnique(composed, 'RangeSelector')) {
        const chartProto = ChartClass.prototype;

        AxisClass.prototype.minFromRange = axisMinFromRange;

        addEvent(ChartClass, 'afterGetContainer', createRangeSelector);
        addEvent(ChartClass, 'beforeRender', onChartBeforeRender);
        addEvent(ChartClass, 'destroy', onChartDestroy);
        addEvent(ChartClass, 'getMargins', onChartGetMargins);
        addEvent(ChartClass, 'redraw', redrawRangeSelector);
        addEvent(ChartClass, 'update', onChartUpdate);

        chartProto.callbacks.push(redrawRangeSelector);

        extend(
            defaultOptions,
            { rangeSelector: RangeSelectorDefaults.rangeSelector }
        );
        extend(
            defaultOptions.lang,
            RangeSelectorDefaults.lang
        );
    }

}

/**
 * Initialize rangeselector for stock charts
 * @private
 */
function createRangeSelector(
    this: Chart
): void {
    if (
        this.options.rangeSelector &&
        this.options.rangeSelector.enabled
    ) {
        this.rangeSelector = new RangeSelectorConstructor(this);
    }
}

/**
 * @private
 */
function onChartBeforeRender(
    this: Chart
): void {
    const chart = this,
        rangeSelector = chart.rangeSelector;

    if (rangeSelector) {
        if (isNumber(rangeSelector.deferredYTDClick)) {
            rangeSelector.clickButton(rangeSelector.deferredYTDClick);
            delete rangeSelector.deferredYTDClick;
        }

        const verticalAlign = rangeSelector.options.verticalAlign;

        if (!rangeSelector.options.floating) {
            if (verticalAlign === 'bottom') {
                this.extraBottomMargin = true;
            } else if (verticalAlign !== 'middle') {
                this.extraTopMargin = true;
            }
        }
    }

}
function redrawRangeSelector(this: Chart): void {
    const chart = this;
    const rangeSelector = this.rangeSelector;
    if (!rangeSelector) {
        return;
    }
    let alignTo;
    const extremes = chart.xAxis[0].getExtremes();
    const legend = chart.legend;
    const verticalAlign = (
        rangeSelector &&
            rangeSelector.options.verticalAlign
    );

    if (isNumber(extremes.min)) {
        rangeSelector.render(extremes.min, extremes.max);
    }

    // Re-align the legend so that it's below the rangeselector
    if (
        legend.display &&
            verticalAlign === 'top' &&
            verticalAlign === legend.options.verticalAlign
    ) {
        // Create a new alignment box for the legend.
        alignTo = merge(chart.spacingBox);
        if (legend.options.layout === 'vertical') {
            alignTo.y = chart.plotTop;
        } else {
            alignTo.y += rangeSelector.getHeight();
        }
        legend.group.placed = false; // Don't animate the alignment.
        legend.align(alignTo);
    }

}

/**
 * Remove resize/afterSetExtremes at chart destroy.
 * @private
 */
function onChartDestroy(
    this: Chart
): void {
    for (let i = 0, iEnd = chartDestroyEvents.length; i < iEnd; ++i) {
        const events = chartDestroyEvents[i];
        if (events[0] === this) {
            events[1].forEach((unbind: Function): void => unbind());
            chartDestroyEvents.splice(i, 1);
            return;
        }
    }
}

/**
 *
 */
function onChartGetMargins(
    this: Chart
): void {
    const rangeSelector = this.rangeSelector;

    if (rangeSelector && rangeSelector.options?.enabled) {
        const rangeSelectorHeight = rangeSelector.getHeight();

        const verticalAlign = rangeSelector.options.verticalAlign;

        if (!rangeSelector.options.floating) {
            if (verticalAlign === 'bottom') {
                (this.marginBottom as any) += rangeSelectorHeight;
            } else if (verticalAlign !== 'middle') {
                this.plotTop += rangeSelectorHeight;
            }
        }
    }
}

/**
 * @private
 */
function onChartUpdate(
    this: Chart,
    e: Chart
): void {
    const chart = this,
        options = e.options,
        optionsRangeSelector = options.rangeSelector,
        extraBottomMarginWas = this.extraBottomMargin,
        extraTopMarginWas = this.extraTopMargin;

    let rangeSelector = chart.rangeSelector;

    if (
        optionsRangeSelector &&
        optionsRangeSelector.enabled &&
        !defined(rangeSelector) &&
        this.options.rangeSelector
    ) {
        this.options.rangeSelector.enabled = true;
        this.rangeSelector = rangeSelector = new RangeSelectorConstructor(this);
    }

    this.extraBottomMargin = false;
    this.extraTopMargin = false;

    if (rangeSelector) {

        const verticalAlign = (
            optionsRangeSelector &&
            optionsRangeSelector.verticalAlign
        ) || (
            rangeSelector.options && rangeSelector.options.verticalAlign
        );

        if (!rangeSelector.options.floating) {
            if (verticalAlign === 'bottom') {
                this.extraBottomMargin = true;
            } else if (verticalAlign !== 'middle') {
                this.extraTopMargin = true;
            }
        }

        if (
            this.extraBottomMargin !== extraBottomMarginWas ||
            this.extraTopMargin !== extraTopMarginWas
        ) {
            this.isDirtyBox = true;
        }

    }

}

/* *
 *
 *  Default Export
 *
 * */

const RangeSelectorComposition = {
    compose
};

export default RangeSelectorComposition;

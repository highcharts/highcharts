/* *
 *
 *  Plugin for displaying a message when there is no data visible in chart.
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Oystein Moseng
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { NoDataOptions } from './NoDataOptions';
import type { Options } from '../../Core/Options';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import AST from '../../Core/Renderer/HTML/AST.js';
import Chart from '../../Core/Chart/Chart.js';
import NoDataDefaults from './NoDataDefaults.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    extend,
    merge
} = U;

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module '../../Core/Chart/ChartBase' {
    interface ChartBase {
        /**
         * The no-data label instance.
         *
         * @internal
         * @requires modules/no-data-to-display
         */
        noDataLabel?: SVGElement;

        /**
         * Display a no-data message.
         *
         * @internal
         * @requires modules/no-data-to-display
         */
        showNoData(str?: string): void;

        /**
         * Hide the no-data message.
         *
         * @internal
         * @requires modules/no-data-to-display
         */
        hideNoData(): void;

        /**
         * Whether the chart has visible data.
         *
         * @internal
         * @requires modules/no-data-to-display
         */
        hasData(): (boolean|undefined);
    }
}

/** @internal */
declare module '../../Core/Options' {
    interface LangOptions {
        /**
         * The text to display when the chart contains no data.
         *
         * @since    3.0.8
         * @requires modules/no-data-to-display
         * @default 'No data to display'
         */
        noData?: string;
    }
    interface Options {
        /**
         * Options for displaying a message like "No data to display".
         *
         * @since        3.0.8
         * @requires     modules/no-data-to-display
         * @optionparent noData
         */
        noData?: NoDataOptions;
    }
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Returns true if there are data points within the plot area now.
 *
 * @internal
 * @function Highcharts.Chart#hasData
 * @return {boolean|undefined}
 * True, if there are data points.
 * @requires modules/no-data-to-display
 */
function chartHasData(
    this: Chart
): (boolean|undefined) {
    const chart = this,
        series = chart.series || [];

    let i = series.length;

    while (i--) {
        if (series[i].hasData() && !series[i].options.isInternal) {
            return true;
        }
    }

    return chart.loadingShown; // #4588
}


/**
 * Hide no-data message.
 *
 * @internal
 * @function Highcharts.Chart#hideNoData
 * @return {void}
 * @requires modules/no-data-to-display
 */
function chartHideNoData(
    this: Chart
): void {
    const chart = this;

    if (chart.noDataLabel) {
        chart.noDataLabel = chart.noDataLabel.destroy();
    }
}

/**
 * Display a no-data message.
 * @internal
 * @function Highcharts.Chart#showNoData
 * @param {string} [str]
 * An optional message to show in place of the default one
 * @return {void}
 * @requires modules/no-data-to-display
 */
function chartShowNoData(
    this: Chart,
    str?: string
): void {
    const chart = this,
        options = chart.options,
        text = str || (options && options.lang.noData) || '',
        noDataOptions: NoDataOptions =
            options && (options.noData || {});

    if (chart.renderer) { // Meaning chart is not destroyed

        if (!chart.noDataLabel) {
            chart.noDataLabel = chart.renderer
                .label(
                    text,
                    0,
                    0,
                    void 0,
                    void 0,
                    void 0,
                    noDataOptions.useHTML,
                    void 0,
                    'no-data'
                )
                .add();
        }

        if (!chart.styledMode) {
            chart.noDataLabel
                .attr(AST.filterUserAttributes(noDataOptions.attr || {}))
                .css(noDataOptions.style || {});
        }

        chart.noDataLabel.align(
            extend(chart.noDataLabel.getBBox(), noDataOptions.position || {}),
            false,
            'plotBox'
        );
    }
}

/** @internal */
function compose(
    ChartClass: typeof Chart,
    highchartsDefaultOptions: Options
): void {
    const chartProto = ChartClass.prototype;

    if (!chartProto.showNoData) {
        chartProto.hasData = chartHasData;
        chartProto.hideNoData = chartHideNoData;
        chartProto.showNoData = chartShowNoData;

        addEvent(ChartClass, 'render', onChartRender);

        merge(true, highchartsDefaultOptions, NoDataDefaults);
    }

}

/**
 * Add event listener to handle automatic show or hide no-data message.
 * @internal
 */
function onChartRender(
    this: Chart
): void {
    const chart = this;

    if (chart.hasData()) {
        chart.hideNoData();
    } else {
        chart.showNoData();
    }
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
const NoDataToDisplay = {
    compose
};

/** @internal */
export default NoDataToDisplay;

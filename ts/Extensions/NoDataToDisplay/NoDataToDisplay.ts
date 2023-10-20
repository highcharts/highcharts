/* *
 *
 *  Plugin for displaying a message when there is no data visible in chart.
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Oystein Moseng
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

import type NoDataOptions from './NoDataOptions';
import type Options from '../../Core/Options';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import AST from '../../Core/Renderer/HTML/AST.js';
import Chart from '../../Core/Chart/Chart.js';
import NoDataDefaults from './NoDataDefaults.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    extend,
    merge,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartLike' {
    interface ChartLike {
        noDataLabel?: SVGElement;
        /** @requires modules/no-data-to-display */
        showNoData(str?: string): void;
        /** @requires modules/no-data-to-display */
        hideNoData(): void;
        /** @requires modules/no-data-to-display */
        hasData(): (boolean|undefined);
    }
}

declare module '../../Core/Options'{
    interface LangOptions {
        noData?: string;
    }
    interface Options {
        noData?: NoDataOptions;
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
 *  Functions
 *
 * */

/**
 * Returns true if there are data points within the plot area now.
 *
 * @private
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
 * @private
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
 * @private
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

/** @private */
function compose(
    ChartClass: typeof Chart,
    highchartsDefaultOptions: Options
): void {

    if (pushUnique(composedMembers, ChartClass)) {
        const chartProto = ChartClass.prototype;

        chartProto.hasData = chartHasData;
        chartProto.hideNoData = chartHideNoData;
        chartProto.showNoData = chartShowNoData;

        addEvent(ChartClass, 'render', onChartRender);
    }

    if (pushUnique(composedMembers, highchartsDefaultOptions)) {
        merge(true, highchartsDefaultOptions, NoDataDefaults);
    }

}

/**
 * Add event listener to handle automatic show or hide no-data message.
 * @private
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

const NoDataToDisplay = {
    compose
};

export default NoDataToDisplay;

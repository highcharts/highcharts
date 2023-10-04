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

import type NoDataOptions from './NoDataToDisplay/NoDataOptions';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';

import AST from '../Core/Renderer/HTML/AST.js';
import Chart from '../Core/Chart/Chart.js';
import D from '../Core/Defaults.js';
const { setOptions } = D;
import NoDataDefaults from './NoDataToDisplay/NoDataDefaults.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    extend
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Chart/ChartLike' {
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

declare module '../Core/Options'{
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

const chartPrototype = Chart.prototype;

setOptions(NoDataDefaults);

/**
 * Display a no-data message.
 * @private
 * @function Highcharts.Chart#showNoData
 * @param {string} [str]
 * An optional message to show in place of the default one
 * @return {void}
 * @requires modules/no-data-to-display
 */
chartPrototype.showNoData = function (str?: string): void {
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
};


/**
 * Hide no-data message.
 *
 * @private
 * @function Highcharts.Chart#hideNoData
 * @return {void}
 * @requires modules/no-data-to-display
 */
chartPrototype.hideNoData = function (): void {
    const chart = this;

    if (chart.noDataLabel) {
        chart.noDataLabel = chart.noDataLabel.destroy();
    }
};

/**
 * Returns true if there are data points within the plot area now.
 *
 * @private
 * @function Highcharts.Chart#hasData
 * @return {boolean|undefined}
 * True, if there are data points.
 * @requires modules/no-data-to-display
 */
chartPrototype.hasData = function (): (boolean|undefined) {
    let chart = this,
        series = chart.series || [],
        i = series.length;

    while (i--) {
        if (series[i].hasData() && !series[i].options.isInternal) {
            return true;
        }
    }

    return chart.loadingShown; // #4588
};

/* eslint-disable no-invalid-this */

// Add event listener to handle automatic show or hide no-data message.
addEvent(Chart, 'render', function handleNoData(): void {
    if (this.hasData()) {
        this.hideNoData();
    } else {
        this.showNoData();
    }
});

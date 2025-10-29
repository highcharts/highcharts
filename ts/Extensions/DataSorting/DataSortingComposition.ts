/* *
 *
 *  (c) 2025-2025 Torstein Honsi
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
import type Point from '../../Core/Series/Point';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions.js';
import type Series from '../../Core/Series/Series';

import U from '../../Core/Utilities.js';
const {
    addEvent,
    defined,
    extend,
    getNestedProperty,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */
declare module '../../Core/Chart/ChartBase' {
    interface ChartBase {
        hasInitializedLinkedSeries?: boolean;
    }
}

/* *
 *
 *  Variables
 *
 * */


/* *
 *
 *  Functions
 *
 * */
/**
 * Internal function to sort series data
 *
 * @private
 * @function Highcharts.Series#sortData
 * @param {Array<Highcharts.PointOptionsType>} data
 * Force data grouping.
 */
function sortData(
    series: Series,
    data: Array<(PointOptions|PointShortOptions)>
): Array<PointOptions> {
    const options = series.options,
        { sortKey = 'y' } = options.dataSorting || {},
        getPointOptionsObject = function (
            series: Series,
            pointOptions: (PointOptions|PointShortOptions)
        ): PointOptions {
            return (defined(pointOptions) &&
                series.pointClass.prototype.optionsToObject.call({
                    series: series
                }, pointOptions)) || {};
        };

    data.forEach((pointOptions, i): void => {
        data[i] = getPointOptionsObject(series, pointOptions);
        (data[i] as any).index = i;
    });

    // Sorting
    const sortedData: Array<Point> = data.concat().sort((a, b): number => {
        const aValue = getNestedProperty(
            sortKey,
            a
        ) as (boolean|number|string);
        const bValue = getNestedProperty(
            sortKey,
            b
        ) as (boolean|number|string);
        return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
    }) as Array<Point>;
    // Set x value depending on the position in the array
    sortedData.forEach((point, i): void => {
        point.x = i;
    });

    // Set the same x for linked series points if they don't have their
    // own sorting
    if (series.linkedSeries) {
        series.linkedSeries.forEach((linkedSeries): void => {
            const options = linkedSeries.options,
                seriesData = options.data as Array<PointOptions>;

            if (
                !options.dataSorting?.enabled &&
                seriesData
            ) {
                seriesData.forEach((pointOptions, i): void => {
                    seriesData[i] = getPointOptionsObject(
                        linkedSeries,
                        pointOptions
                    );

                    if (data[i]) {
                        seriesData[i].x = (data[i] as any).x;
                        seriesData[i].index = i;
                    }
                });

                linkedSeries.setData(seriesData, false);
            }
        });
    }

    return data as any;
}

/**
 * Set data for all series with enabled sorting.
 */
function setSortedData(chart: Chart): void {
    chart.getSeriesOrderByLinks().forEach((series): void => {
        // We need to set data for series with sorting after series init
        if (!series.points && !series.data && series.enabledDataSorting) {
            series.setData(series.options.data, false);
        }
    });
}

/**
 * Set properties for a series if data sorting is enabled.
 */
function setDataSortingOptions(series: Series): void {
    extend<Series>(series, {
        requireSorting: false,
        sorted: false,
        enabledDataSorting: true,
        allowDG: false
    });

    // To allow unsorted data for column series.
    series.options.pointRange ??= 1;
}

/**
 * @private
 */
function compose(
    ChartClass: typeof Chart,
    SeriesClass: typeof Series
): void {

    wrap(
        SeriesClass.prototype,
        'setData',
        function (
            this: Series,
            proceed: Function,
            data: Array<(PointOptions|PointShortOptions)>,
            ...args: Array<any>
        ): Series {
            if (this.options.dataSorting?.enabled) {

                // Not ready until we have linked series. Instead, call
                // `setData` again on `beforeRender`.
                if (!this.chart.hasInitializedLinkedSeries) {
                    return this;
                }
                if (Array.isArray(data)) {
                    data = sortData(this, data);
                }
            }

            return proceed.apply(this, [data].concat(args));
        }
    );

    addEvent(ChartClass, 'beforeRender', function (): void {
        setSortedData(this);
    });

    addEvent(ChartClass, 'afterLinkSeries', function (): void {
        this.series.forEach((series): void => {
            if (series.linkedParent?.enabledDataSorting) {
                setDataSortingOptions(series);
            }
        });
        this.hasInitializedLinkedSeries = true;
    });

    // Set data for series with sorting enabled if it isn't set yet
    // (#19715, #20318)
    addEvent(SeriesClass, 'afterUpdate', function (): void {
        setSortedData(this.chart);
    });

    addEvent(SeriesClass, 'afterInit', function (): void {
        if (this.options.dataSorting?.enabled) {
            setDataSortingOptions(this);
        }
    });
}

/* *
 *
 *  Default Export
 *
 * */

const DataSortingComposition = {
    compose
};

export default DataSortingComposition;

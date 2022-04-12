/* *
 *
 *  (c) 2009-2022 Øystein Moseng
 *
 *  Utility functions for automatically describing charts and series.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Series from '../../Core/Series/Series';
import type Point from '../../Core/Series/Point';
import type Accessibility from '../Accessibility';
import U from '../../Core/Utilities.js';
const {
    defined,
    pick
} = U;

interface HistogramElement {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    numPoints: number;
}

interface HistogramExtremesObject {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}


/* *
 *
 *  Functions
 *
 * */

/* eslint-disable valid-jsdoc */


/**
 * Get extremes for X and Y values for the series.
 * @private
 */
function getHistogramExtremes(series: Series): HistogramExtremesObject {
    let minX = pick(series.xAxis.min, series.xAxis.dataMin);
    let maxX = pick(series.xAxis.max, series.xAxis.dataMax);
    let minY = pick(series.yAxis.min, series.yAxis.dataMin);
    let maxY = pick(series.yAxis.max, series.yAxis.dataMax);

    if (
        !defined(minX) || !defined(maxX) ||
        !defined(minY) || !defined(maxY)
    ) {
        // Find data min/max manually
        minX = Infinity;
        maxX = -Infinity;
        minY = Infinity;
        maxY = -Infinity;
        const points = series.points;
        let i = points.length;
        while (i--) {
            minX = Math.min(points[i].x, minX);
            maxX = Math.max(points[i].x, maxX);
            minY = Math.min(points[i].y || Infinity, minY);
            maxY = Math.max(points[i].y || -Infinity, maxY);
        }
    }

    return { minX, maxX, minY, maxY };
}


/**
 * Get a 2D histogram (heatmap) representation of a data series
 * @private
 */
function get2DHistogram(series: Series, numBinsPerAxis: number): Array<Array<HistogramElement>> {
    const histogram: Array<Array<HistogramElement>> = [];
    const histogramExtremes = getHistogramExtremes(series);
    const xDataStep = (histogramExtremes.maxX - histogramExtremes.minX) /
        numBinsPerAxis;
    const yDataStep = (histogramExtremes.maxY - histogramExtremes.minY) /
        numBinsPerAxis;

    const getIndex = (point: Point, key: 'x'|'y'): number|null => {
        const value = point[key];
        if (!defined(value)) {
            return null;
        }
        const maxIx = numBinsPerAxis - 1;
        const startValue = histogramExtremes[key === 'x' ? 'minX' : 'minY'];
        const ix = Math.floor(
            (value - startValue) / (key === 'x' ? xDataStep : yDataStep)
        );
        return Math.min(ix, maxIx);
    };

    // Populate empty histogram
    for (let x = 0; x < numBinsPerAxis; ++x) {
        const yValues = [];
        for (let y = 0; y < numBinsPerAxis; ++y) {
            yValues.push({
                minX: Infinity,
                maxX: -Infinity,
                minY: Infinity,
                maxY: -Infinity,
                numPoints: 0
            });
        }
        histogram.push(yValues);
    }

    // Populate with data from series
    const points = series.points;
    let i = points.length;
    while (i--) {
        const point = points[i];
        const xIndex = getIndex(point, 'x');
        const yIndex = getIndex(point, 'y');
        if (xIndex === null || yIndex === null) {
            continue;
        }

        histogram[xIndex][yIndex].numPoints++;
        histogram[xIndex][yIndex].minX = Math.min(
            histogram[xIndex][yIndex].minX, point.x);
        histogram[xIndex][yIndex].maxX = Math.max(
            histogram[xIndex][yIndex].maxX, point.x);
        histogram[xIndex][yIndex].minY = Math.min(
            histogram[xIndex][yIndex].minY, point.y || Infinity);
        histogram[xIndex][yIndex].maxY = Math.max(
            histogram[xIndex][yIndex].maxY, point.y || -Infinity);
    }

    return histogram;
}


/**
 * Get a text description of a chart's data.
 * @private
 */
function getChartDescription(chart: Accessibility.ChartComposition): string {
    const series = chart.series[0];
    const histogram = get2DHistogram(series, 30);
    const data: Array<Array<number>> = [];
    histogram.forEach((col, colIx): void => {
        col.forEach((el, rowIx): void => {
            data.push([colIx, rowIx, el.numPoints]);
        });
    });

    chart.addSeries({
        type: 'heatmap',
        name: '2Dhistogram for ' + series.name,
        xAxis: 1,
        yAxis: 1,
        colorAxis: 0,
        opacity: 0.8,
        data
    } as any);

    const xDist = histogram.reduce((acc: Array<number>, cur): Array<number> => {
        const sum: number = cur.reduce(
            (acc2, cur2): number => acc2 + cur2.numPoints, 0
        );
        acc.push(sum);
        return acc;
    }, []);

    const yDist = [];
    let i = histogram[0].length;
    while (i--) {
        const rowsum = histogram.reduce(
            (acc, cur): number => acc + cur[i].numPoints, 0); // eslint-disable-line
        yDist.push(rowsum);
    }

    (Highcharts as any).chart('container2', {
        title: {
            text: 'Y-axis Distribution',
            floating: true
        },
        subtitle: {
            text: 'Male class series',
            y: 40
        },
        series: [{
            color: 'rgba(80, 130, 200, 0.95)',
            type: 'areaspline',
            marker: {
                enabled: false
            },
            data: yDist
        }],
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        yAxis: {
            visible: false,
            max: 120
        },
        legend: {
            enabled: false
        },
        xAxis: {
            labels: {
                enabled: false
            },
            visible: false
        }
    }); // eslint-disable-line
    return 'Helo.';
}


/* *
 *
 *  Default Export
 *
 * */

const AutomatedDescriptions = {
    get2DHistogram,
    getChartDescription
};

export default AutomatedDescriptions;

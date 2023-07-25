/* *
 *
 *  (c) 2010-2023 Hubert Kozik
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

import type HeatmapSeries from './Heatmap/HeatmapSeries';
import type GeoHeatmapSeries from './GeoHeatmap/GeoHeatmapSeries';
import type Point from '../Core/Series/Point';
import type ColorAxis from '../Core/Axis/Color/ColorAxis';

import H from '../Core/Globals.js';
const {
    doc
} = H;

import U from '../Core/Utilities.js';
const {
    defined,
    pick
} = U;

/* *
 *
 *  Functions
 *
 * */

/**
 * Find color of point based on color axis.
 *
 * @function Highcharts.colorFromPoint
 *
 * @param {Highcharts.Point} point
 *        Point to find it's color from color axis.
 *
 * @param {Highcharts.ColorAxis} colorAxis
 *        Color axis to find point's color from.
 *
 * @return {number[]}
 *        Color in RGBa array.
 */
function colorFromPoint(
    value: number | null,
    point: Point,
    colorAxis: ColorAxis
): number[] {
    const rgba = ((
        colorAxis.toColor(
            value || 0,
            point
        ) as string)
        .split(')')[0]
        .split('(')[1]
        .split(',')
        .map((s): number => pick(
            parseFloat(s),
            parseInt(s, 10)
        ))
    );
    rgba[3] = pick(rgba[3], 1.0) * 255;
    if (!defined(value) || !point.visible) {
        rgba[3] = 0;
    }
    return rgba;
}

/**
     * Method responsible for creating a canvas for interpolation image.
     * @private
     */
function getContext(
    series: HeatmapSeries | GeoHeatmapSeries
): CanvasRenderingContext2D | undefined {
    const {
        canvas,
        context
    } = series;
    if (canvas && context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        series.canvas = doc.createElement('canvas');

        series.context = series.canvas.getContext('2d', {
            willReadFrequently: true
        }) || void 0;
        return series.context;
    }

    return context;
}

const InterpolationUtilities = {
    colorFromPoint,
    getContext
};

export default InterpolationUtilities;

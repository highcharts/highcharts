/* *
 *
 *  (c) 2010-2021 Grzegorz Blachliński
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type AreaSeries from '../Series/Area/AreaSeries';
import type AreaPoint from './Area/AreaPoint';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';

import Math3D from '../Extensions/Math3D.js';
const { perspective } = Math3D;

import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        area: AreaSeriesClass,
        line: LineSeriesClass
    }
} = SeriesRegistry;

import U from '../Core/Utilities.js';
const {
    pick,
    wrap
} = U;

/* eslint-disable no-invalid-this */

wrap(AreaSeriesClass.prototype, 'getGraphPath', function (
    this: AreaSeries,
    proceed: Function
): SVGPath {

    var series = this,
        svgPath = proceed.apply(series, [].slice.call(arguments, 1));

    // Do not do this if the chart is not 3D
    if (!series.chart.is3d()) {
        return svgPath;
    }

    var getGraphPath = LineSeriesClass.prototype.getGraphPath,
        graphPath: SVGPath = [],
        options = series.options,
        stacking = options.stacking,
        bottomPath,
        bottomPoints: Array<AreaPoint> = [],
        graphPoints: Array<AreaPoint> = [],
        i: number,
        areaPath: SVGPath,
        connectNulls = pick( // #10574
            options.connectNulls,
            stacking === 'percent'
        ),
        translatedThreshold = Math.round( // #10909
            series.yAxis.getThreshold(options.threshold as any) as any
        ),
        options3d;

    if (series.rawPointsX) {
        for (var i = 0; i < series.points.length; i++) {
            bottomPoints.push({
                x: series.rawPointsX[i],
                y: options.stacking ? series.points[i].yBottom : translatedThreshold,
                z: series.zPadding
            } as any);
        }
    }

    if (series.chart.options && series.chart.options.chart) {
        options3d = series.chart.options.chart.options3d;
        bottomPoints = perspective(
            bottomPoints as any, series.chart, true
        ).map(function (point): AreaPoint {
            return { plotX: point.x, plotY: point.y, plotZ: point.z } as any;
        });
        if (series.group && options3d && options3d.depth && options3d.beta) {
            // Markers should take the global zIndex of series group.
            if (series.markerGroup) {
                series.markerGroup.add(series.group);
                series.markerGroup.attr({
                    translateX: 0,
                    translateY: 0
                });
            }
            series.group.attr({
                zIndex: Math.max(
                    1,
                    (options3d.beta > 270 || options3d.beta < 90) ?
                        options3d.depth - Math.round(series.zPadding || 0) :
                        Math.round(series.zPadding || 0)
                )
            });
        }
    }

    (bottomPoints as any).reversed = true;
    bottomPath = getGraphPath.call(series, bottomPoints, true, true);

    if (bottomPath[0] && bottomPath[0][0] === 'M') {
        bottomPath[0] = ['L', bottomPath[0][1], bottomPath[0][2]];
    }

    if (series.areaPath) {
        // Remove previously used bottomPath and add the new one.
        areaPath = series.areaPath.splice(0, series.areaPath.length / 2).concat(bottomPath);
        areaPath.xMap = series.areaPath.xMap; // Use old xMap in the new areaPath
        series.areaPath = areaPath;
        graphPath = getGraphPath.call(series, graphPoints, false, connectNulls);
    }

    return svgPath;
});

/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import LineSeries from './Line/LineSeries.js';
import BaseSeries from '../Core/Series/Series.js';
var seriesTypes = BaseSeries.seriesTypes;
import Math3D from '../Extensions/Math3D.js';
var perspective = Math3D.perspective;
import U from '../Core/Utilities.js';
var pick = U.pick, wrap = U.wrap;
wrap(seriesTypes.area.prototype, 'getGraphPath', function (proceed) {
    var series = this, svgPath = proceed.apply(series, [].slice.call(arguments, 1));
    // Do not do this if the chart is not 3D
    if (!series.chart.is3d()) {
        return svgPath;
    }
    var getGraphPath = LineSeries.prototype.getGraphPath, graphPath = [], options = series.options, stacking = options.stacking, bottomPath, bottomPoints = series.bottomPoints, graphPoints = [], i, areaPath, connectNulls = pick(// #10574
    options.connectNulls, stacking === 'percent'), options3d;
    if (series.areaPath) {
        for (var i = 0; i < series.areaPath.length; i++) {
            if (!series.areaPath[i][1] || !series.areaPath[i][2]) {
                series.areaPath.splice(i, 1);
                i--;
            }
        }
    }
    if (series.chart.is3d() && series.chart.options && series.chart.options.chart) {
        options3d = series.chart.options.chart.options3d;
        bottomPoints = perspective(bottomPoints, series.chart, true).map(function (point) {
            return { plotX: point.x, plotY: point.y, plotZ: point.z };
        });
        if (series.group && options3d && options3d.depth) {
            series.group.attr({
                zIndex: Math.max(1, options3d.depth - Math.round(series.data[0].plotZ || 0))
            });
        }
    }
    bottomPoints.reversed = false;
    bottomPath = getGraphPath.call(series, bottomPoints, true, true);
    if (bottomPath[0] && bottomPath[0][0] === 'M') {
        bottomPath[0] = ['L', bottomPath[0][1], bottomPath[0][2]];
    }
    if (series.areaPath) {
        areaPath = series.areaPath.concat(bottomPath);
        areaPath.xMap = series.areaPath.xMap;
        series.areaPath = areaPath;
        graphPath = getGraphPath
            .call(series, graphPoints, false, connectNulls);
    }
    return graphPath;
});

/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  Extension to the Series object in 3D charts.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var addEvent = U.addEvent, pick = U.pick;
var perspective = H.perspective;
/* eslint-disable no-invalid-this */
// Wrap the translate method to post-translate points into 3D perspective
addEvent(H.Series, 'afterTranslate', function () {
    if (this.chart.is3d()) {
        this.translate3dPoints();
    }
});
// Translate the plotX, plotY properties and add plotZ.
H.Series.prototype.translate3dPoints = function () {
    var series = this, chart = series.chart, zAxis = pick(series.zAxis, chart.options.zAxis[0]), rawPoints = [], rawPoint, projectedPoints, projectedPoint, zValue, i;
    for (i = 0; i < series.data.length; i++) {
        rawPoint = series.data[i];
        if (zAxis && zAxis.translate) {
            zValue = zAxis.logarithmic && zAxis.val2lin ?
                zAxis.val2lin(rawPoint.z) :
                rawPoint.z; // #4562
            rawPoint.plotZ = zAxis.translate(zValue);
            rawPoint.isInside = rawPoint.isInside ?
                (zValue >= zAxis.min &&
                    zValue <= zAxis.max) :
                false;
        }
        else {
            rawPoint.plotZ = 0;
        }
        rawPoint.axisXpos = rawPoint.plotX;
        rawPoint.axisYpos = rawPoint.plotY;
        rawPoint.axisZpos = rawPoint.plotZ;
        rawPoints.push({
            x: rawPoint.plotX,
            y: rawPoint.plotY,
            z: rawPoint.plotZ
        });
    }
    projectedPoints = perspective(rawPoints, chart, true);
    for (i = 0; i < series.data.length; i++) {
        rawPoint = series.data[i];
        projectedPoint = projectedPoints[i];
        rawPoint.plotX = projectedPoint.x;
        rawPoint.plotY = projectedPoint.y;
        rawPoint.plotZ = projectedPoint.z;
    }
};

/**
 * (c) 2010-2017 Torstein Honsi
 *
 * Extension to the Series object in 3D charts.
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
var addEvent = H.addEvent,
    perspective = H.perspective,
    pick = H.pick;

// Wrap the translate method to post-translate points into 3D perspective
addEvent(H.Series, 'afterTranslate', function () {
    if (this.chart.is3d()) {
        this.translate3dPoints();
    }
});

/**
 * Translate the plotX, plotY properties and add plotZ.
 */
H.Series.prototype.translate3dPoints = function () {
    var series = this,
        chart = series.chart,
        zAxis = pick(series.zAxis, chart.options.zAxis[0]),
        rawPoints = [],
        rawPoint,
        projectedPoints,
        projectedPoint,
        zValue,
        i;

    for (i = 0; i < series.data.length; i++) {
        rawPoint = series.data[i];

        if (zAxis && zAxis.translate) {
            zValue = zAxis.isLog && zAxis.val2lin ?
                zAxis.val2lin(rawPoint.z) :
                rawPoint.z; // #4562
            rawPoint.plotZ = zAxis.translate(zValue);
            rawPoint.isInside = rawPoint.isInside ?
                (zValue >= zAxis.min && zValue <= zAxis.max) :
                false;
        } else {
            rawPoint.plotZ = 0;
        }

        rawPoints.push({
            x: pick(rawPoint.plotXold, rawPoint.plotX),
            y: pick(rawPoint.plotYold, rawPoint.plotY),
            z: pick(rawPoint.plotZold, rawPoint.plotZ)
        });
    }

    projectedPoints = perspective(rawPoints, chart, true);

    for (i = 0; i < series.data.length; i++) {
        rawPoint = series.data[i];
        projectedPoint = projectedPoints[i];

        rawPoint.plotXold = rawPoint.plotX;
        rawPoint.plotYold = rawPoint.plotY;
        rawPoint.plotZold = rawPoint.plotZ;

        rawPoint.plotX = projectedPoint.x;
        rawPoint.plotY = projectedPoint.y;
        rawPoint.plotZ = projectedPoint.z;
    }
};


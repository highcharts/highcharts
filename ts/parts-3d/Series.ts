/* *
 *
 *  (c) 2010-2019 Torstein Honsi
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

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Point {
            plotZ?: number;
            z?: number;
        }
        interface Series {
            zAxis?: ZAxis;
            translate3dPoints(): void;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    pick
} = U;

var addEvent = H.addEvent,
    perspective = H.perspective;

/* eslint-disable no-invalid-this */

// Wrap the translate method to post-translate points into 3D perspective
addEvent(H.Series, 'afterTranslate', function (): void {
    if (this.chart.is3d()) {
        this.translate3dPoints();
    }
});

// Translate the plotX, plotY properties and add plotZ.
H.Series.prototype.translate3dPoints = function (): void {
    var series = this,
        chart = series.chart,
        zAxis: Highcharts.ZAxis =
            pick(series.zAxis, (chart.options.zAxis as any)[0]),
        rawPoints = [] as Array<Highcharts.Position3dObject>,
        rawPoint: Highcharts.Point,
        projectedPoints: Array<Highcharts.Position3dObject>,
        projectedPoint: Highcharts.Position3dObject,
        zValue: (number|null|undefined),
        i: number;

    for (i = 0; i < series.data.length; i++) {
        rawPoint = series.data[i];

        if (zAxis && zAxis.translate) {
            zValue = zAxis.isLog && zAxis.val2lin ?
                zAxis.val2lin(rawPoint.z as any) :
                rawPoint.z; // #4562
            rawPoint.plotZ = zAxis.translate(zValue as any);
            rawPoint.isInside = rawPoint.isInside ?
                ((zValue as any) >= (zAxis.min as any) &&
                (zValue as any) <= (zAxis.max as any)) :
                false;
        } else {
            rawPoint.plotZ = 0;
        }

        rawPoint.axisXpos = rawPoint.plotX;
        rawPoint.axisYpos = rawPoint.plotY;
        rawPoint.axisZpos = rawPoint.plotZ;

        rawPoints.push({
            x: rawPoint.plotX as any,
            y: rawPoint.plotY as any,
            z: rawPoint.plotZ as any
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

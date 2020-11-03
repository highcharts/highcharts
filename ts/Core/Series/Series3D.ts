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

import type Point from './Point';
import type Position3DObject from '../Renderer/Position3DObject';
import type ZAxis from '../Axis/ZAxis';
import LineSeries from '../../Series/Line/LineSeries.js';
import Math3D from '../../Extensions/Math3D.js';
const { perspective } = Math3D;
import U from '../Utilities.js';
const {
    addEvent,
    pick
} = U;

declare module './PointLike' {
    interface PointLike {
        plotZ?: number;
        z?: number;
    }
}

declare module './SeriesLike' {
    interface SeriesLike {
        zAxis?: ZAxis;
        /** @requires Core/Series/Series3D */
        translate3dPoints(): void;
    }
}

/* eslint-disable no-invalid-this */

// Wrap the translate method to post-translate points into 3D perspective
addEvent(LineSeries, 'afterTranslate', function (): void {
    if (this.chart.is3d()) {
        this.translate3dPoints();
    }
});

// Translate the plotX, plotY properties and add plotZ.
LineSeries.prototype.translate3dPoints = function (): void {
    var series = this,
        chart = series.chart,
        zAxis: ZAxis = pick(series.zAxis, (chart.options.zAxis as any)[0]),
        rawPoints = [] as Array<Position3DObject>,
        rawPoint: Point,
        projectedPoints: Array<Position3DObject>,
        projectedPoint: Position3DObject,
        zValue: (number|null|undefined),
        i: number;

    for (i = 0; i < series.data.length; i++) {
        rawPoint = series.data[i];

        if (zAxis && zAxis.translate) {
            zValue = zAxis.logarithmic && zAxis.val2lin ?
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

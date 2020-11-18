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

/* *
 *
 *  Imports
 *
 * */

import type Point from './Point';
import type Position3DObject from '../Renderer/Position3DObject';
import type ZAxis from '../Axis/ZAxis';
import LineSeries from '../../Series/Line/LineSeries.js';
import Math3D from '../../Extensions/Math3D.js';
const { perspective } = Math3D;
import U from '../Utilities.js';
const {
    addEvent,
    extend,
    merge,
    pick,
    isNumber
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module './PointLike' {
    interface PointLike {
        plotZ?: number;
        z?: number;
    }
}

declare module './SeriesLike' {
    interface SeriesLike {
        zAxis?: ZAxis;
        zPadding?: number;
        rawPointsX?: Array<number>;
        /** @requires Core/Series/Series3D */
        translate3dPoints(): void;
    }
}

/* *
 *
 *  Class
 *
 * */

class Series3D extends LineSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions = merge(LineSeries.defaultOptions);

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public translate(): void {
        super.translate.apply(this, arguments);
        if (this.chart.is3d()) {
            this.translate3dPoints();
        }
    }

    /**
     * Translate the plotX, plotY properties and add plotZ.
     * @private
     */
    public translate3dPoints(): void {
        var series = this,
            seriesOptions = series.options,
            chart = series.chart,
            zAxis: ZAxis = pick(series.zAxis, (chart.options.zAxis as any)[0]),
            rawPoints = [] as Array<Position3DObject>,
            rawPoint: Point,
            projectedPoints: Array<Position3DObject>,
            projectedPoint: Position3DObject,
            zValue: (number|null|undefined),
            i: number,
            stack = seriesOptions.stacking ?
                (isNumber(seriesOptions.stack) ? seriesOptions.stack : 0) :
                series.index || 0, // #4743
            rawPointsX = [] as Array<number>;
    
        series.zPadding = stack *
            (seriesOptions.depth || 0 + (seriesOptions.groupZPadding || 1));

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
                rawPoint.plotZ = series.zPadding;
            }

            rawPoint.axisXpos = rawPoint.plotX;
            rawPoint.axisYpos = rawPoint.plotY;
            rawPoint.axisZpos = rawPoint.plotZ;

            rawPointsX.push(rawPoint.plotX || 0);

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
        series.rawPointsX = rawPointsX;
    }

    /* eslint-enable valid-jsdoc */
}

/* *
 *
 *  Compatibility
 *
 * */

/* eslint-disable no-invalid-this */

addEvent(LineSeries, 'afterTranslate', function (): void {
    if (this.chart.is3d()) {
        this.translate3dPoints();
    }
});

/* eslint-enable no-invalid-this */

extend(LineSeries.prototype, {
    translate3dPoints: Series3D.prototype.translate3dPoints
});

/* *
 *
 *  Default Export
 *
 * */

export default Series3D;

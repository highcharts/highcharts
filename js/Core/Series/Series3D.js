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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import LineSeries from '../../Series/Line/LineSeries.js';
import Math3D from '../../Extensions/Math3D.js';
var perspective = Math3D.perspective;
import U from '../Utilities.js';
var addEvent = U.addEvent, extend = U.extend, merge = U.merge, pick = U.pick;
/* *
 *
 *  Class
 *
 * */
var Series3D = /** @class */ (function (_super) {
    __extends(Series3D, _super);
    function Series3D() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    Series3D.prototype.translate = function () {
        _super.prototype.translate.apply(this, arguments);
        if (this.chart.is3d()) {
            this.translate3dPoints();
        }
    };
    /**
     * Translate the plotX, plotY properties and add plotZ.
     * @private
     */
    Series3D.prototype.translate3dPoints = function () {
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
    /* *
     *
     *  Static Properties
     *
     * */
    Series3D.defaultOptions = merge(LineSeries.defaultOptions);
    return Series3D;
}(LineSeries));
/* *
 *
 *  Compatibility
 *
 * */
/* eslint-disable no-invalid-this */
addEvent(LineSeries, 'afterTranslate', function () {
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

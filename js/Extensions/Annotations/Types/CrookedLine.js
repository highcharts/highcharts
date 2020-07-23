/* *
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
import Annotation from '../Annotations.js';
import ControlPoint from '../ControlPoint.js';
import MockPoint from '../MockPoint.js';
import U from '../../../Core/Utilities.js';
var merge = U.merge;
/* eslint-disable no-invalid-this, valid-jsdoc */
var CrookedLine = /** @class */ (function (_super) {
    __extends(CrookedLine, _super);
    /* *
     *
     * Constructors
     *
     * */
    function CrookedLine(chart, options) {
        return _super.call(this, chart, options) || this;
    }
    /* *
     *
     * Functions
     *
     * */
    /**
     * Overrides default setter to get axes from typeOptions.
     * @private
     */
    CrookedLine.prototype.setClipAxes = function () {
        this.clipXAxis = this.chart.xAxis[this.options.typeOptions.xAxis];
        this.clipYAxis = this.chart.yAxis[this.options.typeOptions.yAxis];
    };
    CrookedLine.prototype.getPointsOptions = function () {
        var typeOptions = this.options.typeOptions;
        return (typeOptions.points || []).map(function (pointOptions) {
            pointOptions.xAxis = typeOptions.xAxis;
            pointOptions.yAxis = typeOptions.yAxis;
            return pointOptions;
        });
    };
    CrookedLine.prototype.getControlPointsOptions = function () {
        return this.getPointsOptions();
    };
    CrookedLine.prototype.addControlPoints = function () {
        this.getControlPointsOptions().forEach(function (pointOptions, i) {
            var controlPoint = new ControlPoint(this.chart, this, merge(this.options.controlPointOptions, pointOptions.controlPoint), i);
            this.controlPoints.push(controlPoint);
            pointOptions.controlPoint = controlPoint.options;
        }, this);
    };
    CrookedLine.prototype.addShapes = function () {
        var typeOptions = this.options.typeOptions, shape = this.initShape(merge(typeOptions.line, {
            type: 'path',
            points: this.points.map(function (_point, i) {
                return function (target) {
                    return target.annotation.points[i];
                };
            })
        }), false);
        typeOptions.line = shape.options;
    };
    return CrookedLine;
}(Annotation));
CrookedLine.prototype.defaultOptions = merge(Annotation.prototype.defaultOptions, 
/**
 * A crooked line annotation.
 *
 * @sample highcharts/annotations-advanced/crooked-line/
 *         Crooked line
 *
 * @product      highstock
 * @optionparent annotations.crookedLine
 */
{
    /**
     * @extends   annotations.labelOptions
     * @apioption annotations.crookedLine.labelOptions
     */
    /**
     * @extends   annotations.shapeOptions
     * @apioption annotations.crookedLine.shapeOptions
     */
    /**
     * Additional options for an annotation with the type.
     */
    typeOptions: {
        /**
         * This number defines which xAxis the point is connected to.
         * It refers to either the axis id or the index of the axis
         * in the xAxis array.
         */
        xAxis: 0,
        /**
         * This number defines which yAxis the point is connected to.
         * It refers to either the axis id or the index of the axis
         * in the xAxis array.
         */
        yAxis: 0,
        /**
         * @type      {Array<*>}
         * @apioption annotations.crookedLine.typeOptions.points
         */
        /**
         * The x position of the point.
         *
         * @type      {number}
         * @apioption annotations.crookedLine.typeOptions.points.x
         */
        /**
         * The y position of the point.
         *
         * @type      {number}
         * @apioption annotations.crookedLine.typeOptions.points.y
         */
        /**
         * @type      {number}
         * @excluding positioner, events
         * @apioption annotations.crookedLine.typeOptions.points.controlPoint
         */
        /**
         * Line options.
         *
         * @excluding height, point, points, r, type, width
         */
        line: {
            fill: 'none'
        }
    },
    /**
     * @excluding positioner, events
     */
    controlPointOptions: {
        positioner: function (target) {
            var graphic = this.graphic, xy = MockPoint.pointToPixels(target.points[this.index]);
            return {
                x: xy.x - graphic.width / 2,
                y: xy.y - graphic.height / 2
            };
        },
        events: {
            drag: function (e, target) {
                if (target.chart.isInsidePlot(e.chartX - target.chart.plotLeft, e.chartY - target.chart.plotTop)) {
                    var translation = this.mouseMoveToTranslation(e);
                    target.translatePoint(translation.x, translation.y, this.index);
                    // Update options:
                    target.options.typeOptions.points[this.index].x = target.points[this.index].x;
                    target.options.typeOptions.points[this.index].y = target.points[this.index].y;
                    target.redraw(false);
                }
            }
        }
    }
});
Annotation.types.crookedLine = CrookedLine;
export default CrookedLine;

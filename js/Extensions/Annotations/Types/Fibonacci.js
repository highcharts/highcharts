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
import MockPoint from '../MockPoint.js';
import Tunnel from './Tunnel.js';
import U from '../../../Core/Utilities.js';
var merge = U.merge;
/* eslint-disable no-invalid-this, valid-jsdoc */
var createPathDGenerator = function (retracementIndex, isBackground) {
    return function () {
        var annotation = this.annotation, leftTop = this.anchor(annotation.startRetracements[retracementIndex]).absolutePosition, rightTop = this.anchor(annotation.endRetracements[retracementIndex]).absolutePosition, d = [
            ['M', Math.round(leftTop.x), Math.round(leftTop.y)],
            ['L', Math.round(rightTop.x), Math.round(rightTop.y)]
        ], rightBottom, leftBottom;
        if (isBackground) {
            rightBottom = this.anchor(annotation.endRetracements[retracementIndex - 1]).absolutePosition;
            leftBottom = this.anchor(annotation.startRetracements[retracementIndex - 1]).absolutePosition;
            d.push(['L', Math.round(rightBottom.x), Math.round(rightBottom.y)], ['L', Math.round(leftBottom.x), Math.round(leftBottom.y)]);
        }
        return d;
    };
};
var Fibonacci = /** @class */ (function (_super) {
    __extends(Fibonacci, _super);
    /* *
     *
     * Constructors
     *
     * */
    function Fibonacci(chart, options) {
        return _super.call(this, chart, options) || this;
    }
    /* *
     *
     * Functions
     *
     * */
    Fibonacci.prototype.linkPoints = function () {
        _super.prototype.linkPoints.call(this);
        this.linkRetracementsPoints();
        return;
    };
    Fibonacci.prototype.linkRetracementsPoints = function () {
        var points = this.points, startDiff = points[0].y - points[3].y, endDiff = points[1].y - points[2].y, startX = points[0].x, endX = points[1].x;
        Fibonacci.levels.forEach(function (level, i) {
            var startRetracement = points[0].y - startDiff * level, endRetracement = points[1].y - endDiff * level;
            this.startRetracements = this.startRetracements || [];
            this.endRetracements = this.endRetracements || [];
            this.linkRetracementPoint(i, startX, startRetracement, this.startRetracements);
            this.linkRetracementPoint(i, endX, endRetracement, this.endRetracements);
        }, this);
    };
    Fibonacci.prototype.linkRetracementPoint = function (pointIndex, x, y, retracements) {
        var point = retracements[pointIndex], typeOptions = this.options.typeOptions;
        if (!point) {
            retracements[pointIndex] = new MockPoint(this.chart, this, {
                x: x,
                y: y,
                xAxis: typeOptions.xAxis,
                yAxis: typeOptions.yAxis
            });
        }
        else {
            point.options.x = x;
            point.options.y = y;
            point.refresh();
        }
    };
    Fibonacci.prototype.addShapes = function () {
        Fibonacci.levels.forEach(function (_level, i) {
            this.initShape({
                type: 'path',
                d: createPathDGenerator(i)
            }, false);
            if (i > 0) {
                this.initShape({
                    type: 'path',
                    fill: this.options.typeOptions.backgroundColors[i - 1],
                    strokeWidth: 0,
                    d: createPathDGenerator(i, true)
                });
            }
        }, this);
    };
    Fibonacci.prototype.addLabels = function () {
        Fibonacci.levels.forEach(function (level, i) {
            var options = this.options.typeOptions, label = this.initLabel(merge(options.labels[i], {
                point: function (target) {
                    var point = MockPoint.pointToOptions(target.annotation.startRetracements[i]);
                    return point;
                },
                text: level.toString()
            }));
            options.labels[i] = label.options;
        }, this);
    };
    /* *
     *
     * Static properties
     *
     * */
    Fibonacci.levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
    return Fibonacci;
}(Tunnel));
Fibonacci.prototype.defaultOptions = merge(Tunnel.prototype.defaultOptions, 
/**
 * A fibonacci annotation.
 *
 * @sample highcharts/annotations-advanced/fibonacci/
 *         Fibonacci
 *
 * @extends      annotations.crookedLine
 * @product      highstock
 * @optionparent annotations.fibonacci
 */
{
    typeOptions: {
        /**
         * The height of the fibonacci in terms of yAxis.
         */
        height: 2,
        /**
         * An array of background colors:
         * Default to:
         * ```
         * [
         * 'rgba(130, 170, 255, 0.4)',
         * 'rgba(139, 191, 216, 0.4)',
         * 'rgba(150, 216, 192, 0.4)',
         * 'rgba(156, 229, 161, 0.4)',
         * 'rgba(162, 241, 130, 0.4)',
         * 'rgba(169, 255, 101, 0.4)'
         * ]
         * ```
         */
        backgroundColors: [
            'rgba(130, 170, 255, 0.4)',
            'rgba(139, 191, 216, 0.4)',
            'rgba(150, 216, 192, 0.4)',
            'rgba(156, 229, 161, 0.4)',
            'rgba(162, 241, 130, 0.4)',
            'rgba(169, 255, 101, 0.4)'
        ],
        /**
         * The color of line.
         */
        lineColor: 'grey',
        /**
         * An array of colors for the lines.
         */
        lineColors: [],
        /**
         * An array with options for the labels.
         *
         * @type      {Array<*>}
         * @extends   annotations.crookedLine.labelOptions
         * @apioption annotations.fibonacci.typeOptions.labels
         */
        labels: []
    },
    labelOptions: {
        allowOverlap: true,
        align: 'right',
        backgroundColor: 'none',
        borderWidth: 0,
        crop: false,
        overflow: 'none',
        shape: 'rect',
        style: {
            color: 'grey'
        },
        verticalAlign: 'middle',
        y: 0
    }
});
Annotation.types.fibonacci = Fibonacci;
export default Fibonacci;

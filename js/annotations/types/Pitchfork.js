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
import Annotation from '../annotations.src.js';
import InfinityLine from './InfinityLine.js';
import MockPoint from '../MockPoint.js';
import U from '../../parts/Utilities.js';
var merge = U.merge;
/* eslint-disable no-invalid-this, valid-jsdoc */
var Pitchfork = /** @class */ (function (_super) {
    __extends(Pitchfork, _super);
    /* *
     *
     * Constructors
     *
     * */
    function Pitchfork(chart, options) {
        return _super.call(this, chart, options) || this;
    }
    /* *
     *
     * Static Functions
     *
     * */
    Pitchfork.outerLineEdgePoint = function (firstPointIndex) {
        return function (target) {
            var annotation = target.annotation, points = annotation.points;
            return Pitchfork.findEdgePoint(points[firstPointIndex], points[0], new MockPoint(annotation.chart, target, annotation.midPointOptions()));
        };
    };
    Pitchfork.findEdgePoint = function (point, firstAnglePoint, secondAnglePoint) {
        var angle = Math.atan2(secondAnglePoint.plotY - firstAnglePoint.plotY, secondAnglePoint.plotX - firstAnglePoint.plotX), distance = 1e7;
        return {
            x: point.plotX + distance * Math.cos(angle),
            y: point.plotY + distance * Math.sin(angle)
        };
    };
    Pitchfork.middleLineEdgePoint = function (target) {
        var annotation = target.annotation, points = annotation.points;
        return InfinityLine.findEdgePoint(points[0], new MockPoint(annotation.chart, target, annotation.midPointOptions()));
    };
    /* *
     *
     *  Functions
     *
     * */
    Pitchfork.prototype.midPointOptions = function () {
        var points = this.points;
        return {
            x: (points[1].x + points[2].x) / 2,
            y: (points[1].y + points[2].y) / 2,
            xAxis: points[0].series.xAxis,
            yAxis: points[0].series.yAxis
        };
    };
    Pitchfork.prototype.addShapes = function () {
        this.addLines();
        this.addBackgrounds();
    };
    Pitchfork.prototype.addLines = function () {
        this.initShape({
            type: 'path',
            points: [
                this.points[0],
                Pitchfork.middleLineEdgePoint
            ]
        }, false);
        this.initShape({
            type: 'path',
            points: [
                this.points[1],
                Pitchfork.topLineEdgePoint
            ]
        }, false);
        this.initShape({
            type: 'path',
            points: [
                this.points[2],
                Pitchfork.bottomLineEdgePoint
            ]
        }, false);
    };
    Pitchfork.prototype.addBackgrounds = function () {
        var shapes = this.shapes, typeOptions = this.options.typeOptions;
        var innerBackground = this.initShape(merge(typeOptions.innerBackground, {
            type: 'path',
            points: [
                function (target) {
                    var annotation = target.annotation, points = annotation.points, midPointOptions = annotation.midPointOptions();
                    return {
                        x: (points[1].x + midPointOptions.x) / 2,
                        y: (points[1].y + midPointOptions.y) / 2,
                        xAxis: midPointOptions.xAxis,
                        yAxis: midPointOptions.yAxis
                    };
                },
                shapes[1].points[1],
                shapes[2].points[1],
                function (target) {
                    var annotation = target.annotation, points = annotation.points, midPointOptions = annotation.midPointOptions();
                    return {
                        x: (midPointOptions.x + points[2].x) / 2,
                        y: (midPointOptions.y + points[2].y) / 2,
                        xAxis: midPointOptions.xAxis,
                        yAxis: midPointOptions.yAxis
                    };
                }
            ]
        }));
        var outerBackground = this.initShape(merge(typeOptions.outerBackground, {
            type: 'path',
            points: [
                this.points[1],
                shapes[1].points[1],
                shapes[2].points[1],
                this.points[2]
            ]
        }));
        typeOptions.innerBackground = innerBackground.options;
        typeOptions.outerBackground = outerBackground.options;
    };
    /**
     *
     * Static Properties
     *
     */
    Pitchfork.topLineEdgePoint = Pitchfork.outerLineEdgePoint(1);
    Pitchfork.bottomLineEdgePoint = Pitchfork.outerLineEdgePoint(0);
    return Pitchfork;
}(InfinityLine));
Pitchfork.prototype.defaultOptions = merge(InfinityLine.prototype.defaultOptions, 
/**
 * A pitchfork annotation.
 *
 * @sample highcharts/annotations-advanced/pitchfork/
 *         Pitchfork
 *
 * @extends      annotations.infinityLine
 * @product      highstock
 * @optionparent annotations.pitchfork
 */
{
    typeOptions: {
        /**
         * Inner background options.
         *
         * @extends   annotations.crookedLine.shapeOptions
         * @excluding height, r, type, width
         */
        innerBackground: {
            fill: 'rgba(130, 170, 255, 0.4)',
            strokeWidth: 0
        },
        /**
         * Outer background options.
         *
         * @extends   annotations.crookedLine.shapeOptions
         * @excluding height, r, type, width
         */
        outerBackground: {
            fill: 'rgba(156, 229, 161, 0.4)',
            strokeWidth: 0
        }
    }
});
Annotation.types.pitchfork = Pitchfork;
export default Pitchfork;

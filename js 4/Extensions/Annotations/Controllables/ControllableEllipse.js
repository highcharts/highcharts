/* *
 *
 * Author: Pawel Lysy
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import ControllableMixin from '../Mixins/ControllableMixin.js';
import ControllablePath from './ControllablePath.js';
import U from '../../../Core/Utilities.js';
var merge = U.merge, defined = U.defined;
/**
 * A controllable ellipse class.
 *
 * @requires modules/annotations
 *
 * @private
 * @class
 * @name Highcharts.AnnotationControllableEllipse
 *
 * @param {Highcharts.Annotation} annotation an annotation instance
 * @param {Highcharts.AnnotationsShapeOptions} options a shape's options
 * @param {number} index of the Ellipse
 */
var ControllableEllipse = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function ControllableEllipse(annotation, options, index) {
        /* *
         *
         *  Properties
         *
         * */
        this.addControlPoints = ControllableMixin.addControlPoints;
        this.anchor = ControllableMixin.anchor;
        this.attr = ControllableMixin.attr;
        this.attrsFromOptions = ControllableMixin.attrsFromOptions;
        this.destroy = ControllableMixin.destroy;
        this.getPointsOptions = ControllableMixin.getPointsOptions;
        this.linkPoints = ControllableMixin.linkPoints;
        this.point = ControllableMixin.point;
        this.scale = ControllableMixin.scale;
        this.setControlPointsVisibility = (ControllableMixin.setControlPointsVisibility);
        this.shouldBeDrawn = ControllableMixin.shouldBeDrawn;
        this.transform = ControllableMixin.transform;
        this.translatePoint = ControllableMixin.translatePoint;
        this.transformPoint = ControllableMixin.transformPoint;
        /**
         * @type 'ellipse'
         */
        this.type = 'ellipse';
        this.init(annotation, options, index);
        this.collection = 'shapes';
    }
    /* *
     *
     *  Functions
     *
     * */
    ControllableEllipse.prototype.init = function (annotation, options, index) {
        if (defined(options.yAxis)) {
            options.points.forEach(function (point) {
                point.yAxis = options.yAxis;
            });
        }
        if (defined(options.xAxis)) {
            options.points.forEach(function (point) {
                point.xAxis = options.xAxis;
            });
        }
        ControllableMixin.init.call(this, annotation, options, index);
    };
    /**
     *
     * Render the element
     * @param parent parent SVG element.
     */
    ControllableEllipse.prototype.render = function (parent) {
        this.graphic = this.annotation.chart.renderer.createElement('ellipse')
            .attr(this.attrsFromOptions(this.options))
            .add(parent);
        ControllableMixin.render.call(this);
    };
    /**
     * Translate the points.
     * Mostly used to handle dragging of the ellipse.
     */
    ControllableEllipse.prototype.translate = function (dx, dy) {
        ControllableMixin.translateShape.call(this, dx, dy, true);
    };
    /**
     * Get the distance from the line to the point.
     * @param point1 first point which is on the line
     * @param point2 second point
     * @param x0 point's x value from which you want to calculate the distance from
     * @param y0 point's y value from which you want to calculate the distance from
     */
    ControllableEllipse.prototype.getDistanceFromLine = function (point1, point2, x0, y0) {
        return Math.abs((point2.y - point1.y) * x0 - (point2.x - point1.x) * y0 +
            point2.x * point1.y - point2.y * point1.x) / Math.sqrt((point2.y - point1.y) * (point2.y - point1.y) +
            (point2.x - point1.x) * (point2.x - point1.x));
    };
    /**
     * The fuction calculates the svg attributes of the ellipse, and returns all
     * parameters neccessary to draw the ellipse.
     * @param position absolute position of the first point in points array
     * @param position2 absolute position of the second point in points array
     */
    ControllableEllipse.prototype.getAttrs = function (position, position2) {
        var x1 = position.x, y1 = position.y, x2 = position2.x, y2 = position2.y, cx = (x1 + x2) / 2, cy = (y1 + y2) / 2, rx = Math.sqrt((x1 - x2) * (x1 - x2) / 4 + (y1 - y2) * (y1 - y2) / 4), tan = (y2 - y1) / (x2 - x1);
        var angle = Math.atan(tan) * 180 / Math.PI;
        if (cx < x1) {
            angle += 180;
        }
        var ry = this.getRY();
        return { cx: cx, cy: cy, rx: rx, ry: ry, angle: angle };
    };
    /**
     * Get the value of minor radius of the ellipse.
     */
    ControllableEllipse.prototype.getRY = function () {
        var yAxis = this.getYAxis();
        return defined(yAxis) ?
            Math.abs(yAxis.toPixels(this.options.ry) - yAxis.toPixels(0)) :
            this.options.ry;
    };
    /**
     * get the yAxis object to which the ellipse is pinned.
     */
    ControllableEllipse.prototype.getYAxis = function () {
        var yAxisIndex = this.options.yAxis;
        return this.chart.yAxis[yAxisIndex];
    };
    /**
     * Get the absolute coordinates of the MockPoint
     * @param point MockPoint that is added through options
     */
    ControllableEllipse.prototype.getAbsolutePosition = function (point) {
        return this.anchor(point).absolutePosition;
    };
    /**
     *
     * Redraw the element
     * @param animation display an annimation
     */
    ControllableEllipse.prototype.redraw = function (animation) {
        var position = this.getAbsolutePosition(this.points[0]), position2 = this.getAbsolutePosition(this.points[1]), attrs = this.getAttrs(position, position2);
        if (position) {
            this.graphic[animation ? 'animate' : 'attr']({
                cx: attrs.cx,
                cy: attrs.cy,
                rx: attrs.rx,
                ry: attrs.ry,
                rotation: attrs.angle,
                rotationOriginX: attrs.cx,
                rotationOriginY: attrs.cy
            });
        }
        else {
            this.graphic.attr({
                x: 0,
                y: -9e9
            });
        }
        this.graphic.placed = Boolean(position);
        ControllableMixin.redraw.call(this, animation);
    };
    /**
     * Set the radius Y.
     *
     * @param {number} ry a radius in y direction to be set
     */
    ControllableEllipse.prototype.setYRadius = function (ry) {
        this.options.ry = ry;
        this.annotation.userOptions.shapes[0].ry = ry;
        this.annotation.options.shapes[0].ry = ry;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * A map object which allows to map options attributes to element
     * attributes.
     *
     * @name Highcharts.AnnotationControllableEllipse.attrsMap
     * @type {Highcharts.Dictionary<string>}
     */
    ControllableEllipse.attrsMap = merge(ControllablePath.attrsMap, {
        ry: 'ry'
    });
    return ControllableEllipse;
}());
export default ControllableEllipse;

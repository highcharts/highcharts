/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import ControlPoint from '../ControlPoint.js';
import MockPoint from '../MockPoint.js';
import Tooltip from '../../../Core/Tooltip.js';
import U from '../../../Core/Utilities.js';
var isObject = U.isObject, isString = U.isString, merge = U.merge, splat = U.splat;
/**
 * An object which denots a controllable's anchor positions - relative and
 * absolute.
 *
 * @private
 * @interface Highcharts.AnnotationAnchorObject
 */ /**
* Relative to the plot area position
* @name Highcharts.AnnotationAnchorObject#relativePosition
* @type {Highcharts.BBoxObject}
*/ /**
* Absolute position
* @name Highcharts.AnnotationAnchorObject#absolutePosition
* @type {Highcharts.BBoxObject}
*/
/**
 * @interface Highcharts.AnnotationControllable
 */ /**
* @name Highcharts.AnnotationControllable#annotation
* @type {Highcharts.Annotation}
*/ /**
* @name Highcharts.AnnotationControllable#chart
* @type {Highcharts.Chart}
*/ /**
* @name Highcharts.AnnotationControllable#collection
* @type {string}
*/ /**
* @private
* @name Highcharts.AnnotationControllable#controlPoints
* @type {Array<Highcharts.AnnotationControlPoint>}
*/ /**
* @name Highcharts.AnnotationControllable#points
* @type {Array<Highcharts.Point>}
*/
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * It provides methods for handling points, control points
 * and points transformations.
 *
 * @private
 * @mixin
 * @name Highcharts.AnnotationControllableMixin
 */
var controllableMixin = {
    /**
     * Init the controllable
     */
    init: function (annotation, options, index) {
        this.annotation = annotation;
        this.chart = annotation.chart;
        this.options = options;
        this.points = [];
        this.controlPoints = [];
        this.index = index;
        this.linkPoints();
        this.addControlPoints();
    },
    /**
     * Redirect attr usage on the controllable graphic element.
     */
    attr: function () {
        this.graphic.attr.apply(this.graphic, arguments);
    },
    /**
     * Get the controllable's points options.
     *
     * @return {Array<Highcharts.PointOptionsObject>}
     * An array of points' options.
     */
    getPointsOptions: function () {
        var options = this.options;
        return (options.points || (options.point && splat(options.point)));
    },
    /**
     * Utility function for mapping item's options
     * to element's attribute
     *
     * @param {Highcharts.AnnotationsLabelsOptions|Highcharts.AnnotationsShapesOptions} options
     *
     * @return {Highcharts.SVGAttributes}
     * Mapped options.
     */
    attrsFromOptions: function (options) {
        var map = this.constructor.attrsMap, attrs = {}, key, mappedKey, styledMode = this.chart.styledMode;
        for (key in options) { // eslint-disable-line guard-for-in
            mappedKey = map[key];
            if (mappedKey &&
                (!styledMode ||
                    ['fill', 'stroke', 'stroke-width']
                        .indexOf(mappedKey) === -1)) {
                attrs[mappedKey] = options[key];
            }
        }
        return attrs;
    },
    /**
     * Returns object which denotes anchor position - relative and absolute.
     *
     * @param {Highcharts.AnnotationPointType} point
     * A point like object.
     *
     * @return {Highcharts.AnnotationAnchorObject} a controllable anchor
     */
    anchor: function (point) {
        var plotBox = point.series.getPlotBox(), box = point.mock ?
            point.toAnchor() :
            Tooltip.prototype.getAnchor.call({
                chart: point.series.chart
            }, point), anchor = {
            x: box[0] + (this.options.x || 0),
            y: box[1] + (this.options.y || 0),
            height: box[2] || 0,
            width: box[3] || 0
        };
        return {
            relativePosition: anchor,
            absolutePosition: merge(anchor, {
                x: anchor.x + plotBox.translateX,
                y: anchor.y + plotBox.translateY
            })
        };
    },
    /**
     * Map point's options to a point-like object.
     *
     * @param {string|Function|Highcharts.AnnotationMockPointOptionsObject|Highcharts.AnnotationPointType} pointOptions
     * Point's options.
     *
     * @param {Highcharts.AnnotationPointType} point
     * A point-like instance.
     *
     * @return {Highcharts.AnnotationPointType|null}
     *         if the point is found/set returns this point, otherwise null
     */
    point: function (pointOptions, point) {
        if (pointOptions && pointOptions.series) {
            return pointOptions;
        }
        if (!point || point.series === null) {
            if (isObject(pointOptions)) {
                point = new MockPoint(this.chart, this, pointOptions);
            }
            else if (isString(pointOptions)) {
                point = this.chart.get(pointOptions) || null;
            }
            else if (typeof pointOptions === 'function') {
                var pointConfig = pointOptions.call(point, this);
                point = pointConfig.series ?
                    pointConfig :
                    new MockPoint(this.chart, this, pointOptions);
            }
        }
        return point;
    },
    /**
     * Find point-like objects based on points options.
     *
     * @return {Array<Annotation.PointLike>} an array of point-like objects
     */
    linkPoints: function () {
        var pointsOptions = this.getPointsOptions(), points = this.points, len = (pointsOptions && pointsOptions.length) || 0, i, point;
        for (i = 0; i < len; i++) {
            point = this.point(pointsOptions[i], points[i]);
            if (!point) {
                points.length = 0;
                return;
            }
            if (point.mock) {
                point.refresh();
            }
            points[i] = point;
        }
        return points;
    },
    /**
     * Add control points to a controllable.
     */
    addControlPoints: function () {
        var controlPointsOptions = this.options.controlPoints;
        (controlPointsOptions || []).forEach(function (controlPointOptions, i) {
            var options = merge(this.options.controlPointOptions, controlPointOptions);
            if (!options.index) {
                options.index = i;
            }
            controlPointsOptions[i] = options;
            this.controlPoints.push(new ControlPoint(this.chart, this, options));
        }, this);
    },
    /**
     * Check if a controllable should be rendered/redrawn.
     *
     * @return {boolean}
     * Whether a controllable should be drawn.
     */
    shouldBeDrawn: function () {
        return Boolean(this.points.length);
    },
    /**
     * Render a controllable.
     */
    render: function (_parentGroup) {
        this.controlPoints.forEach(function (controlPoint) {
            controlPoint.render();
        });
    },
    /**
     * Redraw a controllable.
     *
     * @param {boolean} [animation]
     */
    redraw: function (animation) {
        this.controlPoints.forEach(function (controlPoint) {
            controlPoint.redraw(animation);
        });
    },
    /**
     * Transform a controllable with a specific transformation.
     *
     * @param {string} transformation a transformation name
     * @param {number|null} cx origin x transformation
     * @param {number|null} cy origin y transformation
     * @param {number} p1 param for the transformation
     * @param {number} [p2] param for the transformation
     */
    transform: function (transformation, cx, cy, p1, p2) {
        if (this.chart.inverted) {
            var temp = cx;
            cx = cy;
            cy = temp;
        }
        this.points.forEach(function (point, i) {
            this.transformPoint(transformation, cx, cy, p1, p2, i);
        }, this);
    },
    /**
     * Transform a point with a specific transformation
     * If a transformed point is a real point it is replaced with
     * the mock point.
     *
     * @param {string} transformation a transformation name
     * @param {number|null} cx origin x transformation
     * @param {number|null} cy origin y transformation
     * @param {number} p1 param for the transformation
     * @param {number|undefined} p2 param for the transformation
     * @param {number} i index of the point
     */
    transformPoint: function (transformation, cx, cy, p1, p2, i) {
        var point = this.points[i];
        if (!point.mock) {
            point = this.points[i] = MockPoint.fromPoint(point);
        }
        point[transformation](cx, cy, p1, p2);
    },
    /**
     * Translate a controllable.
     *
     * @param {number} dx translation for x coordinate
     * @param {number} dy translation for y coordinate
     **/
    translate: function (dx, dy) {
        this.transform('translate', null, null, dx, dy);
    },
    /**
     * Translate a specific point within a controllable.
     *
     * @param {number} dx translation for x coordinate
     * @param {number} dy translation for y coordinate
     * @param {number} i index of the point
     **/
    translatePoint: function (dx, dy, i) {
        this.transformPoint('translate', null, null, dx, dy, i);
    },
    /**
     * Translate shape within controllable item.
     * Replaces `controllable.translate` method.
     *
     * @param {number} dx translation for x coordinate
     * @param {number} dy translation for y coordinate
     */
    translateShape: function (dx, dy) {
        var chart = this.annotation.chart, 
        // Annotation.options
        shapeOptions = this.annotation.userOptions, 
        // Chart.options.annotations
        annotationIndex = chart.annotations.indexOf(this.annotation), chartOptions = chart.options.annotations[annotationIndex];
        this.translatePoint(dx, dy, 0);
        // Options stored in:
        // - chart (for exporting)
        // - current config (for redraws)
        chartOptions[this.collection][this.index].point = this.options.point;
        shapeOptions[this.collection][this.index].point = this.options.point;
    },
    /**
     * Rotate a controllable.
     *
     * @param {number} cx origin x rotation
     * @param {number} cy origin y rotation
     * @param {number} radians
     **/
    rotate: function (cx, cy, radians) {
        this.transform('rotate', cx, cy, radians);
    },
    /**
     * Scale a controllable.
     *
     * @param {number} cx origin x rotation
     * @param {number} cy origin y rotation
     * @param {number} sx scale factor x
     * @param {number} sy scale factor y
     */
    scale: function (cx, cy, sx, sy) {
        this.transform('scale', cx, cy, sx, sy);
    },
    /**
     * Set control points' visibility.
     *
     * @param {boolean} visible
     */
    setControlPointsVisibility: function (visible) {
        this.controlPoints.forEach(function (controlPoint) {
            controlPoint.setVisibility(visible);
        });
    },
    /**
     * Destroy a controllable.
     */
    destroy: function () {
        if (this.graphic) {
            this.graphic = this.graphic.destroy();
        }
        if (this.tracker) {
            this.tracker = this.tracker.destroy();
        }
        this.controlPoints.forEach(function (controlPoint) {
            controlPoint.destroy();
        });
        this.chart = null;
        this.points = null;
        this.controlPoints = null;
        this.options = null;
        if (this.annotation) {
            this.annotation = null;
        }
    },
    /**
     * Update a controllable.
     *
     * @param {Object} newOptions
     */
    update: function (newOptions) {
        var annotation = this.annotation, options = merge(true, this.options, newOptions), parentGroup = this.graphic.parentGroup;
        this.destroy();
        this.constructor(annotation, options);
        this.render(parentGroup);
        this.redraw();
    }
};
export default controllableMixin;

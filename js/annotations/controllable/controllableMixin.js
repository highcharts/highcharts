'use strict';
import H from './../../parts/Globals.js';

import U from './../../parts/Utilities.js';
var isObject = U.isObject,
    isString = U.isString,
    splat = U.splat;

import './../../parts/Tooltip.js';
import ControlPoint from './../ControlPoint.js';
import MockPoint from './../MockPoint.js';

/**
 * It provides methods for handling points, control points
 * and points transformations.
 *
 * @private
 * @mixin
 * @memberOf Annotation
 */
var controllableMixin = {
    /**
     * Init the controllable
     *
     * @param {Annotation} annotation - an annotation instance
     * @param {Object} options - options specific for controllable
     * @param {number} index - index of the controllable element
     **/
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
     **/
    attr: function () {
        this.graphic.attr.apply(this.graphic, arguments);
    },


    /**
     * Get the controllable's points options.
     *
     * @return {Array<PointLikeOptions>} - an array of points' options.
     *
     */
    getPointsOptions: function () {
        var options = this.options;

        return options.points || (options.point && splat(options.point));
    },

    /**
     * Utility function for mapping item's options
     * to element's attribute
     *
     * @param {Object} options
     * @return {Object} mapped options
     **/
    attrsFromOptions: function (options) {
        var map = this.constructor.attrsMap,
            attrs = {},
            key,
            mappedKey,
            styledMode = this.chart.styledMode;

        for (key in options) {
            mappedKey = map[key];

            if (
                mappedKey &&
                (
                    !styledMode ||
                    ['fill', 'stroke', 'stroke-width']
                        .indexOf(mappedKey) === -1
                )
            ) {
                attrs[mappedKey] = options[key];
            }
        }

        return attrs;
    },

    /**
     * @typedef {Object} Annotation.controllableMixin.Position
     * @property {number} x
     * @property {number} y
     */

    /**
     * An object which denotes an anchor position
     *
     * @typedef Annotation.controllableMixin.AnchorPosition
     *          Annotation.controllableMixin.Position
     * @property {number} height
     * @property {number} width
     */

    /**
     * An object which denots a controllable's anchor positions
     * - relative and absolute.
     *
     * @typedef {Object} Annotation.controllableMixin.Anchor
     * @property {Annotation.controllableMixin.AnchorPosition} relativePosition
     * @property {Annotation.controllableMixin.AnchorPosition} absolutePosition
     */

    /**
     * Returns object which denotes anchor position - relative and absolute.
     *
     * @param {Annotation.PointLike} point a point like object
     * @return {Annotation.controllableMixin.Anchor} a controllable anchor
     */
    anchor: function (point) {
        var plotBox = point.series.getPlotBox(),

            box = point.mock ?
                point.toAnchor() :
                H.Tooltip.prototype.getAnchor.call({
                    chart: point.series.chart
                }, point),

            anchor = {
                x: box[0] + (this.options.x || 0),
                y: box[1] + (this.options.y || 0),
                height: box[2] || 0,
                width: box[3] || 0
            };

        return {
            relativePosition: anchor,
            absolutePosition: H.merge(anchor, {
                x: anchor.x + plotBox.translateX,
                y: anchor.y + plotBox.translateY
            })
        };
    },

    /**
     * Map point's options to a point-like object.
     *
     * @param {Highcharts.MockPointOptionsObject} pointOptions
     *        point's options
     * @param {Highcharts.PointLike} point
     *        a point like instance
     *
     * @return {Highcharts.PointLike|null}
     *         if the point is found/set returns this point, otherwise null
     */
    point: function (pointOptions, point) {
        if (pointOptions && pointOptions.series) {
            return pointOptions;
        }

        if (!point || point.series === null) {
            if (isObject(pointOptions)) {
                point = new MockPoint(
                    this.chart,
                    this,
                    pointOptions
                );
            } else if (isString(pointOptions)) {
                point = this.chart.get(pointOptions) || null;
            } else if (typeof pointOptions === 'function') {
                var pointConfig = pointOptions.call(point, this);

                point = pointConfig.series ?
                    pointConfig :
                    new MockPoint(
                        this.chart,
                        this,
                        pointOptions
                    );
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
        var pointsOptions = this.getPointsOptions(),
            points = this.points,
            len = (pointsOptions && pointsOptions.length) || 0,
            i,
            point;

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

        (controlPointsOptions || []).forEach(
            function (controlPointOptions, i) {
                var options = H.merge(
                    this.options.controlPointOptions,
                    controlPointOptions
                );

                if (!options.index) {
                    options.index = i;
                }

                controlPointsOptions[i] = options;

                this.controlPoints.push(
                    new ControlPoint(this.chart, this, options)
                );
            },
            this
        );
    },

    /**
     * Check if a controllable should be rendered/redrawn.
     *
     * @return {boolean} whether a controllable should be drawn.
     */
    shouldBeDrawn: function () {
        return Boolean(this.points.length);
    },

    /**
     * Render a controllable.
     **/
    render: function () {
        this.controlPoints.forEach(function (controlPoint) {
            controlPoint.render();
        });
    },

    /**
     * Redraw a controllable.
     *
     * @param {boolean} animation
     **/
    redraw: function (animation) {
        this.controlPoints.forEach(function (controlPoint) {
            controlPoint.redraw(animation);
        });
    },

    /**
     * Transform a controllable with a specific transformation.
     *
     * @param {string} transformation a transformation name
     * @param {number} cx origin x transformation
     * @param {number} cy origin y transformation
     * @param {number} p1 param for the transformation
     * @param {number} p2 param for the transformation
     **/
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
     * @param {number} cx origin x transformation
     * @param {number} cy origin y transformation
     * @param {number} p1 param for the transformation
     * @param {number} p2 param for the transformation
     * @param {number} i index of the point
     *
     **/
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
            annotationIndex = chart.annotations.indexOf(this.annotation),
            chartOptions = chart.options.annotations[annotationIndex];

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
     * @param {boolean} [visible]
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
        var annotation = this.annotation,
            options = H.merge(true, this.options, newOptions),
            parentGroup = this.graphic.parentGroup;

        this.destroy();
        this.constructor(annotation, options);
        this.render(parentGroup);
        this.redraw();
    }
};

export default controllableMixin;

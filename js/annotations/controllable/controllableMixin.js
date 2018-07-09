'use strict';
import H from './../../parts/Globals.js';
import './../../parts/Utilities.js';
import './../../parts/Tooltip.js';
import ControlPoint from './../ControlPoint.js';
import MockPoint from './../MockPoint.js';

var controllableMixin = {
    /**
     * Init the controllable
     *
     * @param {Highcharts.Annotation} annotation
     * @param {Object} options - options specific for controllable
     **/
    init: function (annotation, options) {
        this.annotation = annotation;
        this.chart = annotation.chart;
        this.options = options;
        this.points = [];
        this.controlPoints = [];

        this.linkPoints();
        this.addControlPoints();
    },

    getPointsOptions: function () {
        var options = this.options;

        return options.points || (options.point && H.splat(options.point));
    },

    /**
     * Utility function for mapping item's options
     * to element's attribute
     *
     * @function attrsFromOptions
     * @memberOf controllableMixin
     *
     * @param {Object} options
     * @return {Object} mapped options
     **/
    attrsFromOptions: function (options) {
        var map = this.constructor.attrsMap,
            attrs = {},
            key,
            mappedKey;

        for (key in options) {
            mappedKey = map[key];
            if (mappedKey) {
                attrs[mappedKey] = options[key];
            }
        }

        return attrs;
    },

    /**
     * An object which denotes an anchor position
     *
     * @typedef {Object} AnchorPosition
     * @property {Number} AnchorPosition.x
     * @property {Number} AnchorPosition.y
     * @property {Number} AnchorPosition.height
     * @property {Number} AnchorPosition.width
     */

    /**
     * Returns object which denotes anchor position - relative and absolute
     *
     * @function itemAnchor
     * @memberOf controllableMixin
     *
     * @param {Object} item
     * @param {Highcharts.Point|Highcharts.MockPoint} point
     * @return {Object} anchor
     * @return {AnchorPosition} anchor.relativePosition
     *         Relative to the plot area position
     * @return {AnchorPosition} anchor.absolutePosition
     *         Absolute position
     */
    anchor: function (point) {
        var plotBox = point.series.getPlotBox(),

            box = point.mock ?
            point.toAnchor() :
            H.Tooltip.prototype.getAnchor.call({
                chart: point.series.chart
            }, point),

            anchor = {
                x: box[0],
                y: box[1],
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
     * Returns a point object
     *
     * @function pointItem
     * @memberOf controllableMixin
     *
     * @param {Object} pointOptions
     * @param {Highcharts.MockPoint|Highcharts.Point} point
     * @return {Highcharts.MockPoint|Highcharts.Point|null} if the point is
     * found/exists returns this point, otherwise null
     */
    point: function (pointOptions, point) {
        if (pointOptions && pointOptions.series) {
            return pointOptions;
        }

        if (!point || point.series === null) {
            if (H.isObject(pointOptions)) {
                point = new MockPoint(
                    this.chart,
                    this,
                    pointOptions
                );
            } else if (H.isString(pointOptions)) {
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
     * Linking item with the point or points and returning an array of linked
     * points.
     *
     * @function linkPoints
     * @memberOf controllableMixin
     *
     * @param {Object} item
     * @return {
     * 	Highcharts.Point|
     * 	Highcharts.MockPoint|
     * 	Array<Highcharts.Point|Highcharts.MockPoint>
     *	}
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

    addControlPoints: function () {
        var controlPointsOptions = this.options.controlPoints;

        H.each(
            controlPointsOptions || [],
            function (controlPointOptions, i) {
                var options = H.merge(
                    ControlPoint.defaultOptions,
                    this.options.controlPointsOptions,
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

    shouldBeDrawn: function () {
        return this.points.length;
    },

    /**
     * Render the controllable.
     **/
    render: function () {
        H.each(this.controlPoints, function (controlPoint) {
            controlPoint.render();
        });
    },

    /**
     * Redraw the controllable.
     *
     * @param {Boolean} animation
     **/
    redraw: function (animation) {
        H.each(this.controlPoints, function (controlPoint) {
            controlPoint.redraw(animation);
        });
    },

    /**
     * Transform the controllable with a specific transformation.
     *
     * @private
     *
     * @param {String} trasnformation - a transformation name
     * @param {Number} cx - origin x transformation
     * @param {Number} cy - origin y transformation
     * @param {Number} p1 - param for the transformation
     * @param {Number} p2 - param for the transformation
     **/
    transform: function (transformation, cx, cy, p1, p2) {
        if (this.chart.inverted) {
            var temp = cx;
            cx = cy;
            cy = temp;
        }

        H.each(this.points, function (point, i) {
            this.transformPoint(transformation, cx, cy, p1, p2, i);
        }, this);
    },

    /**
     * Transform a point with a specific transformation
     * If a transformed point is a real point it is replaced with
     * the mock point.
     *
     * @private
     * @param {String} trasnformation - a transformation name
     * @param {Number} cx - origin x transformation
     * @param {Number} cy - origin y transformation
     * @param {Number} p1 - param for the transformation
     * @param {Number} p2 - param for the transformation
     * @param {Number} i - index of the point
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
     * Translate the path.
     *
     * @param {Number} dx - translation for x coordinate
     * @param {Number} dy - translation for y coordinate
     **/
    translate: function (dx, dy) {
        this.transform('translate', null, null, dx, dy);
    },

    /**
     * Translate the path's specific point.
     *
     * @param {Number} dx - translation for x coordinate
     * @param {Number} dy - translation for y coordinate
     * @param {Number} i - index of the point
     **/
    translatePoint: function (dx, dy, i) {
        this.transformPoint('translate', null, null, dx, dy, i);
    },

    /**
     * Rotate the path.
     *
     * @param {Number} cx - origin x rotation
     * @param {Number} cy - origin y rotation
     * @param {Number} radians
     **/
    rotate: function (cx, cy, radians) {
        this.transform('rotate', cx, cy, radians);
    },

    /**
     * Scale the path.
     *
     * @param {Number} cx - origin x rotation
     * @param {Number} cy - origin y rotation
     * @param {Number} sx - scale factor x
     * @param {Number} sy - scale factor y
     **/
    scale: function (cx, cy, sx, sy) {
        this.transform('scale', cx, cy, sx, sy);
    },

    /**
     * Set control points' visibility.
     *
     * @param {Boolean} [visible]
     **/
    setControlPointsVisibility: function (visible) {
        H.each(this.controlPoints, function (controlPoint) {
            controlPoint.setVisibility(visible);
        });
    },

    /**
     * Destroy the controllable.
     **/
    destroy: function () {
        if (this.graphic) {
            this.graphic = this.graphic.destroy();
        }

        H.each(this.controlPoints, function (controlPoint) {
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

    update: function (userOptions) {
        var annotation = this.annotation,
            options = H.merge(true, this.options, userOptions),
            parentGroup = this.graphic.parentGroup;

        this.destroy();
        this.constructor(annotation, options);
        this.render(parentGroup);
        this.redraw();
    }
};

export default controllableMixin;

/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import ControllableMixin from '../Mixins/ControllableMixin.js';
import ControllablePath from './ControllablePath.js';
import U from '../../../Core/Utilities.js';
var merge = U.merge;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * A controllable circle class.
 *
 * @requires modules/annotations
 *
 * @private
 * @class
 * @name Highcharts.AnnotationControllableCircle
 *
 * @param {Highcharts.Annotation} annotation an annotation instance
 * @param {Highcharts.AnnotationsShapeOptions} options a shape's options
 * @param {number} index of the circle
 */
var ControllableCircle = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function ControllableCircle(annotation, options, index) {
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
        this.init = ControllableMixin.init;
        this.linkPoints = ControllableMixin.linkPoints;
        this.point = ControllableMixin.point;
        this.rotate = ControllableMixin.rotate;
        this.scale = ControllableMixin.scale;
        this.setControlPointsVisibility = (ControllableMixin.setControlPointsVisibility);
        this.shouldBeDrawn = ControllableMixin.shouldBeDrawn;
        this.transform = ControllableMixin.transform;
        this.transformPoint = ControllableMixin.transformPoint;
        this.translatePoint = ControllableMixin.translatePoint;
        this.translateShape = ControllableMixin.translateShape;
        this.update = ControllableMixin.update;
        /**
         * @type 'circle'
         */
        this.type = 'circle';
        this.translate = ControllableMixin.translateShape;
        this.init(annotation, options, index);
        this.collection = 'shapes';
    }
    /* *
     *
     *  Functions
     *
     * */
    ControllableCircle.prototype.render = function (parent) {
        var attrs = this.attrsFromOptions(this.options);
        this.graphic = this.annotation.chart.renderer
            .circle(0, -9e9, 0)
            .attr(attrs)
            .add(parent);
        ControllableMixin.render.call(this);
    };
    ControllableCircle.prototype.redraw = function (animation) {
        var position = this.anchor(this.points[0]).absolutePosition;
        if (position) {
            this.graphic[animation ? 'animate' : 'attr']({
                x: position.x,
                y: position.y,
                r: this.options.r
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
     * Set the radius.
     *
     * @param {number} r a radius to be set
     */
    ControllableCircle.prototype.setRadius = function (r) {
        this.options.r = r;
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
     * @name Highcharts.AnnotationControllableCircle.attrsMap
     * @type {Highcharts.Dictionary<string>}
     */
    ControllableCircle.attrsMap = merge(ControllablePath.attrsMap, { r: 'r' });
    return ControllableCircle;
}());
export default ControllableCircle;

/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import U from './../../parts/Utilities.js';
var merge = U.merge;
import controllableMixin from './controllableMixin.js';
import ControllablePath from './ControllablePath.js';
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * A controllable circle class.
 *
 * @requires modules/annotations
 *
 * @private
 * @constructor
 * @name Highcharts.AnnotationControllableCircle
 *
 * @param {Highcharts.Annotation} annotation an annotation instance
 * @param {Highcharts.AnnotationsShapeOptions} options a shape's options
 * @param {number} index of the circle
 **/
var ControllableCircle = function (annotation, options, index) {
    this.init(annotation, options, index);
    this.collection = 'shapes';
};
/**
 * A map object which allows to map options attributes to element attributes.
 *
 * @name Highcharts.AnnotationControllableCircle.attrsMap
 * @type {Highcharts.Dictionary<string>}
 */
ControllableCircle.attrsMap = merge(ControllablePath.attrsMap, {
    r: 'r'
});
merge(true, ControllableCircle.prototype, controllableMixin, /** @lends Highcharts.AnnotationControllableCircle# */ {
    /**
     * @type 'circle'
     */
    type: 'circle',
    translate: controllableMixin.translateShape,
    render: function (parent) {
        var attrs = this.attrsFromOptions(this.options);
        this.graphic = this.annotation.chart.renderer
            .circle(0, -9e9, 0)
            .attr(attrs)
            .add(parent);
        controllableMixin.render.call(this);
    },
    redraw: function (animation) {
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
        controllableMixin.redraw.call(this, animation);
    },
    /**
     * Set the radius.
     *
     * @param {number} r a radius to be set
     */
    setRadius: function (r) {
        this.options.r = r;
    }
});
export default ControllableCircle;

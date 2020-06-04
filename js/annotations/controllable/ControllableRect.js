/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import controllableMixin from './controllableMixin.js';
import ControllablePath from './ControllablePath.js';
import U from '../../parts/Utilities.js';
var merge = U.merge;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * A controllable rect class.
 *
 * @requires modules/annotations
 *
 * @private
 * @class
 * @name Highcharts.AnnotationControllableRect
 *
 * @param {Highcharts.Annotation} annotation
 * An annotation instance.
 *
 * @param {Highcharts.AnnotationsShapeOptions} options
 * A rect's options.
 *
 * @param {number} index
 * Index of the rectangle
 */
var ControllableRect = function (annotation, options, index) {
    this.init(annotation, options, index);
    this.collection = 'shapes';
};
/**
 * @typedef {Annotation.ControllablePath.AttrsMap}
 *          Annotation.ControllableRect.AttrsMap
 * @property {string} width=width
 * @property {string} height=height
 */
/**
 * A map object which allows to map options attributes to element attributes
 *
 * @type {Annotation.ControllableRect.AttrsMap}
 */
ControllableRect.attrsMap = merge(ControllablePath.attrsMap, {
    width: 'width',
    height: 'height'
});
merge(true, ControllableRect.prototype, controllableMixin, /** @lends Annotation.ControllableRect# */ {
    /**
     * @type 'rect'
     */
    type: 'rect',
    translate: controllableMixin.translateShape,
    render: function (parent) {
        var attrs = this.attrsFromOptions(this.options);
        this.graphic = this.annotation.chart.renderer
            .rect(0, -9e9, 0, 0)
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
                width: this.options.width,
                height: this.options.height
            });
        }
        else {
            this.attr({
                x: 0,
                y: -9e9
            });
        }
        this.graphic.placed = Boolean(position);
        controllableMixin.redraw.call(this, animation);
    }
});
export default ControllableRect;

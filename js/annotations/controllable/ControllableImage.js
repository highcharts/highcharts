/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import ControllableLabel from './ControllableLabel.js';
import controllableMixin from './controllableMixin.js';
import U from './../../parts/Utilities.js';
var merge = U.merge;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * A controllable image class.
 *
 * @requires modules/annotations
 *
 * @private
 * @class
 * @name Highcharts.AnnotationControllableImage
 *
 * @param {Highcharts.Annotation} annotation
 * An annotation instance.
 *
 * @param {Highcharts.AnnotationsShapeOptions} options
 * A controllable's options.
 *
 * @param {number} index
 * Index of the image.
 **/
var ControllableImage = function (annotation, options, index) {
    this.init(annotation, options, index);
    this.collection = 'shapes';
};
/**
 * A map object which allows to map options attributes to element attributes
 *
 * @name Highcharts.AnnotationControllableImage.attrsMap
 * @type {Highcharts.Dictionary<string>}
 */
ControllableImage.attrsMap = {
    width: 'width',
    height: 'height',
    zIndex: 'zIndex'
};
merge(true, ControllableImage.prototype, controllableMixin, /** @lends Annotation.ControllableImage# */ {
    /**
     * @type 'image'
     */
    type: 'image',
    translate: controllableMixin.translateShape,
    render: function (parent) {
        var attrs = this.attrsFromOptions(this.options), options = this.options;
        this.graphic = this.annotation.chart.renderer
            .image(options.src, 0, -9e9, options.width, options.height)
            .attr(attrs)
            .add(parent);
        this.graphic.width = options.width;
        this.graphic.height = options.height;
        controllableMixin.render.call(this);
    },
    redraw: function (animation) {
        var anchor = this.anchor(this.points[0]), position = ControllableLabel.prototype.position.call(this, anchor);
        if (position) {
            this.graphic[animation ? 'animate' : 'attr']({
                x: position.x,
                y: position.y
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
    }
});
export default ControllableImage;

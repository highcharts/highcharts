'use strict';
import H from './../../parts/Globals.js';
import './../../parts/Utilities.js';
import controllableMixin from './controllableMixin.js';
import ControllableLabel from './ControllableLabel.js';

/**
 * A controllable image class.
 *
 * @class
 * @mixes Annotation.controllableMixin
 * @memberOf Annotation
 *
 * @param {Highcharts.Annotation} annotation - an annotation instance
 * @param {Object} options a controllable's options
 * @param {number} index of the image
 **/
function ControllableImage(annotation, options, index) {
    this.init(annotation, options, index);
    this.collection = 'shapes';
}

/**
 * @typedef {Object} Annotation.ControllableImage.AttrsMap
 * @property {string} width=width
 * @property {string} height=height
 * @property {string} zIndex=zIndex
 */

/**
 * A map object which allows to map options attributes to element attributes
 *
 * @type {Annotation.ControllableImage.AttrsMap}
 */
ControllableImage.attrsMap = {
    width: 'width',
    height: 'height',
    zIndex: 'zIndex'
};

H.merge(
    true,
    ControllableImage.prototype,
    controllableMixin, /** @lends Annotation.ControllableImage# */ {
        /**
         * @type 'image'
         */
        type: 'image',

        translate: controllableMixin.translateShape,

        render: function (parent) {
            var attrs = this.attrsFromOptions(this.options),
                options = this.options;

            this.graphic = this.annotation.chart.renderer
                .image(options.src, 0, -9e9, options.width, options.height)
                .attr(attrs)
                .add(parent);

            this.graphic.width = options.width;
            this.graphic.height = options.height;

            controllableMixin.render.call(this);
        },

        redraw: function (animation) {
            var anchor = this.anchor(this.points[0]),
                position = ControllableLabel.prototype.position.call(
                    this,
                    anchor
                );

            if (position) {
                this.graphic[animation ? 'animate' : 'attr']({
                    x: position.x,
                    y: position.y
                });
            } else {
                this.graphic.attr({
                    x: 0,
                    y: -9e9
                });
            }

            this.graphic.placed = Boolean(position);

            controllableMixin.redraw.call(this, animation);
        }
    }
);

export default ControllableImage;

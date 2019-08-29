'use strict';
import H from './../../parts/Globals.js';
import './../../parts/Utilities.js';
import controllableMixin from './controllableMixin.js';
import ControllablePath from './ControllablePath.js';

/**
 * A controllable circle class.
 *
 * @constructor
 * @mixes Annotation.controllableMixin
 * @memberOf Annotation
 *
 * @param {Highcharts.Annotation} annotation an annotation instance
 * @param {Object} options a shape's options
 * @param {number} index of the circle
 **/
function ControllableCircle(annotation, options, index) {
    this.init(annotation, options, index);
    this.collection = 'shapes';
}

/**
 * A map object which allows to map options attributes to element attributes.
 */
ControllableCircle.attrsMap = H.merge(ControllablePath.attrsMap, {
    r: 'r'
});

H.merge(
    true,
    ControllableCircle.prototype,
    controllableMixin, /** @lends Annotation.ControllableCircle# */ {
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
            } else {
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
    }
);

export default ControllableCircle;

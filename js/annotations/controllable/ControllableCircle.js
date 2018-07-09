'use strict';
import H from './../../parts/Globals.js';
import './../../parts/Utilities.js';
import controllableMixin from './controllableMixin.js';
import ControllablePath from './ControllablePath.js';

/**
 * A controllable circle class.
 *
 * @class ControllableCircle
 *
 * @param {Highcharts.Annotation}
 * @param {Object} - shape options
 **/
function ControllableCircle(annotation, options) {
    this.init(annotation, options);
}

/**
 * A map object which allows to map options attributes to element attributes
 *
 * @memberOf Highcharts.Annotation
 * @type {Object}
 * @static
 */
ControllableCircle.attrsMap = H.merge(ControllablePath.attrsMap, {
    r: 'r'
});

H.merge(
    true,
    ControllableCircle.prototype,
    controllableMixin, {
        type: 'circle',

        /**
         * Render the label
         **/
        render: function (parent) {
            var attrs = this.attrsFromOptions(this.options);

            this.graphic = this.annotation.chart.renderer
                .circle(0, -9e9, 0)
                .attr(attrs)
                .add(parent);

            controllableMixin.render.call(this);
        },

        /**
         * Redraw the label
         *
         * @param {Boolean} animation
         **/
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
         * Translate the center of the circle.
         *
         * @param {Number} dx - translation for x coordinate
         * @param {Number} dy - translation for y coordinate
         **/
        translate: function (dx, dy) {
            this.translatePoint(dx, dy, 0);
        },

        setRadius: function (r) {
            this.options.r = r;
        }
    });

export default ControllableCircle;

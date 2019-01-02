'use strict';
import H from './../../parts/Globals.js';
import './../../parts/Utilities.js';
import controllableMixin from './controllableMixin.js';
import markerMixin from './markerMixin.js';

// See TRACKER_FILL in highcharts.src.js
var TRACKER_FILL = 'rgba(192,192,192,' + (H.svg ? 0.0001 : 0.002) + ')';

/**
 * A controllable path class.
 *
 * @class
 * @mixes Annotation.controllableMixin
 * @mixes Annotation.markerMixin
 * @memberOf Annotation
 *
 * @param {Highcharts.Annotation}
 * @param {Object} options a path's options object
 * @param {number} index of the path
 **/
function ControllablePath(annotation, options, index) {
    this.init(annotation, options, index);
    this.collection = 'shapes';
}

/**
 * @typedef {Object} Annotation.ControllablePath.AttrsMap
 * @property {string} dashStyle=dashstyle
 * @property {string} strokeWidth=stroke-width
 * @property {string} stroke=stroke
 * @property {string} fill=fill
 * @property {string} zIndex=zIndex
 */

/**
 * A map object which allows to map options attributes to element attributes
 *
 * @type {Annotation.ControllablePath.AttrsMap}
 */
ControllablePath.attrsMap = {
    dashStyle: 'dashstyle',
    strokeWidth: 'stroke-width',
    stroke: 'stroke',
    fill: 'fill',
    zIndex: 'zIndex'
};

H.merge(
    true,
    ControllablePath.prototype,
    controllableMixin, /** @lends Annotation.ControllablePath# */ {
        /**
         * @type 'path'
         */
        type: 'path',

        setMarkers: markerMixin.setItemMarkers,

        /**
         * Map the controllable path to 'd' path attribute
         *
         * @return {Array<(string|number)>} a path's d attribute
         */
        toD: function () {
            var d = this.options.d;

            if (d) {
                return typeof d === 'function' ?
                    d.call(this) :
                    d;
            }

            var points = this.points,
                len = points.length,
                showPath = len,
                point = points[0],
                position = showPath && this.anchor(point).absolutePosition,
                pointIndex = 0,
                dIndex = 2,
                command;

            d = position && ['M', position.x, position.y];

            while (++pointIndex < len && showPath) {
                point = points[pointIndex];
                command = point.command || 'L';
                position = this.anchor(point).absolutePosition;

                if (command === 'Z') {
                    d[++dIndex] = command;
                } else {
                    if (command !== points[pointIndex - 1].command) {
                        d[++dIndex] = command;
                    }

                    d[++dIndex] = position.x;
                    d[++dIndex] = position.y;
                }

                showPath = point.series.visible;
            }

            return showPath ?
                this.chart.renderer.crispLine(d, this.graphic.strokeWidth()) :
                null;
        },

        shouldBeDrawn: function () {
            return controllableMixin.shouldBeDrawn.call(this) ||
                Boolean(this.options.d);
        },

        render: function (parent) {
            var options = this.options,
                attrs = this.attrsFromOptions(options);

            this.graphic = this.annotation.chart.renderer
                .path(['M', 0, 0])
                .attr(attrs)
                .add(parent);

            if (options.className) {
                this.graphic.addClass(options.className);
            }

            this.tracker = this.annotation.chart.renderer
                .path(['M', 0, 0])
                .addClass('highcharts-tracker-line')
                .attr({
                    zIndex: 2
                })
                .add(parent);

            if (!this.annotation.chart.styledMode) {
                this.tracker.attr({
                    'stroke-linejoin': 'round', // #1225
                    stroke: TRACKER_FILL,
                    fill: TRACKER_FILL,
                    'stroke-width': this.graphic.strokeWidth() +
                        options.snap * 2
                });
            }

            controllableMixin.render.call(this);

            H.extend(this.graphic, {
                markerStartSetter: markerMixin.markerStartSetter,
                markerEndSetter: markerMixin.markerEndSetter
            });

            this.setMarkers(this);
        },

        redraw: function (animation) {

            var d = this.toD(),
                action = animation ? 'animate' : 'attr';

            if (d) {
                this.graphic[action]({ d: d });
                this.tracker[action]({ d: d });
            } else {
                this.graphic.attr({ d: 'M 0 ' + -9e9 });
                this.tracker.attr({ d: 'M 0 ' + -9e9 });
            }

            this.graphic.placed = this.tracker.placed = Boolean(d);

            controllableMixin.redraw.call(this, animation);
        }
    }
);

export default ControllablePath;

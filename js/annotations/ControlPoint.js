import H from './../parts/Globals.js';
import './../parts/Utilities.js';
import eventEmitterMixin from './eventEmitterMixin.js';

/**
 * A control point class which is a connection between controllable
 * transform methods and a user actions.
 *
 * @constructor
 * @mixes eventEmitterMixin
 * @memberOf Annotation
 *
 * @param {Highcharts.Chart} chart a chart instance
 * @param {Object} target a controllable instance which is a target for
 *        a control point
 * @param {Annotation.ControlPoint.Options} options an options object
 * @param {number} [index]
 **/
function ControlPoint(chart, target, options, index) {
    this.chart = chart;
    this.target = target;
    this.options = options;
    this.index = H.pick(options.index, index);
}

/**
 * @typedef {Object} Annotation.ControlPoint.Position
 * @property {number} x
 * @property {number} y
 */

/**
 * @callback Annotation.ControlPoint.Positioner
 * @param {Object} e event
 * @param {Controllable} target
 * @return {Annotation.ControlPoint.Position} position
 */

/**
 * @typedef {Object} Annotation.ControlPoint.Options
 * @property {string} symbol
 * @property {number} width
 * @property {number} height
 * @property {Object} style
 * @property {boolean} visible
 * @property {Annotation.ControlPoint.Positioner} positioner
 * @property {Object} events
 */

H.extend(
    ControlPoint.prototype,
    eventEmitterMixin
);

/**
 * Set the visibility.
 *
 * @param {boolean} [visible]
 **/
ControlPoint.prototype.setVisibility = function (visible) {
    this.graphic.attr('visibility', visible ? 'visible' : 'hidden');

    this.options.visible = visible;
};

/**
 * Render the control point.
 */
ControlPoint.prototype.render = function () {
    var chart = this.chart,
        options = this.options;

    this.graphic = chart.renderer
        .symbol(
            options.symbol,
            0,
            0,
            options.width,
            options.height
        )
        .add(chart.controlPointsGroup)
        .css(options.style);

    this.setVisibility(options.visible);
    this.addEvents();
};

/**
 * Redraw the control point.
 *
 * @param {boolean} [animation]
 */
ControlPoint.prototype.redraw = function (animation) {
    this.graphic[animation ? 'animate' : 'attr'](
        this.options.positioner.call(this, this.target)
    );
};


/**
 * Destroy the control point.
 */
ControlPoint.prototype.destroy = function () {
    eventEmitterMixin.destroy.call(this);

    if (this.graphic) {
        this.graphic = this.graphic.destroy();
    }

    this.chart = null;
    this.target = null;
    this.options = null;
};

/**
 * Update the control point.
 */
ControlPoint.prototype.update = function (userOptions) {
    var chart = this.chart,
        target = this.target,
        index = this.index,
        options = H.merge(true, this.options, userOptions);

    this.destroy();
    this.constructor(chart, target, options, index);
    this.render(chart.controlPointsGroup);
    this.redraw();
};

export default ControlPoint;

import H from './../parts/Globals.js';
import './../parts/Utilities.js';
import eventEmitterMixin from './eventEmitterMixin.js';

/**
 * A control point class which is a connection between controllable
 * transform methods and a user actions.
 *
 * @class ControlPoint
 *
 * @param {Highcharts.Chart} chart
 * @param {Object} target - annotation or controllable - a target for
 * controlling by a control point
 * @param {Object} options
 * @param {Number} [index]
 **/
function ControlPoint(chart, target, options, index) {
    this.chart = chart;
    this.target = target;
    this.options = options;
    this.index = H.pick(options.index, index);
}

/**
 * Control point default options.
 **/
ControlPoint.defaultOptions = {
    symbol: 'circle',
    width: 10,
    height: 10,
    style: {
        stroke: 'black',
        'stroke-width': 2,
        fill: 'white'
    },
    visible: false,
    // positioner: Function,

    events: {}
};

H.extend(
    ControlPoint.prototype,
    eventEmitterMixin
);

/**
 * Set the visibility.
 *
 * @param {Boolean} [visible]
 **/
ControlPoint.prototype.setVisibility = function (visible) {
    this.graphic.attr('visibility', visible ? 'visible' : 'hidden');

    this.options.visible = visible;
};

/**
 * Render the control point.
 **/
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
 * @param {Boolean} [animation]
 **/
ControlPoint.prototype.redraw = function (animation) {
    this.graphic[animation ? 'animate' : 'attr'](
        this.options.positioner.call(this, this.target)
    );
};


/**
 * Destroy the control point
 **/
ControlPoint.prototype.destroy = function () {
    eventEmitterMixin.destroy.call(this);

    if (this.graphic) {
        this.graphic = this.graphic.destroy();
    }

    this.chart = null;
    this.target = null;
    this.options = null;
};

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

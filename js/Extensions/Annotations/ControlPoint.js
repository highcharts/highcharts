/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
/**
 * Callback to modify annotation's possitioner controls.
 *
 * @callback Highcharts.AnnotationControlPointPositionerFunction
 * @param {Highcharts.AnnotationControlPoint} this
 * @param {Highcharts.AnnotationControllable} target
 * @return {Highcharts.PositionObject}
 */
import U from '../../Core/Utilities.js';
var extend = U.extend, merge = U.merge, pick = U.pick;
import eventEmitterMixin from './Mixins/EventEmitterMixin.js';
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * A control point class which is a connection between controllable
 * transform methods and a user actions.
 *
 * @requires modules/annotations
 *
 * @class
 * @name Highcharts.AnnotationControlPoint
 *
 * @hideconstructor
 *
 * @param {Highcharts.Chart} chart
 * A chart instance.
 *
 * @param {Highcharts.AnnotationControllable} target
 * A controllable instance which is a target for a control point.
 *
 * @param {Highcharts.AnnotationControlPointOptionsObject} options
 * An options object.
 *
 * @param {number} [index]
 * Point index.
 */
var ControlPoint = /** @class */ (function () {
    function ControlPoint(chart, target, options, index) {
        /**
         *
         * Properties
         *
         */
        this.addEvents = eventEmitterMixin.addEvents;
        this.graphic = void 0;
        this.mouseMoveToRadians = eventEmitterMixin.mouseMoveToRadians;
        this.mouseMoveToScale = eventEmitterMixin.mouseMoveToScale;
        this.mouseMoveToTranslation = eventEmitterMixin.mouseMoveToTranslation;
        this.onDrag = eventEmitterMixin.onDrag;
        this.onMouseDown = eventEmitterMixin.onMouseDown;
        this.onMouseUp = eventEmitterMixin.onMouseUp;
        this.removeDocEvents = eventEmitterMixin.removeDocEvents;
        /**
         *
         * Functions
         *
         */
        /**
         * List of events for `anntation.options.events` that should not be
         * added to `annotation.graphic` but to the `annotation`.
         * @private
         * @name Highcharts.AnnotationControlPoint#nonDOMEvents
         * @type {Array<string>}
         */
        this.nonDOMEvents = ['drag'];
        this.chart = chart;
        this.target = target;
        this.options = options;
        this.index = pick(options.index, index);
    }
    /**
     * Set the visibility of the control point.
     *
     * @function Highcharts.AnnotationControlPoint#setVisibility
     *
     * @param {boolean} visible
     * Visibility of the control point.
     *
     * @return {void}
     */
    ControlPoint.prototype.setVisibility = function (visible) {
        this.graphic.attr('visibility', visible ? 'visible' : 'hidden');
        this.options.visible = visible;
    };
    /**
     * Render the control point.
     * @private
     */
    ControlPoint.prototype.render = function () {
        var chart = this.chart, options = this.options;
        this.graphic = chart.renderer
            .symbol(options.symbol, 0, 0, options.width, options.height)
            .add(chart.controlPointsGroup)
            .css(options.style);
        this.setVisibility(options.visible);
        // npm test -- --tests "highcharts/annotations-advanced/*"
        this.addEvents();
    };
    /**
     * Redraw the control point.
     * @private
     * @param {boolean} [animation]
     */
    ControlPoint.prototype.redraw = function (animation) {
        this.graphic[animation ? 'animate' : 'attr'](this.options.positioner.call(this, this.target));
    };
    /**
     * Destroy the control point.
     * @private
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
     *
     * @function Highcharts.AnnotationControlPoint#update
     *
     * @param {Partial<Highcharts.AnnotationControlPointOptionsObject>} userOptions
     * New options for the control point.
     *
     * @return {void}
     */
    ControlPoint.prototype.update = function (userOptions) {
        var chart = this.chart, target = this.target, index = this.index, options = merge(true, this.options, userOptions);
        this.destroy();
        this.constructor(chart, target, options, index);
        this.render(chart.controlPointsGroup);
        this.redraw();
    };
    return ControlPoint;
}());
export default ControlPoint;

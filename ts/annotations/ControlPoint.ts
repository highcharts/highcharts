/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class AnnotationControlPoint implements AnnotationEventEmitter {
            public constructor(
                chart: AnnotationChart,
                target: AnnotationControllable,
                options: Partial<AnnotationControlPointOptionsObject>,
                index?: number
            );
            public addEvents: AnnotationEventEmitterMixin['addEvents'];
            public chart: AnnotationChart;
            public graphic: SVGElement;
            public index: number;
            public mouseMoveToRadians: AnnotationEventEmitterMixin['mouseMoveToRadians'];
            public mouseMoveToScale: AnnotationEventEmitterMixin['mouseMoveToScale'];
            public mouseMoveToTranslation: AnnotationEventEmitterMixin['mouseMoveToTranslation'];
            public nonDOMEvents: Array<string>;
            public onDrag: AnnotationEventEmitterMixin['onDrag'];
            public onMouseDown: AnnotationEventEmitterMixin['onMouseDown'];
            public onMouseUp: AnnotationEventEmitterMixin['onMouseUp'];
            public options: AnnotationControlPointOptionsObject;
            public removeDocEvents: AnnotationEventEmitterMixin['removeDocEvents'];
            public target: AnnotationControllable;
            public destroy(): void;
            public redraw(animation?: boolean): void;
            public render(): void;
            public setVisibility(visible: boolean): void;
            public update(userOptions: Partial<AnnotationControlPointOptionsObject>): void;
        }
        interface AnnotationControlPointDragEventFunction {
            (this: Annotation, evt: AnnotationEventObject, target: AnnotationControllable): void;
        }
        interface AnnotationControlPointPositionerFunction {
            (this: AnnotationControlPoint, target: AnnotationControllable): PositionObject;
        }
    }
}

/**
 * Callback to modify annotation's possitioner controls.
 *
 * @callback Highcharts.AnnotationControlPointPositionerFunction
 * @param {Highcharts.AnnotationControlPoint} this
 * @param {Highcharts.AnnotationControllable} target
 * @return {Highcharts.PositionObject}
 */

import U from './../parts/Utilities.js';
const {
    extend,
    merge,
    pick
} = U;

import eventEmitterMixin from './eventEmitterMixin.js';

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
const ControlPoint: typeof Highcharts.AnnotationControlPoint = function (
    this: Highcharts.AnnotationControlPoint,
    chart: Highcharts.AnnotationChart,
    target: Highcharts.AnnotationControllable,
    options: Highcharts.AnnotationControlPointOptionsObject,
    index?: number
): void {
    this.chart = chart;
    this.target = target;
    this.options = options;
    this.index = pick((options as any).index, index);
} as any;

extend(
    ControlPoint.prototype,
    eventEmitterMixin
);

/**
 * List of events for `anntation.options.events` that should not be
 * added to `annotation.graphic` but to the `annotation`.
 * @private
 * @name Highcharts.AnnotationControlPoint#nonDOMEvents
 * @type {Array<string>}
 */
ControlPoint.prototype.nonDOMEvents = ['drag'];

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
ControlPoint.prototype.setVisibility = function (visible: boolean): void {
    this.graphic.attr('visibility', visible ? 'visible' : 'hidden');

    this.options.visible = visible as any;
};

/**
 * Render the control point.
 * @private
 */
ControlPoint.prototype.render = function (): void {
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
 * @private
 * @param {boolean} [animation]
 */
ControlPoint.prototype.redraw = function (animation?: boolean): void {
    this.graphic[animation ? 'animate' : 'attr'](
        this.options.positioner.call(this, this.target)
    );
};


/**
 * Destroy the control point.
 * @private
 */
ControlPoint.prototype.destroy = function (): void {
    eventEmitterMixin.destroy.call(this);

    if (this.graphic) {
        this.graphic = this.graphic.destroy() as any;
    }

    this.chart = null as any;
    this.target = null as any;
    this.options = null as any;
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
ControlPoint.prototype.update = function (
    this: Highcharts.AnnotationControlPoint,
    userOptions: Partial<Highcharts.AnnotationControlPointOptionsObject>
): void {
    var chart = this.chart,
        target = this.target,
        index = this.index,
        options = merge(true, this.options, userOptions);

    this.destroy();
    this.constructor(chart, target, options, index);
    (this.render as any)(chart.controlPointsGroup);
    this.redraw();
};

export default ControlPoint;

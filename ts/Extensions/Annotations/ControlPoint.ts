/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type {
    AnnotationControlPointOptionsObject
} from './ControlPointOptions';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

declare module './MockPointOptions' {
    interface MockPointOptions {
        controlPoint?: AnnotationControlPointOptionsObject;
    }
}

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
            public mouseMoveToRadians: AnnotationEventEmitterMixin[
                'mouseMoveToRadians'
            ];
            public mouseMoveToScale: AnnotationEventEmitterMixin[
                'mouseMoveToScale'
            ];
            public mouseMoveToTranslation: AnnotationEventEmitterMixin[
                'mouseMoveToTranslation'
            ];
            public nonDOMEvents: Array<string>;
            public onDrag: AnnotationEventEmitterMixin['onDrag'];
            public onMouseDown: AnnotationEventEmitterMixin['onMouseDown'];
            public onMouseUp: AnnotationEventEmitterMixin['onMouseUp'];
            public options: AnnotationControlPointOptionsObject;
            public removeDocEvents: AnnotationEventEmitterMixin[
                'removeDocEvents'
            ];
            public target: AnnotationControllable;
            public destroy(): void;
            public redraw(animation?: boolean): void;
            public render(): void;
            public setVisibility(visible: boolean): void;
            public update(
                userOptions: Partial<AnnotationControlPointOptionsObject>
            ): void;
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

import U from '../../Core/Utilities.js';
const {
    merge,
    pick
} = U;

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
class ControlPoint implements eventEmitterMixin.Type {
    public constructor(
        chart: Highcharts.AnnotationChart,
        target: Highcharts.AnnotationControllable,
        options: AnnotationControlPointOptionsObject,
        index?: number
    ) {
        this.chart = chart;
        this.target = target;
        this.options = options;
        this.index = pick((options as any).index, index);
    }

    /**
     *
     * Properties
     *
     */

    public addEvents = eventEmitterMixin.addEvents;
    public chart: Highcharts.AnnotationChart;
    public graphic: SVGElement = void 0 as any;
    public index: number;
    public mouseMoveToRadians = eventEmitterMixin.mouseMoveToRadians;
    public mouseMoveToScale = eventEmitterMixin.mouseMoveToScale;
    public mouseMoveToTranslation = eventEmitterMixin.mouseMoveToTranslation;
    public onDrag = eventEmitterMixin.onDrag;
    public onMouseDown = eventEmitterMixin.onMouseDown;
    public onMouseUp = eventEmitterMixin.onMouseUp;
    public options: AnnotationControlPointOptionsObject;
    public removeDocEvents = eventEmitterMixin.removeDocEvents;
    public target: Highcharts.AnnotationControllable;

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
    public nonDOMEvents = ['drag'];

    /**
     * Set the visibility of the control point.
     *
     * @function Highcharts.AnnotationControlPoint#setVisibility
     *
     * @param {boolean} visible
     * Visibility of the control point.
     *
     */
    public setVisibility(visible: boolean): void {
        this.graphic[visible ? 'show' : 'hide']();
        this.options.visible = visible as any;
    }

    /**
     * Render the control point.
     * @private
     */
    public render(): void {
        const chart = this.chart,
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
        // npm test -- --tests "highcharts/annotations-advanced/*"
        this.addEvents();
    }

    /**
     * Redraw the control point.
     * @private
     * @param {boolean} [animation]
     */
    public redraw(animation?: boolean): void {
        this.graphic[animation ? 'animate' : 'attr'](
            this.options.positioner.call(this, this.target)
        );
    }


    /**
     * Destroy the control point.
     * @private
     */
    public destroy(): void {
        eventEmitterMixin.destroy.call(this);

        if (this.graphic) {
            this.graphic = this.graphic.destroy() as any;
        }

        this.chart = null as any;
        this.target = null as any;
        this.options = null as any;
    }

    /**
     * Update the control point.
     *
     * @function Highcharts.AnnotationControlPoint#update
     *
     * @param {Partial<Highcharts.AnnotationControlPointOptionsObject>} userOptions
     * New options for the control point.
     *
     */
    public update(
        userOptions: Partial<AnnotationControlPointOptionsObject>
    ): void {
        const chart = this.chart,
            target = this.target,
            index = this.index,
            options = merge(true, this.options, userOptions);

        this.destroy();
        this.constructor(chart, target, options, index);
        (this.render as any)(chart.controlPointsGroup);
        this.redraw();
    }
}

export default ControlPoint;

/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import H from '../parts/Globals.js';

/**
 * Internal types.
 */
declare global {
    namespace Highcharts {
        interface AnnotationEventEmitter extends AnnotationEventEmitterMixin {
            cancelClick?: boolean;
            chart: AnnotationChart;
            graphic: SVGElement;
            hasDragged?: boolean;
            hcEvents?: unknown;
            isUpdating?: boolean;
            labels?: Array<AnnotationLabelType>;
            nonDOMEvents?: Array<string>;
            options: Partial<(AnnotationControlPointOptionsObject|AnnotationsOptions)>;
            points?: Array<AnnotationPointType>;
            removeDrag?: Function;
            removeMouseUp?: Function;
            shapes?: Array<AnnotationShapeType>;
            target?: AnnotationControllable;
            redraw(animation?: boolean): void;
        }
        interface AnnotationEventEmitterMixin {
            addEvents(this: AnnotationEventEmitter): void;
            destroy(this: AnnotationEventEmitter): void;
            mouseMoveToRadians(this: AnnotationEventEmitter, e: AnnotationEventObject, cx: number, cy: number): number;
            mouseMoveToScale(
                this: AnnotationEventEmitter,
                e: AnnotationEventObject,
                cx: number,
                cy: number
            ): PositionObject;
            mouseMoveToTranslation(this: AnnotationEventEmitter, e: AnnotationEventObject): PositionObject;
            onDrag(this: AnnotationEventEmitter, e: AnnotationEventObject): void;
            onMouseDown(this: AnnotationEventEmitter, e: AnnotationEventObject): void;
            onMouseUp(this: AnnotationEventEmitter, e: AnnotationEventObject): void;
            removeDocEvents(this: AnnotationEventEmitter): void;
        }
        interface AnnotationEventObject extends PointerEventObject {
            prevChartX: number;
            prevChartY: number;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    addEvent,
    objectEach,
    pick,
    removeEvent
} = U;

var fireEvent = H.fireEvent;

/* eslint-disable valid-jsdoc */

/**
 * It provides methods for:
 * - adding and handling DOM events and a drag event,
 * - mapping a mouse move event to the distance between two following events.
 *   The units of the distance are specific to a transformation,
 *   e.g. for rotation they are radians, for scaling they are scale factors.
 *
 * @private
 * @mixin
 * @memberOf Annotation
 */
var eventEmitterMixin: Highcharts.AnnotationEventEmitterMixin = {
    /**
     * Add emitter events.
     */
    addEvents: function (this: Highcharts.AnnotationEventEmitter): void {
        var emitter = this;

        addEvent(
            emitter.graphic.element,
            'mousedown',
            function (e: Highcharts.AnnotationEventObject): void {
                emitter.onMouseDown(e);
            }
        );

        objectEach(emitter.options.events, function (
            event: Highcharts.EventCallbackFunction<Highcharts.Annotation>,
            type: string
        ): void {
            var eventHandler = function (e: Highcharts.PointerEventObject): void {
                if (type !== 'click' || !emitter.cancelClick) {
                    (event as any).call(
                        emitter,
                        emitter.chart.pointer.normalize(e),
                        emitter.target
                    );
                }
            };

            if (H.inArray(type, emitter.nonDOMEvents || []) === -1) {
                emitter.graphic.on(type, eventHandler);
            } else {
                addEvent(emitter, type, eventHandler);
            }
        });

        if (emitter.options.draggable) {

            addEvent(emitter, 'drag', emitter.onDrag);

            if (!emitter.graphic.renderer.styledMode) {
                emitter.graphic.css({
                    cursor: ({
                        x: 'ew-resize',
                        y: 'ns-resize',
                        xy: 'move'
                    } as Highcharts.Dictionary<Highcharts.CursorValue>)[
                        emitter.options.draggable
                    ]
                });
            }
        }

        if (!emitter.isUpdating) {
            fireEvent(emitter, 'add');
        }
    },

    /**
     * Remove emitter document events.
     */
    removeDocEvents: function (this: Highcharts.AnnotationEventEmitter): void {
        if (this.removeDrag) {
            this.removeDrag = this.removeDrag();
        }

        if (this.removeMouseUp) {
            this.removeMouseUp = this.removeMouseUp();
        }
    },

    /**
     * Mouse down handler.
     */
    onMouseDown: function (this: Highcharts.AnnotationEventEmitter, e: Highcharts.AnnotationEventObject): void {
        var emitter = this,
            pointer = emitter.chart.pointer,
            prevChartX: number,
            prevChartY: number;

        if (e.preventDefault) {
            e.preventDefault();
        }

        // On right click, do nothing:
        if (e.button === 2) {
            return;
        }

        e = pointer.normalize(e);
        prevChartX = e.chartX;
        prevChartY = e.chartY;

        emitter.cancelClick = false;
        emitter.chart.hasDraggedAnnotation = true;

        emitter.removeDrag = addEvent(
            H.doc,
            'mousemove',
            function (e: Highcharts.AnnotationEventObject): void {
                emitter.hasDragged = true;

                e = pointer.normalize(e);
                e.prevChartX = prevChartX;
                e.prevChartY = prevChartY;

                fireEvent(emitter, 'drag', e);

                prevChartX = e.chartX;
                prevChartY = e.chartY;
            }
        );

        emitter.removeMouseUp = addEvent(
            H.doc,
            'mouseup',
            function (e: Highcharts.AnnotationEventObject): void {
                emitter.cancelClick = emitter.hasDragged;
                emitter.hasDragged = false;
                emitter.chart.hasDraggedAnnotation = false;
                // ControlPoints vs Annotation:
                fireEvent(pick(emitter.target, emitter), 'afterUpdate');
                emitter.onMouseUp(e);
            }
        );
    },

    /**
     * Mouse up handler.
     */
    onMouseUp: function (this: Highcharts.AnnotationEventEmitter, _e: Highcharts.AnnotationEventObject): void {
        var chart = this.chart,
            annotation: Highcharts.Annotation = this.target as any || this,
            annotationsOptions = chart.options.annotations,
            index = chart.annotations.indexOf(annotation);

        this.removeDocEvents();

        (annotationsOptions as any)[index] = annotation.options;
    },

    /**
     * Drag and drop event. All basic annotations should share this
     * capability as well as the extended ones.
     */
    onDrag: function (
        this: Highcharts.AnnotationEventEmitter,
        e: Highcharts.AnnotationEventObject
    ): void {
        if (
            this.chart.isInsidePlot(
                e.chartX - this.chart.plotLeft,
                e.chartY - this.chart.plotTop
            )
        ) {
            var translation = this.mouseMoveToTranslation(e);

            if (this.options.draggable === 'x') {
                translation.y = 0;
            }

            if (this.options.draggable === 'y') {
                translation.x = 0;
            }

            if ((this.points as any).length) {
                (this as any).translate(translation.x, translation.y);
            } else {
                (this.shapes as any).forEach(function (shape: Highcharts.SVGElement): void {
                    shape.translate(translation.x, translation.y);
                });
                (this.labels as any).forEach(function (label: Highcharts.SVGElement): void {
                    label.translate(translation.x, translation.y);
                });
            }

            this.redraw(false);
        }
    },

    /**
     * Map mouse move event to the radians.
     */
    mouseMoveToRadians: function (
        this: Highcharts.AnnotationEventEmitter,
        e: Highcharts.AnnotationEventObject,
        cx: number,
        cy: number
    ): number {
        var prevDy = e.prevChartY - cy,
            prevDx = e.prevChartX - cx,
            dy = e.chartY - cy,
            dx = e.chartX - cx,
            temp;

        if (this.chart.inverted) {
            temp = prevDx;
            prevDx = prevDy;
            prevDy = temp;

            temp = dx;
            dx = dy;
            dy = temp;
        }

        return Math.atan2(dy, dx) - Math.atan2(prevDy, prevDx);
    },

    /**
     * Map mouse move event to the distance between two following events.
     */
    mouseMoveToTranslation: function (
        this: Highcharts.AnnotationEventEmitter,
        e: Highcharts.AnnotationEventObject
    ): Highcharts.PositionObject {
        var dx = e.chartX - e.prevChartX,
            dy = e.chartY - e.prevChartY,
            temp;

        if (this.chart.inverted) {
            temp = dy;
            dy = dx;
            dx = temp;
        }

        return {
            x: dx,
            y: dy
        };
    },

    /**
     * Map mouse move to the scale factors.
     *
     * @param {Object} e event
     * @param {number} cx center x
     * @param {number} cy center y
     **/
    mouseMoveToScale: function (
        this: Highcharts.AnnotationEventEmitter,
        e: Highcharts.AnnotationEventObject,
        cx: number,
        cy: number
    ): Highcharts.PositionObject {
        var prevDx = e.prevChartX - cx,
            prevDy = e.prevChartY - cy,
            dx = e.chartX - cx,
            dy = e.chartY - cy,
            sx = (dx || 1) / (prevDx || 1),
            sy = (dy || 1) / (prevDy || 1),
            temp;

        if (this.chart.inverted) {
            temp = sy;
            sy = sx;
            sx = temp;
        }

        return {
            x: sx,
            y: sy
        };
    },

    /**
     * Destroy the event emitter.
     */
    destroy: function (this: Highcharts.AnnotationEventEmitter): void {
        this.removeDocEvents();

        removeEvent(this);

        this.hcEvents = null;
    }
};

export default eventEmitterMixin;

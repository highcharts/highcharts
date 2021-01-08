/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type Annotation from '../Annotations';
import type { CursorValue } from '../../../Core/Renderer/CSSObject';
import type DOMElementType from '../../../Core/Renderer/DOMElementType';
import type PointerEvent from '../../../Core/PointerEvent';
import type PositionObject from '../../../Core/Renderer/PositionObject';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';
import H from '../../../Core/Globals.js';

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
        interface AnnotationEventObject extends PointerEvent {
            prevChartX: number;
            prevChartY: number;
        }
    }
}

import U from '../../../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    objectEach,
    pick,
    removeEvent
} = U;

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
const eventEmitterMixin: Highcharts.AnnotationEventEmitterMixin = {
    /**
     * Add emitter events.
     */
    addEvents: function (this: Highcharts.AnnotationEventEmitter): void {
        var emitter = this,
            addMouseDownEvent = function (element: DOMElementType): void {
                addEvent(
                    element,
                    H.isTouchDevice ? 'touchstart' : 'mousedown',
                    (e: Highcharts.AnnotationEventObject): void => {
                        emitter.onMouseDown(e);
                    },
                    { passive: false }
                );
            };

        addMouseDownEvent(this.graphic.element);

        (emitter.labels || []).forEach((label): void => {
            if (label.options.useHTML && label.graphic.text) {
                // Mousedown event bound to HTML element (#13070).
                addMouseDownEvent(label.graphic.text.element);
            }
        });

        objectEach(emitter.options.events, function (
            event: Highcharts.EventCallbackFunction<Annotation>,
            type: string
        ): void {
            var eventHandler = function (e: PointerEvent): void {
                if (type !== 'click' || !emitter.cancelClick) {
                    (event as any).call(
                        emitter,
                        emitter.chart.pointer.normalize(e),
                        emitter.target
                    );
                }
            };

            if ((emitter.nonDOMEvents || []).indexOf(type) === -1) {
                emitter.graphic.on(type, eventHandler);
            } else {
                addEvent(emitter, type, eventHandler, { passive: false });
            }
        });

        if (emitter.options.draggable) {

            addEvent(emitter, 'drag', emitter.onDrag);


            if (!emitter.graphic.renderer.styledMode) {
                const cssPointer = {
                    cursor: ({
                        x: 'ew-resize',
                        y: 'ns-resize',
                        xy: 'move'
                    } as Record<string, CursorValue>)[
                        emitter.options.draggable
                    ]
                };

                emitter.graphic.css(cssPointer);

                (emitter.labels || []).forEach((label): void => {
                    if (label.options.useHTML && label.graphic.text) {
                        label.graphic.text.css(cssPointer);
                    }
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
            H.isTouchDevice ? 'touchmove' : 'mousemove',
            function (e: Highcharts.AnnotationEventObject): void {
                emitter.hasDragged = true;

                e = pointer.normalize(e);
                e.prevChartX = prevChartX;
                e.prevChartY = prevChartY;

                fireEvent(emitter, 'drag', e);

                prevChartX = e.chartX;
                prevChartY = e.chartY;
            },
            H.isTouchDevice ? { passive: false } : void 0
        );
        emitter.removeMouseUp = addEvent(
            H.doc,
            H.isTouchDevice ? 'touchend' : 'mouseup',
            function (e: Highcharts.AnnotationEventObject): void {
                emitter.cancelClick = emitter.hasDragged;
                emitter.hasDragged = false;
                emitter.chart.hasDraggedAnnotation = false;
                // ControlPoints vs Annotation:
                fireEvent(pick(emitter.target, emitter), 'afterUpdate');
                emitter.onMouseUp(e);
            },
            H.isTouchDevice ? { passive: false } : void 0
        );
    },

    /**
     * Mouse up handler.
     */
    onMouseUp: function (this: Highcharts.AnnotationEventEmitter, _e: Highcharts.AnnotationEventObject): void {
        var chart = this.chart,
            annotation: Annotation = this.target as any || this,
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
                (this.shapes as any).forEach(function (shape: SVGElement): void {
                    shape.translate(translation.x, translation.y);
                });
                (this.labels as any).forEach(function (label: SVGElement): void {
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
    ): PositionObject {
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
    ): PositionObject {
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

namespace eventEmitterMixin {
    export type Type = Highcharts.AnnotationEventEmitter;
}

export default eventEmitterMixin;

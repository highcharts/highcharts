/* *
 *
 *  (c) 2009-2025 Highsoft, Black Label
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Annotation from './Annotation';
import type AnnotationChart from './AnnotationChart';
import type AnnotationOptions from './AnnotationOptions';
import type {
    ControllableLabelType,
    ControllableShapeType
} from './Controllables/ControllableType';
import type { ControlPointOptionsObject } from './ControlPointOptions';
import type ControlTarget from './ControlTarget';
import type { CursorValue } from '../../Core/Renderer/CSSObject';
import type DOMElementType from '../../Core/Renderer/DOMElementType';
import type EventCallback from '../../Core/EventCallback';
import type PointerEvent from '../../Core/PointerEvent';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import H from '../../Core/Globals.js';
const {
    doc,
    isTouchDevice
} = H;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    objectEach,
    pick,
    removeEvent
} = U;

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
export interface AnnotationEventObject extends PointerEvent {
    prevChartX: number;
    prevChartY: number;
}

/* *
 *
 *  Class
 *
 * */

/**
 * Internal class, but made public because Annotation extends it.
 */
abstract class EventEmitter {

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Add emitter events.
     * @internal
     */
    public addEvents(): void {
        const emitter = this,
            addMouseDownEvent = function (element: DOMElementType): void {
                addEvent(
                    element,
                    isTouchDevice ? 'touchstart' : 'mousedown',
                    (e: AnnotationEventObject): void => {
                        emitter.onMouseDown(e);
                    },
                    { passive: false }
                );
            };

        addMouseDownEvent(this.graphic.element);

        (emitter.labels || []).forEach((label): void => {
            if (
                label.options.useHTML &&
                label.graphic.text &&
                !label.graphic.text.foreignObject
            ) {
                // Mousedown event bound to HTML element (#13070).
                addMouseDownEvent(label.graphic.text.element);
            }
        });

        objectEach(emitter.options.events, (
            event: EventCallback<Annotation>,
            type: string
        ): void => {
            const eventHandler = function (e: PointerEvent): void {
                if (type !== 'click' || !emitter.cancelClick) {
                    (event as any).call(
                        emitter,
                        emitter.chart.pointer?.normalize(e),
                        emitter.target
                    );
                }
            };

            if ((emitter.nonDOMEvents || []).indexOf(type) === -1) {
                addEvent(
                    emitter.graphic.element,
                    type,
                    eventHandler,
                    { passive: false }
                );

                if (emitter.graphic.div) {
                    addEvent(
                        emitter.graphic.div,
                        type,
                        eventHandler,
                        { passive: false }
                    );
                }
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
                    if (
                        label.options.useHTML &&
                        label.graphic.text &&
                        !label.graphic.text.foreignObject
                    ) {
                        label.graphic.text.css(cssPointer);
                    }
                });
            }
        }

        if (!emitter.isUpdating) {
            fireEvent(emitter, 'add');
        }
    }

    /**
     * Destroy the event emitter.
     * @internal
     */
    public destroy(): void {
        this.removeDocEvents();

        removeEvent(this);

        this.hcEvents = null;
    }

    /**
     * Map mouse move event to the radians.
     * @internal
     */
    public mouseMoveToRadians(
        e: AnnotationEventObject,
        cx: number,
        cy: number
    ): number {
        let prevDy = e.prevChartY - cy,
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
    }

    /**
     * Map mouse move to the scale factors.
     * @internal
     */
    public mouseMoveToScale(
        e: AnnotationEventObject,
        cx: number,
        cy: number
    ): PositionObject {
        const prevDx = e.prevChartX - cx,
            prevDy = e.prevChartY - cy,
            dx = e.chartX - cx,
            dy = e.chartY - cy;

        let sx = (dx || 1) / (prevDx || 1),
            sy = (dy || 1) / (prevDy || 1);

        if (this.chart.inverted) {
            const temp = sy;
            sy = sx;
            sx = temp;
        }

        return {
            x: sx,
            y: sy
        };
    }

    /**
     * Map mouse move event to the distance between two following events.
     * @internal
     */
    public mouseMoveToTranslation(
        e: AnnotationEventObject
    ): PositionObject {
        let dx = e.chartX - e.prevChartX,
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
    }

    /**
     * Drag and drop event. All basic annotations should share this
     * capability as well as the extended ones.
     * @internal
     */
    public onDrag(
        e: AnnotationEventObject
    ): void {
        if (
            this.chart.isInsidePlot(
                e.chartX - this.chart.plotLeft,
                e.chartY - this.chart.plotTop,
                {
                    visiblePlotOnly: true
                }
            )
        ) {
            const translation = this.mouseMoveToTranslation(e);

            if (this.options.draggable === 'x') {
                translation.y = 0;
            }

            if (this.options.draggable === 'y') {
                translation.x = 0;
            }

            const emitter = this as (ControlTarget&Required<EventEmitter>);

            if (emitter.points.length) {
                emitter.translate(translation.x, translation.y);
            } else {
                emitter.shapes.forEach((shape): void =>
                    shape.translate(translation.x, translation.y)
                );
                emitter.labels.forEach((label): void =>
                    label.translate(translation.x, translation.y)
                );
            }

            this.redraw(false);
        }
    }

    /**
     * Mouse down handler.
     * @internal
     */
    public onMouseDown(
        e: AnnotationEventObject
    ): void {

        if (e.preventDefault) {
            e.preventDefault();
        }

        // On right click, do nothing:
        if (e.button === 2) {
            return;
        }

        const emitter = this,
            pointer = emitter.chart.pointer,
            // Using experimental property on event object to check if event was
            // created by touch on screen on hybrid device (#18122)
            firesTouchEvents = (
                (e as any)?.sourceCapabilities?.firesTouchEvents
            ) || false;

        e = pointer?.normalize(e) || e;

        let prevChartX = e.chartX,
            prevChartY = e.chartY;

        emitter.cancelClick = false;
        emitter.chart.hasDraggedAnnotation = true;
        emitter.removeDrag = addEvent(
            doc,
            isTouchDevice || firesTouchEvents ? 'touchmove' : 'mousemove',
            function (e: AnnotationEventObject): void {
                emitter.hasDragged = true;

                e = pointer?.normalize(e) || e;
                e.prevChartX = prevChartX;
                e.prevChartY = prevChartY;

                fireEvent(emitter, 'drag', e);

                prevChartX = e.chartX;
                prevChartY = e.chartY;
            },
            isTouchDevice || firesTouchEvents ? { passive: false } : void 0
        );
        emitter.removeMouseUp = addEvent(
            doc,
            isTouchDevice || firesTouchEvents ? 'touchend' : 'mouseup',
            function (): void {
                // Sometimes the target is the annotation and sometimes its the
                // controllable
                const annotation = pick(
                    emitter.target && emitter.target.annotation,
                    emitter.target
                ) as Annotation;
                if (annotation) {
                    // Keep annotation selected after dragging control point
                    annotation.cancelClick = emitter.hasDragged;
                }

                emitter.cancelClick = emitter.hasDragged;
                emitter.chart.hasDraggedAnnotation = false;
                if (emitter.hasDragged) {
                    // ControlPoints vs Annotation:
                    fireEvent(pick(
                        annotation, // #15952
                        emitter
                    ), 'afterUpdate');
                }
                emitter.hasDragged = false;
                emitter.onMouseUp();
            },
            isTouchDevice || firesTouchEvents ? { passive: false } : void 0
        );
    }

    /**
     * Mouse up handler.
     * @internal
     */
    public onMouseUp(): void {
        this.removeDocEvents();
    }

    /** @internal */
    abstract redraw(animation?: boolean): void;

    /**
     * Remove emitter document events.
     * @internal
     */
    public removeDocEvents(): void {
        if (this.removeDrag) {
            this.removeDrag = this.removeDrag();
        }

        if (this.removeMouseUp) {
            this.removeMouseUp = this.removeMouseUp();
        }
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface EventEmitter {
    /** @internal */
    cancelClick?: boolean;

    /** @internal */
    chart: AnnotationChart;

    /** @internal */
    graphic: SVGElement;

    /** @internal */
    hasDragged?: boolean;

    /** @internal */
    hcEvents?: unknown;

    /** @internal */
    isUpdating?: boolean;

    /** @internal */
    labels?: Array<ControllableLabelType>;

    /** @internal */
    nonDOMEvents?: Array<string>;

    /** @internal */
    options: Partial<(ControlPointOptionsObject|AnnotationOptions)>;

    /** @internal */
    removeDrag?: Function;

    /** @internal */
    removeMouseUp?: Function;

    /** @internal */
    shapes?: Array<ControllableShapeType>;

    /** @internal */
    target?: ControlTarget;
}

/* *
 *
 *  Default Export
 *
 * */

export default EventEmitter;

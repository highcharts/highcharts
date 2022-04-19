/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import H from '../../../Core/Globals.js';
import U from '../../../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent, objectEach = U.objectEach, pick = U.pick, removeEvent = U.removeEvent;
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
 */
var eventEmitterMixin = {
    /**
     * Add emitter events.
     */
    addEvents: function () {
        var emitter = this, addMouseDownEvent = function (element) {
            addEvent(element, H.isTouchDevice ? 'touchstart' : 'mousedown', function (e) {
                emitter.onMouseDown(e);
            }, { passive: false });
        };
        addMouseDownEvent(this.graphic.element);
        (emitter.labels || []).forEach(function (label) {
            if (label.options.useHTML && label.graphic.text) {
                // Mousedown event bound to HTML element (#13070).
                addMouseDownEvent(label.graphic.text.element);
            }
        });
        objectEach(emitter.options.events, function (event, type) {
            var eventHandler = function (e) {
                if (type !== 'click' || !emitter.cancelClick) {
                    event.call(emitter, emitter.chart.pointer.normalize(e), emitter.target);
                }
            };
            if ((emitter.nonDOMEvents || []).indexOf(type) === -1) {
                emitter.graphic.on(type, eventHandler);
            }
            else {
                addEvent(emitter, type, eventHandler, { passive: false });
            }
        });
        if (emitter.options.draggable) {
            addEvent(emitter, 'drag', emitter.onDrag);
            if (!emitter.graphic.renderer.styledMode) {
                var cssPointer_1 = {
                    cursor: {
                        x: 'ew-resize',
                        y: 'ns-resize',
                        xy: 'move'
                    }[emitter.options.draggable]
                };
                emitter.graphic.css(cssPointer_1);
                (emitter.labels || []).forEach(function (label) {
                    if (label.options.useHTML && label.graphic.text) {
                        label.graphic.text.css(cssPointer_1);
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
    removeDocEvents: function () {
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
    onMouseDown: function (e) {
        var emitter = this, pointer = emitter.chart.pointer, prevChartX, prevChartY;
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
        emitter.removeDrag = addEvent(H.doc, H.isTouchDevice ? 'touchmove' : 'mousemove', function (e) {
            emitter.hasDragged = true;
            e = pointer.normalize(e);
            e.prevChartX = prevChartX;
            e.prevChartY = prevChartY;
            fireEvent(emitter, 'drag', e);
            prevChartX = e.chartX;
            prevChartY = e.chartY;
        }, H.isTouchDevice ? { passive: false } : void 0);
        emitter.removeMouseUp = addEvent(H.doc, H.isTouchDevice ? 'touchend' : 'mouseup', function (e) {
            // Sometimes the target is the annotation and sometimes its the
            // controllable
            var annotation = pick(emitter.target && emitter.target.annotation, emitter.target);
            if (annotation) {
                // Keep annotation selected after dragging control point
                annotation.cancelClick = emitter.hasDragged;
            }
            emitter.cancelClick = emitter.hasDragged;
            emitter.hasDragged = false;
            emitter.chart.hasDraggedAnnotation = false;
            // ControlPoints vs Annotation:
            fireEvent(pick(annotation, // #15952
            emitter), 'afterUpdate');
            emitter.onMouseUp(e);
        }, H.isTouchDevice ? { passive: false } : void 0);
    },
    /**
     * Mouse up handler.
     */
    onMouseUp: function (_e) {
        var chart = this.chart, annotation = this.target || this, annotationsOptions = chart.options.annotations, index = chart.annotations.indexOf(annotation);
        this.removeDocEvents();
        annotationsOptions[index] = annotation.options;
    },
    /**
     * Drag and drop event. All basic annotations should share this
     * capability as well as the extended ones.
     */
    onDrag: function (e) {
        if (this.chart.isInsidePlot(e.chartX - this.chart.plotLeft, e.chartY - this.chart.plotTop, {
            visiblePlotOnly: true
        })) {
            var translation_1 = this.mouseMoveToTranslation(e);
            if (this.options.draggable === 'x') {
                translation_1.y = 0;
            }
            if (this.options.draggable === 'y') {
                translation_1.x = 0;
            }
            if (this.points.length) {
                this.translate(translation_1.x, translation_1.y);
            }
            else {
                this.shapes.forEach(function (shape) {
                    shape.translate(translation_1.x, translation_1.y);
                });
                this.labels.forEach(function (label) {
                    label.translate(translation_1.x, translation_1.y);
                });
            }
            this.redraw(false);
        }
    },
    /**
     * Map mouse move event to the radians.
     */
    mouseMoveToRadians: function (e, cx, cy) {
        var prevDy = e.prevChartY - cy, prevDx = e.prevChartX - cx, dy = e.chartY - cy, dx = e.chartX - cx, temp;
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
    mouseMoveToTranslation: function (e) {
        var dx = e.chartX - e.prevChartX, dy = e.chartY - e.prevChartY, temp;
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
    mouseMoveToScale: function (e, cx, cy) {
        var prevDx = e.prevChartX - cx, prevDy = e.prevChartY - cy, dx = e.chartX - cx, dy = e.chartY - cy, sx = (dx || 1) / (prevDx || 1), sy = (dy || 1) / (prevDy || 1), temp;
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
    destroy: function () {
        this.removeDocEvents();
        removeEvent(this);
        this.hcEvents = null;
    }
};
export default eventEmitterMixin;

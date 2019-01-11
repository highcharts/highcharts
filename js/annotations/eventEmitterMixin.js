import H from '../parts/Globals.js';
import '../parts/Utilities.js';

/**
 * It provides methods for:
 * - adding and handling DOM events and a drag event,
 * - mapping a mouse move event to the distance between two following events.
 *   The units of the distance are specific to a transformation,
 *   e.g. for rotation they are radians, for scaling they are scale factors.
 *
 * @mixin
 * @memberOf Annotation
 */
var eventEmitterMixin = {
    /**
     * Add emitter events.
     */
    addEvents: function () {
        var emitter = this;

        H.addEvent(
            emitter.graphic.element,
            'mousedown',
            function (e) {
                emitter.onMouseDown(e);
            }
        );

        H.objectEach(emitter.options.events, function (event, type) {
            var eventHandler = function (e) {
                if (type !== 'click' || !emitter.cancelClick) {
                    event.call(
                        emitter,
                        emitter.chart.pointer.normalize(e),
                        emitter.target
                    );
                }
            };

            if (type !== 'drag') {
                emitter.graphic.on(type, eventHandler);
            } else {
                H.addEvent(emitter, 'drag', eventHandler);
            }
        });

        if (emitter.options.draggable) {
            H.addEvent(emitter, 'drag', emitter.onDrag);

            if (!emitter.graphic.renderer.styledMode) {
                emitter.graphic.css({
                    cursor: {
                        x: 'ew-resize',
                        y: 'ns-resize',
                        xy: 'move'
                    }[emitter.options.draggable]
                });
            }
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
     *
     * @param {Object} e event
     */
    onMouseDown: function (e) {
        var emitter = this,
            pointer = emitter.chart.pointer,
            prevChartX,
            prevChartY;

        // On right click, do nothing:
        if (e.button === 2) {
            return;
        }

        e.stopPropagation();

        e = pointer.normalize(e);
        prevChartX = e.chartX;
        prevChartY = e.chartY;

        emitter.cancelClick = false;

        emitter.removeDrag = H.addEvent(
            H.doc,
            'mousemove',
            function (e) {
                emitter.hasDragged = true;

                e = pointer.normalize(e);
                e.prevChartX = prevChartX;
                e.prevChartY = prevChartY;

                H.fireEvent(emitter, 'drag', e);

                prevChartX = e.chartX;
                prevChartY = e.chartY;
            }
        );

        emitter.removeMouseUp = H.addEvent(
            H.doc,
            'mouseup',
            function (e) {
                emitter.cancelClick = emitter.hasDragged;
                emitter.hasDragged = false;

                emitter.onMouseUp(e);
            }
        );
    },

    /**
     * Mouse up handler.
     *
     * @param {Object} e event
     */
    onMouseUp: function () {
        var chart = this.chart,
            annotation = this.target || this,
            annotationsOptions = chart.options.annotations,
            index = chart.annotations.indexOf(annotation);

        this.removeDocEvents();

        annotationsOptions[index] = annotation.options;
    },

    /**
     * Drag and drop event. All basic annotations should share this
     * capability as well as the extended ones.
     *
     * @param {Object} e event
     */
    onDrag: function (e) {
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

            if (this.points.length) {
                this.translate(translation.x, translation.y);
            } else {
                this.shapes.forEach(function (shape) {
                    shape.translate(translation.x, translation.y);
                });
                this.labels.forEach(function (label) {
                    label.translate(translation.x, translation.y);
                });
            }

            this.redraw(false);
        }
    },

    /**
     * Map mouse move event to the radians.
     *
     * @param {Object} e event
     * @param {number} cx center x
     * @param {number} cy center y
     */
    mouseMoveToRadians: function (e, cx, cy) {
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
     *
     * @param {Object} e event
     */
    mouseMoveToTranslation: function (e) {
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
    mouseMoveToScale: function (e, cx, cy) {
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
    destroy: function () {
        this.removeDocEvents();

        H.removeEvent(this);

        this.hcEvents = null;
    }
};

export default eventEmitterMixin;

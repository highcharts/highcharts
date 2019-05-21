/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from './Globals.js';
import './Utilities.js';
var charts = H.charts, extend = H.extend, noop = H.noop, pick = H.pick, Pointer = H.Pointer;
/* eslint-disable no-invalid-this, valid-jsdoc */
// Support for touch devices
extend(Pointer.prototype, /** @lends Pointer.prototype */ {
    /**
     * Run translation operations
     *
     * @private
     * @function Highcharts.Pointer#pinchTranslate
     *
     * @param {Array<*>} pinchDown
     *
     * @param {Array<*>} touches
     *
     * @param {*} transform
     *
     * @param {*} selectionMarker
     *
     * @param {*} clip
     *
     * @param {*} lastValidTouch
     *
     * @return {void}
     */
    pinchTranslate: function (pinchDown, touches, transform, selectionMarker, clip, lastValidTouch) {
        if (this.zoomHor) {
            this.pinchTranslateDirection(true, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch);
        }
        if (this.zoomVert) {
            this.pinchTranslateDirection(false, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch);
        }
    },
    /**
     * Run translation operations for each direction (horizontal and vertical)
     * independently.
     *
     * @private
     * @function Highcharts.Pointer#pinchTranslateDirection
     *
     * @param {boolean} horiz
     *
     * @param {Array<*>} pinchDown
     *
     * @param {Array<*>} touches
     *
     * @param {*} transform
     *
     * @param {*} selectionMarker
     *
     * @param {*} clip
     *
     * @param {*} lastValidTouch
     *
     * @param {number|undefined} [forcedScale=1]
     *
     * @return {void}
     */
    pinchTranslateDirection: function (horiz, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch, forcedScale) {
        var chart = this.chart, xy = horiz ? 'x' : 'y', XY = horiz ? 'X' : 'Y', sChartXY = 'chart' + XY, wh = horiz ? 'width' : 'height', plotLeftTop = chart['plot' + (horiz ? 'Left' : 'Top')], selectionWH, selectionXY, clipXY, scale = forcedScale || 1, inverted = chart.inverted, bounds = chart.bounds[horiz ? 'h' : 'v'], singleTouch = pinchDown.length === 1, touch0Start = pinchDown[0][sChartXY], touch0Now = touches[0][sChartXY], touch1Start = !singleTouch && pinchDown[1][sChartXY], touch1Now = !singleTouch && touches[1][sChartXY], outOfBounds, transformScale, scaleKey, setScale = function () {
            // Don't zoom if fingers are too close on this axis
            if (!singleTouch && Math.abs(touch0Start - touch1Start) > 20) {
                scale = forcedScale ||
                    Math.abs(touch0Now - touch1Now) /
                        Math.abs(touch0Start - touch1Start);
            }
            clipXY = ((plotLeftTop - touch0Now) / scale) + touch0Start;
            selectionWH = chart['plot' + (horiz ? 'Width' : 'Height')] / scale;
        };
        // Set the scale, first pass
        setScale();
        // The clip position (x or y) is altered if out of bounds, the selection
        // position is not
        selectionXY = clipXY;
        // Out of bounds
        if (selectionXY < bounds.min) {
            selectionXY = bounds.min;
            outOfBounds = true;
        }
        else if (selectionXY + selectionWH > bounds.max) {
            selectionXY = bounds.max - selectionWH;
            outOfBounds = true;
        }
        // Is the chart dragged off its bounds, determined by dataMin and
        // dataMax?
        if (outOfBounds) {
            // Modify the touchNow position in order to create an elastic drag
            // movement. This indicates to the user that the chart is responsive
            // but can't be dragged further.
            touch0Now -= 0.8 * (touch0Now - lastValidTouch[xy][0]);
            if (!singleTouch) {
                touch1Now -= 0.8 * (touch1Now - lastValidTouch[xy][1]);
            }
            // Set the scale, second pass to adapt to the modified touchNow
            // positions
            setScale();
        }
        else {
            lastValidTouch[xy] = [touch0Now, touch1Now];
        }
        // Set geometry for clipping, selection and transformation
        if (!inverted) {
            clip[xy] = clipXY - plotLeftTop;
            clip[wh] = selectionWH;
        }
        scaleKey = inverted ? (horiz ? 'scaleY' : 'scaleX') : 'scale' + XY;
        transformScale = inverted ? 1 / scale : scale;
        selectionMarker[wh] = selectionWH;
        selectionMarker[xy] = selectionXY;
        transform[scaleKey] = scale;
        transform['translate' + XY] = (transformScale * plotLeftTop) +
            (touch0Now - (transformScale * touch0Start));
    },
    /**
     * Handle touch events with two touches
     *
     * @private
     * @function Highcharts.Pointer#pinch
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    pinch: function (e) {
        var self = this, chart = self.chart, pinchDown = self.pinchDown, touches = e.touches, touchesLength = touches.length, lastValidTouch = self.lastValidTouch, hasZoom = self.hasZoom, selectionMarker = self.selectionMarker, transform = {}, fireClickEvent = touchesLength === 1 && ((self.inClass(e.target, 'highcharts-tracker') &&
            chart.runTrackerClick) ||
            self.runChartClick), clip = {};
        // Don't initiate panning until the user has pinched. This prevents us
        // from blocking page scrolling as users scroll down a long page
        // (#4210).
        if (touchesLength > 1) {
            self.initiated = true;
        }
        // On touch devices, only proceed to trigger click if a handler is
        // defined
        if (hasZoom && self.initiated && !fireClickEvent) {
            e.preventDefault();
        }
        // Normalize each touch
        [].map.call(touches, function (e) {
            return self.normalize(e);
        });
        // Register the touch start position
        if (e.type === 'touchstart') {
            [].forEach.call(touches, function (e, i) {
                pinchDown[i] = { chartX: e.chartX, chartY: e.chartY };
            });
            lastValidTouch.x = [pinchDown[0].chartX, pinchDown[1] &&
                    pinchDown[1].chartX];
            lastValidTouch.y = [pinchDown[0].chartY, pinchDown[1] &&
                    pinchDown[1].chartY];
            // Identify the data bounds in pixels
            chart.axes.forEach(function (axis) {
                if (axis.zoomEnabled) {
                    var bounds = chart.bounds[axis.horiz ? 'h' : 'v'], minPixelPadding = axis.minPixelPadding, min = axis.toPixels(Math.min(pick(axis.options.min, axis.dataMin), axis.dataMin)), max = axis.toPixels(Math.max(pick(axis.options.max, axis.dataMax), axis.dataMax)), absMin = Math.min(min, max), absMax = Math.max(min, max);
                    // Store the bounds for use in the touchmove handler
                    bounds.min = Math.min(axis.pos, absMin - minPixelPadding);
                    bounds.max = Math.max(axis.pos + axis.len, absMax + minPixelPadding);
                }
            });
            self.res = true; // reset on next move
            // Optionally move the tooltip on touchmove
        }
        else if (self.followTouchMove && touchesLength === 1) {
            this.runPointActions(self.normalize(e));
            // Event type is touchmove, handle panning and pinching
        }
        else if (pinchDown.length) { // can be 0 when releasing, if touchend
            // fires first
            // Set the marker
            if (!selectionMarker) {
                self.selectionMarker = selectionMarker = extend({
                    destroy: noop,
                    touch: true
                }, chart.plotBox);
            }
            self.pinchTranslate(pinchDown, touches, transform, selectionMarker, clip, lastValidTouch);
            self.hasPinched = hasZoom;
            // Scale and translate the groups to provide visual feedback during
            // pinching
            self.scaleGroups(transform, clip);
            if (self.res) {
                self.res = false;
                this.reset(false, 0);
            }
        }
    },
    /**
     * General touch handler shared by touchstart and touchmove.
     *
     * @private
     * @function Highcharts.Pointer#touch
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @param {boolean} [start]
     *
     * @return {void}
     */
    touch: function (e, start) {
        var chart = this.chart, hasMoved, pinchDown, isInside;
        if (chart.index !== H.hoverChartIndex) {
            this.onContainerMouseLeave({ relatedTarget: true });
        }
        H.hoverChartIndex = chart.index;
        if (e.touches.length === 1) {
            e = this.normalize(e);
            isInside = chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop);
            if (isInside && !chart.openMenu) {
                // Run mouse events and display tooltip etc
                if (start) {
                    this.runPointActions(e);
                }
                // Android fires touchmove events after the touchstart even if
                // the finger hasn't moved, or moved only a pixel or two. In iOS
                // however, the touchmove doesn't fire unless the finger moves
                // more than ~4px. So we emulate this behaviour in Android by
                // checking how much it moved, and cancelling on small
                // distances. #3450.
                if (e.type === 'touchmove') {
                    pinchDown = this.pinchDown;
                    hasMoved = pinchDown[0] ? Math.sqrt(// #5266
                    Math.pow(pinchDown[0].chartX - e.chartX, 2) +
                        Math.pow(pinchDown[0].chartY - e.chartY, 2)) >= 4 : false;
                }
                if (pick(hasMoved, true)) {
                    this.pinch(e);
                }
            }
            else if (start) {
                // Hide the tooltip on touching outside the plot area (#1203)
                this.reset();
            }
        }
        else if (e.touches.length === 2) {
            this.pinch(e);
        }
    },
    /**
     * @private
     * @function Highcharts.Pointer#onContainerTouchStart
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    onContainerTouchStart: function (e) {
        this.zoomOption(e);
        this.touch(e, true);
    },
    /**
     * @private
     * @function Highcharts.Pointer#onContainerTouchMove
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    onContainerTouchMove: function (e) {
        this.touch(e);
    },
    /**
     * @private
     * @function Highcharts.Pointer#onDocumentTouchEnd
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    onDocumentTouchEnd: function (e) {
        if (charts[H.hoverChartIndex]) {
            charts[H.hoverChartIndex].pointer.drop(e);
        }
    }
});

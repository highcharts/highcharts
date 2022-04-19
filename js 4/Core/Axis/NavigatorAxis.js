/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../Globals.js';
var isTouchDevice = H.isTouchDevice;
import U from '../Utilities.js';
var addEvent = U.addEvent, correctFloat = U.correctFloat, defined = U.defined, isNumber = U.isNumber, pick = U.pick;
/* eslint-disable valid-jsdoc */
/**
 * @private
 * @class
 */
var NavigatorAxisAdditions = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function NavigatorAxisAdditions(axis) {
        this.axis = axis;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * @private
     */
    NavigatorAxisAdditions.prototype.destroy = function () {
        this.axis = void 0;
    };
    /**
     * Add logic to normalize the zoomed range in order to preserve the pressed
     * state of range selector buttons
     *
     * @private
     * @function Highcharts.Axis#toFixedRange
     */
    NavigatorAxisAdditions.prototype.toFixedRange = function (pxMin, pxMax, fixedMin, fixedMax) {
        var navigator = this;
        var axis = navigator.axis;
        var chart = axis.chart;
        var fixedRange = chart && chart.fixedRange, halfPointRange = (axis.pointRange || 0) / 2, newMin = pick(fixedMin, axis.translate(pxMin, true, !axis.horiz)), newMax = pick(fixedMax, axis.translate(pxMax, true, !axis.horiz)), changeRatio = fixedRange && (newMax - newMin) / fixedRange;
        // Add/remove half point range to/from the extremes (#1172)
        if (!defined(fixedMin)) {
            newMin = correctFloat(newMin + halfPointRange);
        }
        if (!defined(fixedMax)) {
            newMax = correctFloat(newMax - halfPointRange);
        }
        // If the difference between the fixed range and the actual requested
        // range is too great, the user is dragging across an ordinal gap, and
        // we need to release the range selector button.
        if (changeRatio > 0.7 && changeRatio < 1.3) {
            if (fixedMax) {
                newMin = newMax - fixedRange;
            }
            else {
                newMax = newMin + fixedRange;
            }
        }
        if (!isNumber(newMin) || !isNumber(newMax)) { // #1195, #7411
            newMin = newMax = void 0;
        }
        return {
            min: newMin,
            max: newMax
        };
    };
    return NavigatorAxisAdditions;
}());
/**
 * @private
 * @class
 */
var NavigatorAxis = /** @class */ (function () {
    function NavigatorAxis() {
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * @private
     */
    NavigatorAxis.compose = function (AxisClass) {
        AxisClass.keepProps.push('navigatorAxis');
        /* eslint-disable no-invalid-this */
        addEvent(AxisClass, 'init', function () {
            var axis = this;
            if (!axis.navigatorAxis) {
                axis.navigatorAxis = new NavigatorAxisAdditions(axis);
            }
        });
        // For Stock charts, override selection zooming with some special
        // features because X axis zooming is already allowed by the Navigator
        // and Range selector.
        addEvent(AxisClass, 'zoom', function (e) {
            var axis = this;
            var chart = axis.chart;
            var chartOptions = chart.options;
            var navigator = chartOptions.navigator;
            var navigatorAxis = axis.navigatorAxis;
            var pinchType = chartOptions.chart.pinchType;
            var rangeSelector = chartOptions.rangeSelector;
            var zoomType = chartOptions.chart.zoomType;
            var previousZoom;
            if (axis.isXAxis && ((navigator && navigator.enabled) ||
                (rangeSelector && rangeSelector.enabled))) {
                // For y only zooming, ignore the X axis completely
                if (zoomType === 'y') {
                    e.zoomed = false;
                    // For xy zooming, record the state of the zoom before zoom
                    // selection, then when the reset button is pressed, revert to
                    // this state. This should apply only if the chart is
                    // initialized with a range (#6612), otherwise zoom all the way
                    // out.
                }
                else if (((!isTouchDevice && zoomType === 'xy') ||
                    (isTouchDevice && pinchType === 'xy')) &&
                    axis.options.range) {
                    previousZoom = navigatorAxis.previousZoom;
                    if (defined(e.newMin)) {
                        navigatorAxis.previousZoom = [axis.min, axis.max];
                    }
                    else if (previousZoom) {
                        e.newMin = previousZoom[0];
                        e.newMax = previousZoom[1];
                        navigatorAxis.previousZoom = void 0;
                    }
                }
            }
            if (typeof e.zoomed !== 'undefined') {
                e.preventDefault();
            }
        });
        /* eslint-enable no-invalid-this */
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * @private
     */
    NavigatorAxis.AdditionsClass = NavigatorAxisAdditions;
    return NavigatorAxis;
}());
export default NavigatorAxis;

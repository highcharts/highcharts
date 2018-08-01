/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Pointer.js';
var extend = H.extend,
    pick = H.pick,
    Pointer = H.Pointer,
    wrap = H.wrap;

// Extend the Pointer
extend(Pointer.prototype, {

    /**
     * The event handler for the doubleclick event
     */
    onContainerDblClick: function (e) {
        var chart = this.chart;

        e = this.normalize(e);

        if (chart.options.mapNavigation.enableDoubleClickZoomTo) {
            if (
                chart.pointer.inClass(e.target, 'highcharts-tracker') &&
                chart.hoverPoint
            ) {
                chart.hoverPoint.zoomTo();
            }
        } else if (
            chart.isInsidePlot(
                e.chartX - chart.plotLeft,
                e.chartY - chart.plotTop
            )
        ) {
            chart.mapZoom(
                0.5,
                chart.xAxis[0].toValue(e.chartX),
                chart.yAxis[0].toValue(e.chartY),
                e.chartX,
                e.chartY
            );
        }
    },

    /**
     * The event handler for the mouse scroll event
     */
    onContainerMouseWheel: function (e) {
        var chart = this.chart,
            delta;

        e = this.normalize(e);

        // Firefox uses e.detail, WebKit and IE uses wheelDelta
        delta = e.detail || -(e.wheelDelta / 120);
        if (chart.isInsidePlot(
            e.chartX - chart.plotLeft,
            e.chartY - chart.plotTop)
        ) {
            chart.mapZoom(
                Math.pow(
                    chart.options.mapNavigation.mouseWheelSensitivity,
                    delta
                ),
                chart.xAxis[0].toValue(e.chartX),
                chart.yAxis[0].toValue(e.chartY),
                e.chartX,
                e.chartY
            );
        }
    }
});

// The pinchType is inferred from mapNavigation options.
wrap(Pointer.prototype, 'zoomOption', function (proceed) {


    var mapNavigation = this.chart.options.mapNavigation;

    // Pinch status
    if (pick(mapNavigation.enableTouchZoom, mapNavigation.enabled)) {
        this.chart.options.chart.pinchType = 'xy';
    }

    proceed.apply(this, [].slice.call(arguments, 1));

});

// Extend the pinchTranslate method to preserve fixed ratio when zooming
wrap(
    Pointer.prototype,
    'pinchTranslate',
    function (
        proceed,
        pinchDown,
        touches,
        transform,
        selectionMarker,
        clip,
        lastValidTouch
    ) {
        var xBigger;
        proceed.call(
            this,
            pinchDown,
            touches,
            transform,
            selectionMarker,
            clip,
            lastValidTouch
        );

        // Keep ratio
        if (this.chart.options.chart.type === 'map' && this.hasZoom) {
            xBigger = transform.scaleX > transform.scaleY;
            this.pinchTranslateDirection(
                !xBigger,
                pinchDown,
                touches,
                transform,
                selectionMarker,
                clip,
                lastValidTouch,
                xBigger ? transform.scaleX : transform.scaleY
            );
        }
    }
);

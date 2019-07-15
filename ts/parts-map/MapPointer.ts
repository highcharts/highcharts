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

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Pointer {
            onContainerDblClick(e: PointerEventObject): void;
            onContainerMouseWheel(e: PointerEventObject): void;
        }
        interface PointerWheelEventObject extends PointerEventObject {
            /** @deprecated */
            wheelDelta: number;
        }
    }
}

import '../parts/Utilities.js';
import '../parts/Pointer.js';

var extend = H.extend,
    pick = H.pick,
    Pointer = H.Pointer,
    wrap = H.wrap;

/* eslint-disable no-invalid-this */

// Extend the Pointer
extend(Pointer.prototype, {

    // The event handler for the doubleclick event
    onContainerDblClick: function (
        this: Highcharts.Pointer,
        e: Highcharts.PointerEventObject
    ): void {
        var chart = this.chart;

        e = this.normalize(e);

        if (chart.options.mapNavigation.enableDoubleClickZoomTo) {
            if (
                chart.pointer.inClass(e.target as any, 'highcharts-tracker') &&
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

    // The event handler for the mouse scroll event
    onContainerMouseWheel: function (
        this: Highcharts.Pointer,
        e: Highcharts.PointerWheelEventObject
    ): void {
        var chart = this.chart,
            delta;

        e = this.normalize(e);

        // Firefox uses e.detail, WebKit and IE uses wheelDelta
        delta = e.detail || -(e.wheelDelta / 120);
        if (chart.isInsidePlot(
            e.chartX - chart.plotLeft,
            e.chartY - chart.plotTop
        )) {
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
wrap(Pointer.prototype, 'zoomOption', function (
    this: Highcharts.Pointer,
    proceed: Function
): void {


    var mapNavigation = this.chart.options.mapNavigation;

    // Pinch status
    if (pick(mapNavigation.enableTouchZoom, mapNavigation.enabled)) {
        (this.chart.options.chart as any).pinchType = 'xy';
    }

    proceed.apply(this, [].slice.call(arguments, 1));

});

// Extend the pinchTranslate method to preserve fixed ratio when zooming
wrap(
    Pointer.prototype,
    'pinchTranslate',
    function (
        this: Highcharts.Pointer,
        proceed: Function,
        pinchDown: Array<any>,
        touches: Array<any>,
        transform: any,
        selectionMarker: any,
        clip: any,
        lastValidTouch: any
    ): void {
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
        if ((this.chart.options.chart as any).type === 'map' && this.hasZoom) {
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

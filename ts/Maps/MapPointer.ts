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

import type PointerEvent from '../Core/PointerEvent';
import Pointer from '../Core/Pointer.js';
import U from '../Core/Utilities.js';
const {
    extend,
    pick,
    wrap
} = U;

declare module '../Core/PointerEvent' {
    interface PointerEvent {
        /** @deprecated */
        wheelDelta: number;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface MapPointer extends Pointer {
            chart: MapPointerChart;
            mapNavigation: MapNavigation;
            onContainerDblClick(e: PointerEvent): void;
            onContainerMouseWheel(e: PointerEvent): void;
        }
        interface MapPointerChart extends MapChart {
            hoverPoint: MapPoint;
            mapZoom: MapNavigationChart['mapZoom'];
        }
    }
}

/* eslint-disable no-invalid-this */

// Extend the Pointer
extend(Pointer.prototype, {

    // The event handler for the doubleclick event
    onContainerDblClick: function (
        this: Highcharts.MapPointer,
        e: PointerEvent
    ): void {
        var chart = this.chart;

        e = this.normalize(e);

        if ((chart.options.mapNavigation as any).enableDoubleClickZoomTo) {
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
        this: Highcharts.MapPointer,
        e: PointerEvent
    ): void {
        var chart = this.chart,
            delta;

        e = this.normalize(e);

        // Firefox uses e.detail, WebKit and IE uses wheelDelta
        delta = e.detail || -((e.wheelDelta as any) / 120);
        if (chart.isInsidePlot(
            e.chartX - chart.plotLeft,
            e.chartY - chart.plotTop
        )) {
            chart.mapZoom(
                Math.pow(
                    (chart.options.mapNavigation as any).mouseWheelSensitivity,
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
    this: Pointer,
    proceed: Function
): void {


    var mapNavigation = this.chart.options.mapNavigation;

    // Pinch status
    if (pick(
        (mapNavigation as any).enableTouchZoom,
        (mapNavigation as any).enabled)
    ) {
        (this.chart.options.chart as any).pinchType = 'xy';
    }

    proceed.apply(this, [].slice.call(arguments, 1));

});

// Extend the pinchTranslate method to preserve fixed ratio when zooming
wrap(
    Pointer.prototype,
    'pinchTranslate',
    function (
        this: Pointer,
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

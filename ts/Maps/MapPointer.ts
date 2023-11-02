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

/* *
 *
 *  Imports
 *
 * */

import type MapChart from '../Core/Chart/MapChart';
import type MapNavigation from './MapNavigation';
import type Pointer from '../Core/Pointer';
import type PointerEvent from '../Core/PointerEvent';

import U from '../Core/Utilities.js';
const {
    defined,
    extend,
    pick,
    pushUnique,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/PointerEvent' {
    interface PointerEvent {
        deltaY?: number;
        /** @deprecated */
        wheelDelta: number;
    }
}

interface MapPointer extends Pointer {
    chart: MapChart;
    mapNavigation: MapNavigation;
    onContainerDblClick(e: PointerEvent): void;
    onContainerMouseWheel(e: PointerEvent): void;
}

/* *
 *
 *  Composition
 *
 * */

namespace MapPointer {

    /* *
     *
     *  Constants
     *
     * */

    const composedMembers: Array<unknown> = [];

    /* *
     *
     *  Variables
     *
     * */

    let totalWheelDelta = 0;
    let totalWheelDeltaTimer: number;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Extend the Pointer.
     * @private
     */
    export function compose(
        PointerClass: typeof Pointer
    ): void {

        if (pushUnique(composedMembers, PointerClass)) {
            const pointerProto = PointerClass.prototype as MapPointer;

            extend(pointerProto, {
                onContainerDblClick,
                onContainerMouseWheel
            });

            wrap(pointerProto, 'normalize', wrapNormalize);
            wrap(pointerProto, 'pinchTranslate', wrapPinchTranslate);
            wrap(pointerProto, 'zoomOption', wrapZoomOption);
        }
    }

    /**
     * The event handler for the doubleclick event.
     * @private
     */
    function onContainerDblClick(
        this: MapPointer,
        e: PointerEvent
    ): void {
        const chart = this.chart as MapChart;

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
                void 0,
                void 0,
                e.chartX,
                e.chartY
            );
        }
    }

    /**
     * The event handler for the mouse scroll event.
     * @private
     */
    function onContainerMouseWheel(
        this: MapPointer,
        e: PointerEvent
    ): void {
        const chart = this.chart;

        e = this.normalize(e);

        // Firefox uses e.deltaY or e.detail, WebKit and IE uses wheelDelta
        // try wheelDelta first #15656
        const delta = (defined(e.wheelDelta) && -(e.wheelDelta as any) / 120) ||
            e.deltaY || e.detail;

        // Wheel zooming on trackpads have different behaviours in Firefox vs
        // WebKit. In Firefox the delta increments in steps by 1, so it is not
        // distinguishable from true mouse wheel. Therefore we use this timer
        // to avoid trackpad zooming going too fast and out of control. In
        // WebKit however, the delta is < 1, so we simply disable animation in
        // the `chart.mapZoom` call below.
        if (Math.abs(delta) >= 1) {
            totalWheelDelta += Math.abs(delta);
            if (totalWheelDeltaTimer) {
                clearTimeout(totalWheelDeltaTimer);
            }
            totalWheelDeltaTimer = setTimeout((): void => {
                totalWheelDelta = 0;
            }, 50);
        }

        if (totalWheelDelta < 10 && chart.isInsidePlot(
            e.chartX - chart.plotLeft,
            e.chartY - chart.plotTop
        ) && chart.mapView) {
            chart.mapView.zoomBy(
                (
                    (chart.options.mapNavigation as any).mouseWheelSensitivity -
                    1
                ) * -delta,
                void 0,
                [e.chartX, e.chartY],
                // Delta less than 1 indicates stepless/trackpad zooming, avoid
                // animation delaying the zoom
                Math.abs(delta) < 1 ? false : void 0
            );
        }
    }

    /**
     * Add lon and lat information to pointer events
     * @private
     */
    function wrapNormalize(
        this: MapPointer,
        proceed: Function,
        e: PointerEvent,
        chartPosition?: Pointer.ChartPositionObject
    ): PointerEvent {
        const chart = this.chart;

        e = proceed.call(this, e, chartPosition);

        if (chart && chart.mapView) {
            const lonLat = chart.mapView.pixelsToLonLat({
                x: e.chartX - chart.plotLeft,
                y: e.chartY - chart.plotTop
            });
            if (lonLat) {
                extend(e, lonLat);
            }
        }

        return e;
    }

    /**
     * Extend the pinchTranslate method to preserve fixed ratio when zooming.
     * @private
     */
    function wrapPinchTranslate(
        this: MapPointer,
        proceed: Function,
        pinchDown: Array<any>,
        touches: Array<any>,
        transform: any,
        selectionMarker: any,
        clip: any,
        lastValidTouch: any
    ): void {
        let xBigger;

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

    /**
     * The pinchType is inferred from mapNavigation options.
     * @private
     */
    function wrapZoomOption(
        this: Pointer,
        proceed: Function
    ): void {
        const mapNavigation = this.chart.options.mapNavigation;

        // Pinch status
        if (
            mapNavigation &&
            pick(mapNavigation.enableTouchZoom, mapNavigation.enabled)
        ) {
            this.chart.zooming.pinchType = 'xy';
        }

        proceed.apply(this, [].slice.call(arguments, 1));
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default MapPointer;

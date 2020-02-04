/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from './Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    interface Window {
        MSPointerEvent: typeof MSPointerEvent;
        PointerEvent: typeof PointerEvent;
    }
}

/* globals MSPointerEvent, PointerEvent */

import Pointer from './Pointer.js';
import U from './Utilities.js';
const {
    addEvent,
    objectEach,
    removeEvent
} = U;

var charts = H.charts,
    css = H.css,
    doc = H.doc,
    noop = H.noop,
    win = H.win;

// The touches object keeps track of the points being touched at all times
const touches = {} as Highcharts.Dictionary<Highcharts.PointerEventObject>;
const hasPointerEvent = !!win.PointerEvent;

/* eslint-disable valid-jsdoc */

/** @private */
function getWebkitTouches(): void {
    var fake = [] as any;

    fake.item = function (i: string): any {
        return this[i];
    };
    objectEach(touches, function (
        touch: Highcharts.PointerEventObject
    ): void {
        fake.push({
            pageX: touch.pageX,
            pageY: touch.pageY,
            target: touch.target
        });
    });
    return fake;
}

/** @private */
function translateMSPointer(
    e: (PointerEvent|MSPointerEvent),
    method: string,
    wktype: string,
    func: Function
): void {
    var p;

    if (
        (
            e.pointerType === 'touch' ||
            e.pointerType === (e as any).MSPOINTER_TYPE_TOUCH
        ) && charts[H.hoverChartIndex as any]
    ) {
        func(e);
        p = (charts[H.hoverChartIndex as any] as any).pointer;
        p[method]({
            type: wktype,
            target: e.currentTarget,
            preventDefault: noop,
            touches: getWebkitTouches()
        });
    }
}

/** @private */
class MSPointer extends Pointer {

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Add or remove the MS Pointer specific events
     *
     * @private
     * @function Highcharts.Pointer#batchMSEvents
     *
     * @param {Function} fn
     *
     * @return {void}
     */
    private batchMSEvents(fn: Function): void {
        fn(
            this.chart.container,
            hasPointerEvent ? 'pointerdown' : 'MSPointerDown',
            this.onContainerPointerDown
        );
        fn(
            this.chart.container,
            hasPointerEvent ? 'pointermove' : 'MSPointerMove',
            this.onContainerPointerMove
        );
        fn(
            doc,
            hasPointerEvent ? 'pointerup' : 'MSPointerUp',
            this.onDocumentPointerUp
        );
    }

    // Destroy MS events also
    public destroy(): void {

        this.batchMSEvents(removeEvent);

        super.destroy();
    }

    // Disable default IE actions for pinch and such on chart element
    public init(chart: Highcharts.Chart, options: Highcharts.Options): void {

        super.init(chart, options);

        if (this.hasZoom) { // #4014
            css(chart.container, {
                '-ms-touch-action': 'none',
                'touch-action': 'none'
            });
        }
    }

    /**
     * @private
     * @function Highcharts.Pointer#onContainerPointerDown
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    private onContainerPointerDown(e: Highcharts.PointerEventObject): void {
        translateMSPointer(
            e,
            'onContainerTouchStart',
            'touchstart',
            function (e: Highcharts.PointerEventObject): void {
                (touches as any)[e.pointerId] = {
                    pageX: e.pageX,
                    pageY: e.pageY,
                    target: e.currentTarget
                };
            }
        );
    }

    /**
     * @private
     * @function Highcharts.Pointer#onContainerPointerMove
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    private onContainerPointerMove(e: Highcharts.PointerEventObject): void {
        translateMSPointer(
            e,
            'onContainerTouchMove',
            'touchmove',
            function (e: Highcharts.PointerEventObject): void {
                (touches as any)[e.pointerId] = (
                    { pageX: e.pageX, pageY: e.pageY }
                );
                if (!(touches as any)[e.pointerId].target) {
                    (touches as any)[e.pointerId].target = e.currentTarget;
                }
            }
        );
    }

    /**
     * @private
     * @function Highcharts.Pointer#onDocumentPointerUp
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    private onDocumentPointerUp(e: Highcharts.PointerEventObject): void {
        translateMSPointer(
            e,
            'onDocumentTouchEnd',
            'touchend',
            function (e: Highcharts.PointerEventObject): void {
                delete (touches as any)[e.pointerId];
            }
        );
    }

    // Add IE specific touch events to chart
    public setDOMEvents(): void {

        super.setDOMEvents();

        if (this.hasZoom || this.followTouchMove) {
            this.batchMSEvents(addEvent);
        }
    }
}

export default MSPointer;

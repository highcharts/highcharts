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

/**
 * Internal types
 * @private
 */
declare global {
    interface Window {
        MSPointerEvent: typeof MSPointerEvent;
        PointerEvent: typeof PointerEvent;
    }
    namespace Highcharts {
        interface Pointer {
            batchMSEvents: (fn: Function) => void;
            onContainerPointerDown: (e: PointerEventObject) => void;
            onContainerPointerMove: (e: PointerEventObject) => void;
            onDocumentPointerUp: (e: PointerEventObject) => void;
        }
    }
}

/* globals MSPointerEvent, PointerEvent */

import U from './Utilities.js';
const {
    extend,
    objectEach,
    wrap
} = U;

import './Pointer.js';

var addEvent = H.addEvent,
    charts = H.charts,
    css = H.css,
    doc = H.doc,
    hasTouch = H.hasTouch,
    noop = H.noop,
    Pointer = H.Pointer,
    removeEvent = H.removeEvent,
    win = H.win;

if (!hasTouch && (win.PointerEvent || win.MSPointerEvent)) {

    // The touches object keeps track of the points being touched at all times
    var touches = {} as Highcharts.Dictionary<Highcharts.PointerEventObject>,
        hasPointerEvent = !!win.PointerEvent,
        getWebkitTouches = function (): void {
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
        },
        translateMSPointer = function (
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
        };

    /* eslint-disable no-invalid-this, valid-jsdoc */

    // Extend the Pointer prototype with methods for each event handler and more
    extend(Pointer.prototype, /** @lends Pointer.prototype */ {

        /**
         * @private
         * @function Highcharts.Pointer#onContainerPointerDown
         *
         * @param {Highcharts.PointerEventObject} e
         *
         * @return {void}
         */
        onContainerPointerDown: function (
            this: Highcharts.Pointer,
            e: Highcharts.PointerEventObject
        ): void {
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
        },

        /**
         * @private
         * @function Highcharts.Pointer#onContainerPointerMove
         *
         * @param {Highcharts.PointerEventObject} e
         *
         * @return {void}
         */
        onContainerPointerMove: function (
            this: Highcharts.Pointer,
            e: Highcharts.PointerEventObject
        ): void {
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
        },

        /**
         * @private
         * @function Highcharts.Pointer#onDocumentPointerUp
         *
         * @param {Highcharts.PointerEventObject} e
         *
         * @return {void}
         */
        onDocumentPointerUp: function (
            this: Highcharts.Pointer,
            e: Highcharts.PointerEventObject
        ): void {
            translateMSPointer(
                e,
                'onDocumentTouchEnd',
                'touchend',
                function (e: Highcharts.PointerEventObject): void {
                    delete (touches as any)[e.pointerId];
                }
            );
        },

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
        batchMSEvents: function (this: Highcharts.Pointer, fn: Function): void {
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
    });

    // Disable default IE actions for pinch and such on chart element
    wrap(Pointer.prototype, 'init', function (
        this: Highcharts.Pointer,
        proceed: Function,
        chart: Highcharts.Chart,
        options: Highcharts.Options
    ): void {
        proceed.call(this, chart, options);
        if (this.hasZoom) { // #4014
            css(chart.container, {
                '-ms-touch-action': 'none',
                'touch-action': 'none'
            });
        }
    });

    // Add IE specific touch events to chart
    wrap(Pointer.prototype, 'setDOMEvents', function (
        this: Highcharts.Pointer,
        proceed: Function
    ): void {
        proceed.apply(this);
        if (this.hasZoom || this.followTouchMove) {
            this.batchMSEvents(addEvent);
        }
    });
    // Destroy MS events also
    wrap(Pointer.prototype, 'destroy', function (
        this: Highcharts.Pointer,
        proceed: Function
    ): void {
        this.batchMSEvents(removeEvent);
        proceed.call(this);
    });
}

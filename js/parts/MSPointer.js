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
/* globals MSPointerEvent, PointerEvent */
import U from './Utilities.js';
var extend = U.extend, objectEach = U.objectEach;
import './Pointer.js';
var addEvent = H.addEvent, charts = H.charts, css = H.css, doc = H.doc, hasTouch = H.hasTouch, noop = H.noop, Pointer = H.Pointer, removeEvent = H.removeEvent, win = H.win, wrap = H.wrap;
if (!hasTouch && (win.PointerEvent || win.MSPointerEvent)) {
    // The touches object keeps track of the points being touched at all times
    var touches = {}, hasPointerEvent = !!win.PointerEvent, getWebkitTouches = function () {
        var fake = [];
        fake.item = function (i) {
            return this[i];
        };
        objectEach(touches, function (touch) {
            fake.push({
                pageX: touch.pageX,
                pageY: touch.pageY,
                target: touch.target
            });
        });
        return fake;
    }, translateMSPointer = function (e, method, wktype, func) {
        var p;
        if ((e.pointerType === 'touch' ||
            e.pointerType === e.MSPOINTER_TYPE_TOUCH) && charts[H.hoverChartIndex]) {
            func(e);
            p = charts[H.hoverChartIndex].pointer;
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
        onContainerPointerDown: function (e) {
            translateMSPointer(e, 'onContainerTouchStart', 'touchstart', function (e) {
                touches[e.pointerId] = {
                    pageX: e.pageX,
                    pageY: e.pageY,
                    target: e.currentTarget
                };
            });
        },
        /**
         * @private
         * @function Highcharts.Pointer#onContainerPointerMove
         *
         * @param {Highcharts.PointerEventObject} e
         *
         * @return {void}
         */
        onContainerPointerMove: function (e) {
            translateMSPointer(e, 'onContainerTouchMove', 'touchmove', function (e) {
                touches[e.pointerId] = ({ pageX: e.pageX, pageY: e.pageY });
                if (!touches[e.pointerId].target) {
                    touches[e.pointerId].target = e.currentTarget;
                }
            });
        },
        /**
         * @private
         * @function Highcharts.Pointer#onDocumentPointerUp
         *
         * @param {Highcharts.PointerEventObject} e
         *
         * @return {void}
         */
        onDocumentPointerUp: function (e) {
            translateMSPointer(e, 'onDocumentTouchEnd', 'touchend', function (e) {
                delete touches[e.pointerId];
            });
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
        batchMSEvents: function (fn) {
            fn(this.chart.container, hasPointerEvent ? 'pointerdown' : 'MSPointerDown', this.onContainerPointerDown);
            fn(this.chart.container, hasPointerEvent ? 'pointermove' : 'MSPointerMove', this.onContainerPointerMove);
            fn(doc, hasPointerEvent ? 'pointerup' : 'MSPointerUp', this.onDocumentPointerUp);
        }
    });
    // Disable default IE actions for pinch and such on chart element
    wrap(Pointer.prototype, 'init', function (proceed, chart, options) {
        proceed.call(this, chart, options);
        if (this.hasZoom) { // #4014
            css(chart.container, {
                '-ms-touch-action': 'none',
                'touch-action': 'none'
            });
        }
    });
    // Add IE specific touch events to chart
    wrap(Pointer.prototype, 'setDOMEvents', function (proceed) {
        proceed.apply(this);
        if (this.hasZoom || this.followTouchMove) {
            this.batchMSEvents(addEvent);
        }
    });
    // Destroy MS events also
    wrap(Pointer.prototype, 'destroy', function (proceed) {
        this.batchMSEvents(removeEvent);
        proceed.call(this);
    });
}

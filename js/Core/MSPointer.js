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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import H from './Globals.js';
var charts = H.charts, doc = H.doc, noop = H.noop, win = H.win;
import Pointer from './Pointer.js';
import U from './Utilities.js';
var addEvent = U.addEvent, css = U.css, objectEach = U.objectEach, removeEvent = U.removeEvent;
/* globals MSPointerEvent, PointerEvent */
// The touches object keeps track of the points being touched at all times
var touches = {};
var hasPointerEvent = !!win.PointerEvent;
/* eslint-disable valid-jsdoc */
/** @private */
function getWebkitTouches() {
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
}
/** @private */
function translateMSPointer(e, method, wktype, func) {
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
}
/** @private */
var MSPointer = /** @class */ (function (_super) {
    __extends(MSPointer, _super);
    function MSPointer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    MSPointer.prototype.batchMSEvents = function (fn) {
        fn(this.chart.container, hasPointerEvent ? 'pointerdown' : 'MSPointerDown', this.onContainerPointerDown);
        fn(this.chart.container, hasPointerEvent ? 'pointermove' : 'MSPointerMove', this.onContainerPointerMove);
        fn(doc, hasPointerEvent ? 'pointerup' : 'MSPointerUp', this.onDocumentPointerUp);
    };
    // Destroy MS events also
    MSPointer.prototype.destroy = function () {
        this.batchMSEvents(removeEvent);
        _super.prototype.destroy.call(this);
    };
    // Disable default IE actions for pinch and such on chart element
    MSPointer.prototype.init = function (chart, options) {
        _super.prototype.init.call(this, chart, options);
        if (this.hasZoom) { // #4014
            css(chart.container, {
                '-ms-touch-action': 'none',
                'touch-action': 'none'
            });
        }
    };
    /**
     * @private
     * @function Highcharts.Pointer#onContainerPointerDown
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    MSPointer.prototype.onContainerPointerDown = function (e) {
        translateMSPointer(e, 'onContainerTouchStart', 'touchstart', function (e) {
            touches[e.pointerId] = {
                pageX: e.pageX,
                pageY: e.pageY,
                target: e.currentTarget
            };
        });
    };
    /**
     * @private
     * @function Highcharts.Pointer#onContainerPointerMove
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    MSPointer.prototype.onContainerPointerMove = function (e) {
        translateMSPointer(e, 'onContainerTouchMove', 'touchmove', function (e) {
            touches[e.pointerId] = ({ pageX: e.pageX, pageY: e.pageY });
            if (!touches[e.pointerId].target) {
                touches[e.pointerId].target = e.currentTarget;
            }
        });
    };
    /**
     * @private
     * @function Highcharts.Pointer#onDocumentPointerUp
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    MSPointer.prototype.onDocumentPointerUp = function (e) {
        translateMSPointer(e, 'onDocumentTouchEnd', 'touchend', function (e) {
            delete touches[e.pointerId];
        });
    };
    // Add IE specific touch events to chart
    MSPointer.prototype.setDOMEvents = function () {
        _super.prototype.setDOMEvents.call(this);
        if (this.hasZoom || this.followTouchMove) {
            this.batchMSEvents(addEvent);
        }
    };
    return MSPointer;
}(Pointer));
export default MSPointer;

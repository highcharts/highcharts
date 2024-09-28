/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import type Chart from './Chart/Chart';
import type Options from './Options';
import type PointerEvent from './PointerEvent';

import H from './Globals.js';
const {
    charts,
    composed,
    doc,
    noop,
    win
} = H;
import Pointer from './Pointer.js';
import U from './Utilities.js';
import DOMElementType from './Renderer/DOMElementType';
const {
    addEvent,
    attr,
    css,
    defined,
    objectEach,
    pick,
    pushUnique,
    removeEvent
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare global {
    /** @deprecated */
    interface MSPointerEvent extends Partial<PointerEvent> {
        /** @deprecated */
        readonly MSPOINTER_TYPE_TOUCH: string;
        readonly currentTarget?: EventTarget;
        readonly pointerId: number;
        readonly pointerType?: undefined;
        /** @deprecated */
        readonly toElement: Element;
    }
    interface Window {
        /** @deprecated */
        MSPointerEvent?: Class<MSPointerEvent>;
    }
}

/* *
 *
 *  Constants
 *
 * */

// The touches object keeps track of the points being touched at all times
const touches = {} as Record<string, PointerEvent>;
const hasPointerEvent = !!win.PointerEvent;

/* *
 *
 *  Functions
 *
 * */

/* eslint-disable valid-jsdoc */

/** @private */
function getWebkitTouches(): void {
    const fake = [] as any;

    fake.item = function (i: string): any {
        return this[i];
    };
    objectEach(touches, function (touch: PointerEvent): void {
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
    e: MSPointerEvent,
    method: string,
    wktype: string,
    func: Function
): void {
    const pointer = charts[Pointer.hoverChartIndex ?? -1]?.pointer;

    if (
        pointer &&
        (
            e.pointerType === 'touch' ||
            e.pointerType === e.MSPOINTER_TYPE_TOUCH
        )
    ) {
        func(e);
        (pointer as any)[method]({
            type: wktype,
            target: e.currentTarget,
            preventDefault: noop,
            touches: getWebkitTouches()
        });
    }
}

/* *
 *
 *  Class
 *
 * */

/** @private */
class MSPointer extends Pointer {

    /* *
     *
     *  Static Functions
     *
     * */

    public static isRequired(): boolean {
        return !!(!win.TouchEvent && (win.PointerEvent || win.MSPointerEvent));
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Add or remove the MS Pointer specific events
     * @private
     * @function Highcharts.Pointer#batchMSEvents
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
    public constructor(chart: Chart, options: Options) {

        super(chart, options);

        if (this.hasZoom) { // #4014
            css(chart.container, {
                '-ms-touch-action': 'none',
                'touch-action': 'none'
            });
        }
    }

    /**
     * Utility to detect whether an element has, or has a parent with, a
     * specific class name. Used on detection of tracker objects and on deciding
     * whether hovering the tooltip should cause the active series to mouse out.
     *
     * @function Highcharts.Pointer#inClass
     *
     * @param {Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement} element
     * The element to investigate.
     *
     * @param {string} className
     * The class name to look for.
     *
     * @return {boolean|undefined}
     * True if either the element or one of its parents has the given class
     * name.
     */
    public inClass(
        element: DOMElementType,
        className: string
    ): (boolean|undefined) {
        let elem: DOMElementType|null = element,
            elemClassName;

        while (elem) {
            elemClassName = attr(elem, 'class');
            if (elemClassName) {
                if (elemClassName.indexOf(className) !== -1) {
                    return true;
                }
                if (elemClassName.indexOf('highcharts-container') !== -1) {
                    return false;
                }
            }
            // #21098 IE11 compatibility
            elem = elem.parentNode;
            if (
                elem && (
                    // HTMLElement
                    elem === document.documentElement ||
                    // Document
                    defined(elem.nodeType) &&
                    elem.nodeType === document.nodeType
                )
            ) {
                elem = null;
            }
        }
    }

    /**
     * @private
     * @function Highcharts.Pointer#onContainerPointerDown
     */
    private onContainerPointerDown(e: MSPointerEvent): void {
        translateMSPointer(
            e,
            'onContainerTouchStart',
            'touchstart',
            function (e: MSPointerEvent): void {
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
     */
    private onContainerPointerMove(e: MSPointerEvent): void {
        translateMSPointer(
            e,
            'onContainerTouchMove',
            'touchmove',
            function (e: MSPointerEvent): void {
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
     */
    private onDocumentPointerUp(e: MSPointerEvent): void {
        translateMSPointer(
            e,
            'onDocumentTouchEnd',
            'touchend',
            function (e: MSPointerEvent): void {
                delete (touches as any)[e.pointerId];
            }
        );
    }

    // Add IE specific touch events to chart
    public setDOMEvents(): void {
        const tooltip = this.chart.tooltip;
        super.setDOMEvents();

        if (
            this.hasZoom ||
            pick((tooltip && tooltip.options.followTouchMove), true)
        ) {
            this.batchMSEvents(addEvent);
        }
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace MSPointer {

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    export function compose(
        ChartClass: typeof Chart
    ): void {

        if (pushUnique(composed, 'Core.MSPointer')) {
            addEvent(ChartClass, 'beforeRender', function (): void {
                this.pointer = new MSPointer(this, this.options);
            });
        }

    }

}

/* *
 *
 *  Default Export
 *
 * */

export default MSPointer;

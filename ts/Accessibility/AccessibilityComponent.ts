/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Accessibility component class definition
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type BBoxObject from '../Core/Renderer/BBoxObject';
import type {
    DOMElementType,
    HTMLDOMElement
} from '../Core/Renderer/DOMElementType';
import type HTMLAttributes from '../Core/Renderer/HTML/HTMLAttributes';
import type HTMLElement from '../Core/Renderer/HTML/HTMLElement';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import ChartUtilities from './Utils/ChartUtilities.js';
const { unhideChartElementFromAT } = ChartUtilities;
import DOMElementProvider from './Utils/DOMElementProvider.js';
import EventProvider from './Utils/EventProvider.js';
import H from '../Core/Globals.js';
const {
    doc,
    win
} = H;
import HTMLUtilities from './Utils/HTMLUtilities.js';
const {
    removeElement,
    getFakeMouseEvent
} = HTMLUtilities;
import U from '../Core/Utilities.js';
const {
    extend,
    fireEvent,
    merge
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class AccessibilityComponent {
            public constructor();
            public chart: AccessibilityChart;
            public domElementProvider: DOMElementProvider;
            public eventProvider: EventProvider;
            public keyCodes: Record<string, number>;
            public addEvent: EventProvider['addEvent'];
            public createElement: DOMElementProvider['createElement'];
            public addProxyGroup(attrs?: HTMLAttributes): HTMLDOMElement;
            public destroy(): void;
            public destroyBase(): void;
            public cloneMouseEvent(e: MouseEvent): MouseEvent;
            public cloneTouchEvent(e: TouchEvent): TouchEvent;
            public createOrUpdateProxyContainer(): void;
            public createProxyButton(
                svgElement: SVGElement,
                parentGroup: HTMLDOMElement,
                attributes?: SVGAttributes,
                posElement?: SVGElement,
                preClickEvent?: Function
            ): HTMLDOMElement;
            public createProxyContainerElement(): HTMLDOMElement;
            public fakeClickEvent(element: DOMElementType): void;
            public getElementPosition(element: SVGElement): BBoxObject;
            public getKeyboardNavigation(): (
                KeyboardNavigationHandler|Array<KeyboardNavigationHandler>
            );
            public init(): void;
            public initBase(chart: AccessibilityChart): void;
            public onChartRender(): void;
            public onChartUpdate(): void;
            public proxyMouseEventsForButton(
                source: (SVGElement|HTMLElement|DOMElementType),
                button: HTMLDOMElement
            ): void;
            public fireEventOnWrappedOrUnwrappedElement(
                el: (SVGElement|HTMLElement|DOMElementType),
                eventObject: Event
            ): void;
            public setProxyButtonStyle(button: HTMLDOMElement): void;
            public updateProxyButtonPosition(
                proxy: HTMLDOMElement,
                posElement: Highcharts.SVGElement
            ): void;
        }
        interface AccessibilityChart {
            a11yProxyContainer?: HTMLDOMElement;
        }
    }
}


/* eslint-disable valid-jsdoc */

/** @lends Highcharts.AccessibilityComponent */
var functionsToOverrideByDerivedClasses: (
    Partial<Highcharts.AccessibilityComponent>
) = {
    /**
     * Called on component initialization.
     */
    init: function (): void {},

    /**
     * Get keyboard navigation handler for this component.
     * @return {Highcharts.KeyboardNavigationHandler}
     */
    getKeyboardNavigation: function (): void {} as any,

    /**
     * Called on updates to the chart, including options changes.
     * Note that this is also called on first render of chart.
     */
    onChartUpdate: function (): void {},

    /**
     * Called on every chart render.
     */
    onChartRender: function (): void {},

    /**
     * Called when accessibility is disabled or chart is destroyed.
     */
    destroy: function (): void {}
};


/**
 * The AccessibilityComponent base class, representing a part of the chart that
 * has accessibility logic connected to it. This class can be inherited from to
 * create a custom accessibility component for a chart.
 *
 * Components should take care to destroy added elements and unregister event
 * handlers on destroy. This is handled automatically if using this.addEvent and
 * this.createElement.
 *
 * @sample highcharts/accessibility/custom-component
 *         Custom accessibility component
 *
 * @requires module:modules/accessibility
 * @class
 * @name Highcharts.AccessibilityComponent
 */
function AccessibilityComponent(): void {}
/**
 * @lends Highcharts.AccessibilityComponent
 */
AccessibilityComponent.prototype = {
    /**
     * Initialize the class
     * @private
     * @param {Highcharts.Chart} chart
     *        Chart object
     */
    initBase: function (
        this: Highcharts.AccessibilityComponent,
        chart: Highcharts.AccessibilityChart
    ): void {
        this.chart = chart;

        this.eventProvider = new EventProvider();
        this.domElementProvider = new DOMElementProvider();

        // Key code enum for common keys
        this.keyCodes = {
            left: 37,
            right: 39,
            up: 38,
            down: 40,
            enter: 13,
            space: 32,
            esc: 27,
            tab: 9
        };
    },


    /**
     * Add an event to an element and keep track of it for later removal.
     * See EventProvider for details.
     * @private
     */
    addEvent: function (this: Highcharts.AccessibilityComponent): Function {
        return (this.eventProvider as any).addEvent
            .apply(this.eventProvider, arguments);
    },


    /**
     * Create an element and keep track of it for later removal.
     * See DOMElementProvider for details.
     * @private
     */
    createElement: function (
        this: Highcharts.AccessibilityComponent
    ): HTMLDOMElement {
        return (this.domElementProvider as any).createElement.apply(
            this.domElementProvider, arguments
        );
    },


    /**
     * Fire an event on an element that is either wrapped by Highcharts,
     * or a DOM element
     * @private
     * @param {Highcharts.HTMLElement|Highcharts.HTMLDOMElement|
     *  Highcharts.SVGDOMElement|Highcharts.SVGElement} el
     * @param {Event} eventObject
     */
    fireEventOnWrappedOrUnwrappedElement: function (
        el: (HTMLElement|SVGElement|DOMElementType),
        eventObject: Event
    ): void {
        const type = eventObject.type;

        if (doc.createEvent && ((el as any).dispatchEvent || (el as any).fireEvent)) {
            if ((el as any).dispatchEvent) {
                (el as any).dispatchEvent(eventObject);
            } else {
                (el as any).fireEvent(type, eventObject);
            }
        } else {
            fireEvent(el, type, eventObject);
        }
    },


    /**
     * Utility function to attempt to fake a click event on an element.
     * @private
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} element
     */
    fakeClickEvent: function (element: DOMElementType): void {
        if (element) {
            const fakeEventObject = getFakeMouseEvent('click');
            this.fireEventOnWrappedOrUnwrappedElement(element, fakeEventObject);
        }
    },


    /**
     * Add a new proxy group to the proxy container. Creates the proxy container
     * if it does not exist.
     * @private
     * @param {Highcharts.HTMLAttributes} [attrs]
     * The attributes to set on the new group div.
     * @return {Highcharts.HTMLDOMElement}
     * The new proxy group element.
     */
    addProxyGroup: function (
        this: Highcharts.AccessibilityComponent,
        attrs?: HTMLAttributes
    ): HTMLDOMElement {
        this.createOrUpdateProxyContainer();

        var groupDiv = this.createElement('div');

        Object.keys(attrs || {}).forEach(function (prop: string): void {
            if ((attrs as any)[prop] !== null) {
                groupDiv.setAttribute(prop, (attrs as any)[prop]);
            }
        });
        (this.chart as any).a11yProxyContainer.appendChild(groupDiv);

        return groupDiv;
    },


    /**
     * Creates and updates DOM position of proxy container
     * @private
     */
    createOrUpdateProxyContainer: function (
        this: Highcharts.AccessibilityComponent
    ): void {
        var chart = this.chart,
            rendererSVGEl = chart.renderer.box;

        chart.a11yProxyContainer = chart.a11yProxyContainer ||
            this.createProxyContainerElement();

        if (rendererSVGEl.nextSibling !== chart.a11yProxyContainer) {
            chart.container.insertBefore(
                chart.a11yProxyContainer,
                rendererSVGEl.nextSibling
            );
        }
    },


    /**
     * @private
     * @return {Highcharts.HTMLDOMElement} element
     */
    createProxyContainerElement: function (): HTMLDOMElement {
        var pc = doc.createElement('div');
        pc.className = 'highcharts-a11y-proxy-container';
        return pc;
    },


    /**
     * Create an invisible proxy HTML button in the same position as an SVG
     * element
     * @private
     * @param {Highcharts.SVGElement} svgElement
     * The wrapped svg el to proxy.
     * @param {Highcharts.HTMLDOMElement} parentGroup
     * The proxy group element in the proxy container to add this button to.
     * @param {Highcharts.SVGAttributes} [attributes]
     * Additional attributes to set.
     * @param {Highcharts.SVGElement} [posElement]
     * Element to use for positioning instead of svgElement.
     * @param {Function} [preClickEvent]
     * Function to call before click event fires.
     *
     * @return {Highcharts.HTMLDOMElement} The proxy button.
     */
    createProxyButton: function (
        this: Highcharts.AccessibilityComponent,
        svgElement: Highcharts.SVGElement,
        parentGroup: HTMLDOMElement,
        attributes?: SVGAttributes,
        posElement?: Highcharts.SVGElement,
        preClickEvent?: Function
    ): HTMLDOMElement {
        var svgEl = svgElement.element,
            proxy = this.createElement('button'),
            attrs = merge({
                'aria-label': svgEl.getAttribute('aria-label')
            }, attributes);

        Object.keys(attrs).forEach(function (prop: string): void {
            if ((attrs as any)[prop] !== null) {
                proxy.setAttribute(prop, (attrs as any)[prop]);
            }
        });

        proxy.className = 'highcharts-a11y-proxy-button';

        if (preClickEvent) {
            this.addEvent(proxy, 'click', preClickEvent);
        }

        this.setProxyButtonStyle(proxy);
        this.updateProxyButtonPosition(proxy, posElement || svgElement);
        this.proxyMouseEventsForButton(svgEl, proxy);

        // Add to chart div and unhide from screen readers
        parentGroup.appendChild(proxy);
        if (!attrs['aria-hidden']) {
            unhideChartElementFromAT(this.chart as any, proxy);
        }

        return proxy;
    },


    /**
     * Get the position relative to chart container for a wrapped SVG element.
     * @private
     * @param {Highcharts.SVGElement} element
     * The element to calculate position for.
     * @return {Highcharts.BBoxObject}
     * Object with x and y props for the position.
     */
    getElementPosition: function (
        this: Highcharts.AccessibilityComponent,
        element: SVGElement
    ): BBoxObject {
        var el = element.element,
            div: HTMLDOMElement = (this.chart as any).renderTo;

        if (div && el && el.getBoundingClientRect) {
            var rectEl = el.getBoundingClientRect(),
                rectDiv = div.getBoundingClientRect();

            return {
                x: rectEl.left - rectDiv.left,
                y: rectEl.top - rectDiv.top,
                width: rectEl.right - rectEl.left,
                height: rectEl.bottom - rectEl.top
            };
        }

        return { x: 0, y: 0, width: 1, height: 1 };
    },


    /**
     * @private
     * @param {Highcharts.HTMLElement} button The proxy element.
     */
    setProxyButtonStyle: function (button: HTMLDOMElement): void {
        merge(true, button.style, {
            'border-width': 0,
            'background-color': 'transparent',
            cursor: 'pointer',
            outline: 'none',
            opacity: 0.001,
            filter: 'alpha(opacity=1)',
            '-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=1)',
            zIndex: 999,
            overflow: 'hidden',
            padding: 0,
            margin: 0,
            display: 'block',
            position: 'absolute'
        });
    },


    /**
     * @private
     * @param {Highcharts.HTMLElement} proxy The proxy to update position of.
     * @param {Highcharts.SVGElement} posElement The element to overlay and take position from.
     */
    updateProxyButtonPosition: function (
        proxy: HTMLDOMElement,
        posElement: SVGElement
    ): void {
        const bBox = this.getElementPosition(posElement);
        merge(true, proxy.style, {
            width: (bBox.width || 1) + 'px',
            height: (bBox.height || 1) + 'px',
            left: (bBox.x || 0) + 'px',
            top: (bBox.y || 0) + 'px'
        });
    },


    /**
     * @private
     * @param {Highcharts.HTMLElement|Highcharts.HTMLDOMElement|
     *  Highcharts.SVGDOMElement|Highcharts.SVGElement} source
     * @param {Highcharts.HTMLElement} button
     */
    proxyMouseEventsForButton: function (
        this: Highcharts.AccessibilityComponent,
        source: (
            HTMLElement|SVGElement|DOMElementType
        ),
        button: HTMLDOMElement
    ): void {
        var component = this;

        [
            'click', 'touchstart', 'touchend', 'touchcancel', 'touchmove',
            'mouseover', 'mouseenter', 'mouseleave', 'mouseout'
        ].forEach(function (evtType: string): void {
            const isTouchEvent = evtType.indexOf('touch') === 0;

            component.addEvent(button, evtType, function (e: MouseEvent | TouchEvent): void {
                const clonedEvent = isTouchEvent ?
                    component.cloneTouchEvent(e as TouchEvent) :
                    component.cloneMouseEvent(e as MouseEvent);

                if (source) {
                    component.fireEventOnWrappedOrUnwrappedElement(source, clonedEvent);
                }

                e.stopPropagation();
                e.preventDefault();
            }, { passive: false });
        });
    },


    /**
     * Utility function to clone a mouse event for re-dispatching.
     * @private
     * @param {global.MouseEvent} e The event to clone.
     * @return {global.MouseEvent} The cloned event
     */
    cloneMouseEvent: function (e: MouseEvent): MouseEvent {
        if (typeof win.MouseEvent === 'function') {
            return new win.MouseEvent(e.type, e);
        }

        // No MouseEvent support, try using initMouseEvent
        if (doc.createEvent) {
            var evt = doc.createEvent('MouseEvent');
            if (evt.initMouseEvent) {
                evt.initMouseEvent(
                    e.type,
                    e.bubbles, // #10561, #12161
                    e.cancelable,
                    e.view || win,
                    e.detail,
                    e.screenX,
                    e.screenY,
                    e.clientX,
                    e.clientY,
                    e.ctrlKey,
                    e.altKey,
                    e.shiftKey,
                    e.metaKey,
                    e.button,
                    e.relatedTarget
                );
                return evt;
            }
        }

        return getFakeMouseEvent(e.type);
    },


    /**
     * Utility function to clone a touch event for re-dispatching.
     * @private
     * @param {global.TouchEvent} e The event to clone.
     * @return {global.TouchEvent} The cloned event
     */
    cloneTouchEvent: function (e: TouchEvent): TouchEvent {
        const touchListToTouchArray = (l: TouchList): Touch[] => {
            const touchArray = [];
            for (let i = 0; i < l.length; ++i) {
                const item = l.item(i);
                if (item) {
                    touchArray.push(item);
                }
            }
            return touchArray;
        };

        if (typeof win.TouchEvent === 'function') {
            const newEvent = new win.TouchEvent(e.type, {
                touches: touchListToTouchArray(e.touches),
                targetTouches: touchListToTouchArray(e.targetTouches),
                changedTouches: touchListToTouchArray(e.changedTouches),
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey,
                metaKey: e.metaKey,
                bubbles: e.bubbles,
                cancelable: e.cancelable,
                composed: e.composed,
                detail: e.detail,
                view: e.view
            });
            if (e.defaultPrevented) {
                newEvent.preventDefault();
            }
            return newEvent;
        }

        // Fallback to mouse event
        const fakeEvt = this.cloneMouseEvent(e as unknown as MouseEvent);
        fakeEvt.touches = e.touches;
        fakeEvt.changedTouches = e.changedTouches;
        fakeEvt.targetTouches = e.targetTouches;
        return fakeEvt;
    },


    /**
     * Remove traces of the component.
     * @private
     */
    destroyBase: function (): void {
        removeElement(this.chart.a11yProxyContainer);
        this.domElementProvider.destroyCreatedElements();
        this.eventProvider.removeAddedEvents();
    }
};

extend(AccessibilityComponent.prototype, functionsToOverrideByDerivedClasses);

export default AccessibilityComponent;

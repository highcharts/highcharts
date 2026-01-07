/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Accessibility component class definition
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Accessibility from './Accessibility';
import type { EventCallback } from '../Core/Callback';
import type { DOMElementType } from '../Core/Renderer/DOMElementType';
import type HTMLElement from '../Core/Renderer/HTML/HTMLElement';
import type KeyboardNavigationHandler from './KeyboardNavigationHandler';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import type ProxyProvider from './ProxyProvider';

import CU from './Utils/ChartUtilities.js';
const { fireEventOnWrappedOrUnwrappedElement } = CU;
import DOMElementProvider from './Utils/DOMElementProvider.js';
import EventProvider from './Utils/EventProvider.js';
import HU from './Utils/HTMLUtilities.js';
const { getFakeMouseEvent } = HU;
import U from '../Core/Utilities.js';

/* *
 *
 *  Class
 *
 * */

/**
 * The AccessibilityComponent base class, representing a part of the chart that
 * has accessibility logic connected to it. This class can be inherited from to
 * create a custom accessibility component for a chart.
 *
 * Components should take care to destroy added elements and unregister event
 * handlers on destroy. This is handled automatically if using `this.addEvent`
 * and `this.createElement`.
 *
 * @sample highcharts/accessibility/custom-component
 *         Custom accessibility component
 *
 * @requires modules/accessibility
 * @class
 * @name Highcharts.AccessibilityComponent
 */
class AccessibilityComponent {

    /* *
     *
     *  Properties
     *
     * */

    public chart!: Accessibility.ChartComposition;
    public domElementProvider!: DOMElementProvider;
    public eventProvider!: EventProvider;
    public keyCodes!: Record<string, number>;
    public proxyProvider!: ProxyProvider;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Called when accessibility is disabled or chart is destroyed.
     *
     * @function Highcharts.AccessibilityComponent#destroy
     */
    public destroy(): void {}

    /**
     * Get keyboard navigation handler for this component.
     *
     * @function Highcharts.AccessibilityComponent#getKeyboardNavigation
     * @return   {Highcharts.KeyboardNavigationHandler|Array<Highcharts.KeyboardNavigationHandler>}
     *           The keyboard navigation handler(s) for this component.
     */
    public getKeyboardNavigation(): (
    KeyboardNavigationHandler|Array<KeyboardNavigationHandler>
    ) {
        return [];
    }

    /**
     * Called on component initialization.
     *
     * @function Highcharts.AccessibilityComponent#init
     */
    public init(): void {}

    /**
     * Called on every chart render.
     *
     * @function Highcharts.AccessibilityComponent#onChartRender
     */
    public onChartRender(): void {}

    /**
     * Called on updates to the chart, including options changes.
     * Note that this is also called on first render of chart.
     *
     * @function Highcharts.AccessibilityComponent#onChartUpdate
     */
    public onChartUpdate(): void {}

    /**
     * Initialize the class
     * @private
     * @param {Highcharts.Chart} chart The chart object
     * @param {Highcharts.ProxyProvider} proxyProvider The proxy provider of the accessibility module
     */
    public initBase(
        chart: Accessibility.ChartComposition,
        proxyProvider: ProxyProvider
    ): void {
        this.chart = chart;

        this.eventProvider = new EventProvider();
        this.domElementProvider = new DOMElementProvider();
        this.proxyProvider = proxyProvider;

        // Key code enum for common keys
        this.keyCodes = {
            left: 37,
            right: 39,
            up: 38,
            down: 40,
            enter: 13,
            space: 32,
            esc: 27,
            tab: 9,
            pageUp: 33,
            pageDown: 34,
            end: 35,
            home: 36
        };
    }


    /**
     * Add an event to an element and keep track of it for later removal.
     * See EventProvider for details.
     * @private
     */
    public addEvent<T>(
        el: (T|Class<T>),
        type: string,
        fn: (Function|EventCallback<T>),
        options?: U.EventOptions
    ): Function {
        return this.eventProvider.addEvent<T>(el, type, fn, options);
    }


    /**
     * Create an element and keep track of it for later removal.
     * See DOMElementProvider for details.
     * @private
     */
    public createElement<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K] {
        return this.domElementProvider.createElement(tagName, options);
    }


    /**
     * Fire a fake click event on an element. It is useful to have this on
     * AccessibilityComponent for users of custom components.
     * @private
     */
    public fakeClickEvent(
        el: (HTMLElement|SVGElement|DOMElementType)
    ): void {
        const fakeEvent = getFakeMouseEvent('click');
        fireEventOnWrappedOrUnwrappedElement(el, fakeEvent);
    }


    /**
     * Remove traces of the component.
     * @private
     */
    public destroyBase(): void {
        this.domElementProvider.destroyCreatedElements();
        this.eventProvider.removeAddedEvents();
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default AccessibilityComponent;

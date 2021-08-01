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

import type {
    HTMLDOMElement,
    DOMElementType
} from '../Core/Renderer/DOMElementType';
import type HTMLElement from '../Core/Renderer/HTML/HTMLElement';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import type ProxyProvider from './ProxyProvider';
import DOMElementProvider from './Utils/DOMElementProvider.js';
import EventProvider from './Utils/EventProvider.js';

import HTMLUtilities from './Utils/HTMLUtilities.js';
const {
    getFakeMouseEvent
} = HTMLUtilities;

import ChartUtilities from './Utils/ChartUtilities.js';
const {
    fireEventOnWrappedOrUnwrappedElement
} = ChartUtilities;

import U from '../Core/Utilities.js';
const {
    extend
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
            public proxyProvider: ProxyProvider;
            public addEvent: EventProvider['addEvent'];
            public createElement: DOMElementProvider['createElement'];
            public destroy(): void;
            public destroyBase(): void;
            public fakeClickEvent(el: (HTMLElement|SVGElement|DOMElementType)): void;
            public getKeyboardNavigation(): (
                KeyboardNavigationHandler|Array<KeyboardNavigationHandler>
            );
            public init(): void;
            public initBase(
                chart: AccessibilityChart,
                proxyProvider: ProxyProvider
            ): void;
            public onChartRender(): void;
            public onChartUpdate(): void;
        }
    }
}


/* eslint-disable valid-jsdoc */

/** @lends Highcharts.AccessibilityComponent */
const functionsToOverrideByDerivedClasses: (
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
     * @param {Highcharts.Chart} chart The chart object
     * @param {Highcharts.ProxyProvider} proxyProvider The proxy provider of the accessibility module
     */
    initBase: function (
        this: Highcharts.AccessibilityComponent,
        chart: Highcharts.AccessibilityChart,
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
     * Fire a fake click event on an element. It is useful to have this on
     * AccessibilityComponent for users of custom components.
     */
    fakeClickEvent(el: (HTMLElement|SVGElement|DOMElementType)): void {
        const fakeEvent = getFakeMouseEvent('click');
        fireEventOnWrappedOrUnwrappedElement(el, fakeEvent);
    },


    /**
     * Remove traces of the component.
     * @private
     */
    destroyBase: function (): void {
        this.domElementProvider.destroyCreatedElements();
        this.eventProvider.removeAddedEvents();
    }
};

extend(AccessibilityComponent.prototype, functionsToOverrideByDerivedClasses);

export default AccessibilityComponent;

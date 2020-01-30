/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Accessibility component class definition
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../parts/Globals.js';
var win = H.win, doc = win.document, fireEvent = H.fireEvent;
import U from '../../parts/Utilities.js';
var extend = U.extend, merge = U.merge;
import HTMLUtilities from './utils/htmlUtilities.js';
var removeElement = HTMLUtilities.removeElement, getFakeMouseEvent = HTMLUtilities.getFakeMouseEvent;
import ChartUtilities from './utils/chartUtilities.js';
var unhideChartElementFromAT = ChartUtilities.unhideChartElementFromAT;
import EventProvider from './utils/EventProvider.js';
import DOMElementProvider from './utils/DOMElementProvider.js';
/* eslint-disable valid-jsdoc */
/** @lends Highcharts.AccessibilityComponent */
var functionsToOverrideByDerivedClasses = {
    /**
     * Called on component initialization.
     */
    init: function () { },
    /**
     * Get keyboard navigation handler for this component.
     * @return {Highcharts.KeyboardNavigationHandler}
     */
    getKeyboardNavigation: function () { },
    /**
     * Called on updates to the chart, including options changes.
     * Note that this is also called on first render of chart.
     */
    onChartUpdate: function () { },
    /**
     * Called on every chart render.
     */
    onChartRender: function () { },
    /**
     * Called when accessibility is disabled or chart is destroyed.
     */
    destroy: function () { }
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
function AccessibilityComponent() { }
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
    initBase: function (chart) {
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
    addEvent: function () {
        return this.eventProvider.addEvent
            .apply(this.eventProvider, arguments);
    },
    /**
     * Create an element and keep track of it for later removal.
     * See DOMElementProvider for details.
     * @private
     */
    createElement: function () {
        return this.domElementProvider.createElement.apply(this.domElementProvider, arguments);
    },
    /**
     * Fire an event on an element that is either wrapped by Highcharts,
     * or a DOM element
     * @private
     * @param {Highcharts.HTMLElement|Highcharts.HTMLDOMElement|
     *  Highcharts.SVGDOMElement|Highcharts.SVGElement} el
     * @param {Event} eventObject
     */
    fireEventOnWrappedOrUnwrappedElement: function (el, eventObject) {
        var type = eventObject.type;
        if (doc.createEvent && (el.dispatchEvent || el.fireEvent)) {
            if (el.dispatchEvent) {
                el.dispatchEvent(eventObject);
            }
            else {
                el.fireEvent(type, eventObject);
            }
        }
        else {
            fireEvent(el, type, eventObject);
        }
    },
    /**
     * Utility function to attempt to fake a click event on an element.
     * @private
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} element
     */
    fakeClickEvent: function (element) {
        if (element) {
            var fakeEventObject = getFakeMouseEvent('click');
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
    addProxyGroup: function (attrs) {
        this.createOrUpdateProxyContainer();
        var groupDiv = this.createElement('div');
        Object.keys(attrs || {}).forEach(function (prop) {
            if (attrs[prop] !== null) {
                groupDiv.setAttribute(prop, attrs[prop]);
            }
        });
        this.chart.a11yProxyContainer.appendChild(groupDiv);
        return groupDiv;
    },
    /**
     * Creates and updates DOM position of proxy container
     * @private
     */
    createOrUpdateProxyContainer: function () {
        var chart = this.chart, rendererSVGEl = chart.renderer.box;
        chart.a11yProxyContainer = chart.a11yProxyContainer ||
            this.createProxyContainerElement();
        if (rendererSVGEl.nextSibling !== chart.a11yProxyContainer) {
            chart.container.insertBefore(chart.a11yProxyContainer, rendererSVGEl.nextSibling);
        }
    },
    /**
     * @private
     * @return {Highcharts.HTMLDOMElement} element
     */
    createProxyContainerElement: function () {
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
    createProxyButton: function (svgElement, parentGroup, attributes, posElement, preClickEvent) {
        var svgEl = svgElement.element, proxy = this.createElement('button'), attrs = merge({
            'aria-label': svgEl.getAttribute('aria-label')
        }, attributes), bBox = this.getElementPosition(posElement || svgElement);
        Object.keys(attrs).forEach(function (prop) {
            if (attrs[prop] !== null) {
                proxy.setAttribute(prop, attrs[prop]);
            }
        });
        proxy.className = 'highcharts-a11y-proxy-button';
        if (preClickEvent) {
            this.addEvent(proxy, 'click', preClickEvent);
        }
        this.setProxyButtonStyle(proxy, bBox);
        this.proxyMouseEventsForButton(svgEl, proxy);
        // Add to chart div and unhide from screen readers
        parentGroup.appendChild(proxy);
        if (!attrs['aria-hidden']) {
            unhideChartElementFromAT(this.chart, proxy);
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
    getElementPosition: function (element) {
        var el = element.element, div = this.chart.renderTo;
        if (div && el && el.getBoundingClientRect) {
            var rectEl = el.getBoundingClientRect(), rectDiv = div.getBoundingClientRect();
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
     * @param {Highcharts.HTMLElement} button
     * @param {Highcharts.BBoxObject} bBox
     */
    setProxyButtonStyle: function (button, bBox) {
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
            position: 'absolute',
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
    proxyMouseEventsForButton: function (source, button) {
        var component = this;
        [
            'click', 'touchstart', 'touchend', 'touchcancel', 'touchmove',
            'mouseover', 'mouseenter', 'mouseleave', 'mouseout'
        ].forEach(function (evtType) {
            component.addEvent(button, evtType, function (e) {
                var clonedEvent = component.cloneMouseEvent(e);
                if (source) {
                    component.fireEventOnWrappedOrUnwrappedElement(source, clonedEvent);
                }
                e.stopPropagation();
                e.preventDefault();
            });
        });
    },
    /**
     * Utility function to clone a mouse event for re-dispatching.
     * @private
     * @param {global.MouseEvent} e The event to clone.
     * @return {global.MouseEvent} The cloned event
     */
    cloneMouseEvent: function (e) {
        if (typeof win.MouseEvent === 'function') {
            return new win.MouseEvent(e.type, e);
        }
        // No MouseEvent support, try using initMouseEvent
        if (doc.createEvent) {
            var evt = doc.createEvent('MouseEvent');
            if (evt.initMouseEvent) {
                evt.initMouseEvent(e.type, e.bubbles, // #10561, #12161
                e.cancelable, e.view || win, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
                return evt;
            }
        }
        return getFakeMouseEvent(e.type);
    },
    /**
     * Remove traces of the component.
     * @private
     */
    destroyBase: function () {
        removeElement(this.chart.a11yProxyContainer);
        this.domElementProvider.destroyCreatedElements();
        this.eventProvider.removeAddedEvents();
    }
};
extend(AccessibilityComponent.prototype, functionsToOverrideByDerivedClasses);
export default AccessibilityComponent;

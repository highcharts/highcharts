/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility component class definition
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';
import Highcharts from '../../parts/Globals.js';
import U from '../../parts/Utilities.js';
var extend = U.extend,
    pick = U.pick;

var win = Highcharts.win,
    doc = win.document,
    merge = Highcharts.merge,
    addEvent = Highcharts.addEvent;


/** @lends Highcharts.AccessibilityComponent */
var functionsToOverrideByDerivedClasses = {
    /**
     * Called on component initialization.
     */
    init: function () {},

    /**
     * Get keyboard navigation handler for this component.
     * @return {Highcharts.KeyboardNavigationHandler}
     */
    getKeyboardNavigation: function () {},

    /**
     * Called on updates to the chart, including options changes.
     * Note that this is also called on first render of chart.
     */
    onChartUpdate: function () {},

    /**
     * Called on every chart render.
     */
    onChartRender: function () {},

    /**
     * Called when accessibility is disabled or chart is destroyed.
     */
    destroy: function () {}
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
function AccessibilityComponent() {}
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
        this.eventRemovers = [];
        this.domElements = [];
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
        // CSS Styles for hiding elements visually but keeping them visible to
        // AT.
        this.hiddenStyle = {
            position: 'absolute',
            width: '1px',
            height: '1px',
            overflow: 'hidden'
        };
    },


    /**
     * Add an event to an element and keep track of it for destroy().
     * Same args as Highcharts.addEvent
     * @private
     */
    addEvent: function () {
        var remover = Highcharts.addEvent.apply(Highcharts, arguments);
        this.eventRemovers.push(remover);
        return remover;
    },


    /**
     * Create an element and keep track of it for destroy().
     * Same args as document.createElement
     * @private
     */
    createElement: function () {
        var el = Highcharts.win.document.createElement.apply(
            Highcharts.win.document, arguments
        );
        this.domElements.push(el);
        return el;
    },


    /**
     * Utility function to attempt to fake a click event on an element.
     * @private
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} element
     */
    fakeClickEvent: function (element) {
        if (element && element.onclick && doc.createEvent) {
            var fakeEvent = doc.createEvent('Event');
            fakeEvent.initEvent('click', true, false);
            element.onclick(fakeEvent);
        }
    },


    /**
     * Add a new proxy group to the proxy container. Creates the proxy container
     * if it does not exist.
     * @private
     * @param {object} attrs The attributes to set on the new group div.
     *
     * @return {Highcharts.HTMLDOMElement} The new proxy group element.
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
    createProxyContainerElement: function () {
        var pc = doc.createElement('div');
        pc.className = 'highcharts-a11y-proxy-container';
        return pc;
    },


    /**
     * Create an invisible proxy HTML button in the same position as an SVG
     * element
     * @private
     * @param {Highcharts.SVGElement} svgElement The wrapped svg el to proxy.
     * @param {Highcharts.HTMLElement} parentGroup The proxy group element in
     *          the proxy container to add this button to.
     * @param {object} [attributes] Additional attributes to set.
     * @param {Highcharts.SVGElement} [posElement] Element to use for
     *          positioning instead of svgElement.
     * @param {Function} [preClickEvent] Function to call before click event
     *          fires.
     *
     * @return {Highcharts.HTMLElement} The proxy button.
     */
    createProxyButton: function (
        svgElement, parentGroup, attributes, posElement, preClickEvent
    ) {
        var svgEl = svgElement.element,
            proxy = this.createElement('button'),
            attrs = merge({
                'aria-label': svgEl.getAttribute('aria-label')
            }, attributes),
            bBox = this.getElementPosition(posElement || svgElement);

        Object.keys(attrs).forEach(function (prop) {
            if (attrs[prop] !== null) {
                proxy.setAttribute(prop, attrs[prop]);
            }
        });

        proxy.className = 'highcharts-a11y-proxy-button';

        if (preClickEvent) {
            addEvent(proxy, 'click', preClickEvent);
        }

        this.setProxyButtonStyle(proxy, bBox);
        this.proxyMouseEventsForButton(svgEl, proxy);

        // Add to chart div and unhide from screen readers
        parentGroup.appendChild(proxy);
        if (!attrs['aria-hidden']) {
            this.unhideElementFromScreenReaders(proxy);
        }
        return proxy;
    },


    /**
     * Get the position relative to chart container for a wrapped SVG element.
     * @private
     * @param {Highcharts.SVGElement} element The element to calculate position
     *          for.
     *
     * @return {object} Object with x and y props for the position.
     */
    getElementPosition: function (element) {
        var el = element.element,
            div = this.chart.renderTo;
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
     * @param {Highcharts.HTMLElement} button
     * @param {object} bBox
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
            left: pick(bBox.x, bBox.left) + 'px',
            top: pick(bBox.y, bBox.top) + 'px'
        });
    },


    /**
     * @private
     * @param {Highcharts.HTMLElement} button
     */
    proxyMouseEventsForButton: function (source, button) {
        var component = this;
        [
            'click', 'mouseover', 'mouseenter', 'mouseleave', 'mouseout'
        ].forEach(function (evtType) {
            addEvent(button, evtType, function (e) {
                var clonedEvent = component.cloneMouseEvent(e);
                if (source) {
                    if (clonedEvent) {
                        if (source.fireEvent) {
                            source.fireEvent(clonedEvent);
                        } else if (source.dispatchEvent) {
                            source.dispatchEvent(clonedEvent);
                        }
                    } else if (source['on' + evtType]) {
                        source['on' + evtType](e);
                    }
                }
                e.stopPropagation();
                e.preventDefault();
            });
        });
    },


    /**
     * Utility function to clone a mouse event for re-dispatching.
     * @private
     * @param {global.Event} e The event to clone.
     * @return {global.Event} The cloned event
     */
    cloneMouseEvent: function (e) {
        if (typeof win.MouseEvent === 'function') {
            return new win.MouseEvent(e.type, e);
        }
        // No MouseEvent support, try using initMouseEvent
        if (doc.createEvent) {
            var evt = doc.createEvent('MouseEvent');
            if (evt.initMouseEvent) {
                evt.initMouseEvent(
                    e.type,
                    e.type === 'click' || e.canBubble, // #10561
                    e.cancelable,
                    e.view,
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

            // Fallback to basic Event
            evt = doc.createEvent('Event');
            if (evt.initEvent) {
                evt.initEvent(e.type, true, true);
                return evt;
            }
        }
    },


    /**
     * Utility function for removing an element from the DOM.
     * @private
     * @param {Highcharts.HTMLDOMElement} element The element to remove.
     */
    removeElement: function (element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },


    /**
     * Unhide an element from screen readers. Also unhides parents, and hides
     * siblings that are not explicitly unhidden.
     * @private
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} element
     *      The element to unhide
     */
    unhideElementFromScreenReaders: function (element) {
        element.setAttribute('aria-hidden', false);
        if (element === this.chart.renderTo || !element.parentNode) {
            return;
        }

        // Hide siblings unless their hidden state is already explicitly set
        Array.prototype.forEach.call(
            element.parentNode.childNodes,
            function (node) {
                if (!node.hasAttribute('aria-hidden')) {
                    node.setAttribute('aria-hidden', true);
                }
            }
        );
        // Repeat for parent
        this.unhideElementFromScreenReaders(element.parentNode);
    },


    /**
     * Should remove any event handlers added, as well as any DOM elements.
     * @private
     */
    destroyBase: function () {
        // Destroy proxy container
        var chart = this.chart || {},
            component = this;
        this.removeElement(chart.a11yProxyContainer);

        // Remove event callbacks and dom elements
        this.eventRemovers.forEach(function (remover) {
            remover();
        });
        this.domElements.forEach(function (element) {
            component.removeElement(element);
        });
        this.eventRemovers = [];
        this.domElements = [];
    }
};

extend(AccessibilityComponent.prototype, functionsToOverrideByDerivedClasses);

export default AccessibilityComponent;

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

var win = Highcharts.win,
    doc = win.document,
    merge = Highcharts.merge,
    addEvent = Highcharts.addEvent;


/**
 * The AccessibilityComponent base class, representing a part of the chart that
 * has accessibility logic connected to it. This class can be inherited from to
 * create a custom accessibility component for a chart.
 *
 * A component:
 *  - Must call initBase after inheriting.
 *  - Can override any of the following functions: init(), destroy(),
 *      getKeyboardNavigation(), onChartUpdate().
 *  - Should take care to destroy added elements and unregister event handlers
 *      on destroy.
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
            component = this,
            proxy = this.createElement('button'),
            attrs = merge({
                'aria-label': svgEl.getAttribute('aria-label')
            }, attributes),
            positioningElement = posElement || svgElement,
            bBox = this.getElementPosition(positioningElement);

        // If we don't support getBoundingClientRect, no button is made
        if (!bBox) {
            return;
        }

        Object.keys(attrs).forEach(function (prop) {
            if (attrs[prop] !== null) {
                proxy.setAttribute(prop, attrs[prop]);
            }
        });

        merge(true, proxy.style, {
            'border-width': 0,
            'background-color': 'transparent',
            position: 'absolute',
            width: (bBox.width || 1) + 'px',
            height: (bBox.height || 1) + 'px',
            display: 'block',
            cursor: 'pointer',
            overflow: 'hidden',
            outline: 'none',
            opacity: 0.001,
            filter: 'alpha(opacity=1)',
            '-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=1)',
            zIndex: 999,
            padding: 0,
            margin: 0,
            left: bBox.x + 'px',
            top: bBox.y - this.chart.chartHeight + 'px'
        });

        // Handle pre-click
        if (preClickEvent) {
            addEvent(proxy, 'click', preClickEvent);
        }

        // Proxy mouse events
        [
            'click', 'mouseover', 'mouseenter', 'mouseleave', 'mouseout'
        ].forEach(function (evtType) {
            addEvent(proxy, evtType, function (e) {
                var clonedEvent = component.cloneMouseEvent(e);
                if (svgEl) {
                    if (clonedEvent) {
                        if (svgEl.fireEvent) {
                            svgEl.fireEvent(clonedEvent);
                        } else if (svgEl.dispatchEvent) {
                            svgEl.dispatchEvent(clonedEvent);
                        }
                    } else if (svgEl['on' + evtType]) {
                        svgEl['on' + evtType](e);
                    }
                }
            });
        });

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
        var chart = this.chart,
            proxyContainer = chart.a11yProxyContainer;

        // Add root proxy container if it does not exist
        if (!proxyContainer) {
            chart.a11yProxyContainer = doc.createElement('div');
            chart.a11yProxyContainer.style.position = 'relative';
        }
        // Add it if it is new, else make sure we move it to the end
        if (chart.container.nextSibling !== chart.a11yProxyContainer) {
            chart.renderTo.insertBefore(
                chart.a11yProxyContainer,
                chart.container.nextSibling
            );
        }

        // Create the group and add it
        var groupDiv = this.createElement('div');
        Object.keys(attrs || {}).forEach(function (prop) {
            if (attrs[prop] !== null) {
                groupDiv.setAttribute(prop, attrs[prop]);
            }
        });
        chart.a11yProxyContainer.appendChild(groupDiv);
        return groupDiv;
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
    },


    /**
     * Utility function to strip tags from a string. Used for aria-label
     * attributes, painting on a canvas will fail if the text contains tags.
     * @private
     * @param {string} s The string to strip tags from
     * @return {string} The new string.
     */
    stripTags: function (s) {
        return typeof s === 'string' ? s.replace(/<\/?[^>]+(>|$)/g, '') : s;
    },


    /**
     * HTML encode some characters vulnerable for XSS.
     * @private
     * @param {string} html The input string.
     * @return {string} The escaped string.
     */
    htmlencode: function (html) {
        return html
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    },


    // Functions to be overridden by derived classes

    /**
     * Initialize component.
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
     * Should call destroyBase to make sure events/elements added are removed.
     */
    destroy: function () {
        this.destroyBase();
    }

};

export default AccessibilityComponent;

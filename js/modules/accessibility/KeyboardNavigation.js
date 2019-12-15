/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Main keyboard navigation handling.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../parts/Globals.js';
var merge = H.merge, win = H.win, doc = win.document;
import HTMLUtilities from './utils/htmlUtilities.js';
var getElement = HTMLUtilities.getElement;
import KeyboardNavigationHandler from './KeyboardNavigationHandler.js';
import EventProvider from './utils/EventProvider.js';
/* eslint-disable valid-jsdoc */
/**
 * The KeyboardNavigation class, containing the overall keyboard navigation
 * logic for the chart.
 *
 * @requires module:modules/accessibility
 *
 * @private
 * @class
 * @param {Highcharts.Chart} chart
 *        Chart object
 * @param {object} components
 *        Map of component names to AccessibilityComponent objects.
 * @name Highcharts.KeyboardNavigation
 */
function KeyboardNavigation(chart, components) {
    this.init(chart, components);
}
KeyboardNavigation.prototype = {
    /**
     * Initialize the class
     * @private
     * @param {Highcharts.Chart} chart
     *        Chart object
     * @param {object} components
     *        Map of component names to AccessibilityComponent objects.
     */
    init: function (chart, components) {
        var keyboardNavigation = this, e = this.eventProvider = new EventProvider();
        this.chart = chart;
        this.components = components;
        this.modules = [];
        this.currentModuleIx = 0;
        // Add keydown event
        e.addEvent(chart.renderTo, 'keydown', function (e) {
            keyboardNavigation.onKeydown(e);
        });
        // Add mouseup event on doc
        e.addEvent(doc, 'mouseup', function () {
            keyboardNavigation.onMouseUp();
        });
        // Run an update to get all modules
        this.update();
        // Init first module
        if (this.modules.length) {
            this.modules[0].init(1);
        }
    },
    /**
     * Update the modules for the keyboard navigation.
     * @param {Array<string>} [order]
     *        Array specifying the tab order of the components.
     */
    update: function (order) {
        var a11yOptions = this.chart.options.accessibility, keyboardOptions = a11yOptions && a11yOptions.keyboardNavigation, components = this.components;
        this.updateContainerTabindex();
        if (keyboardOptions &&
            keyboardOptions.enabled &&
            order &&
            order.length) {
            // We (still) have keyboard navigation. Update module list
            this.modules = order.reduce(function (modules, componentName) {
                var navModules = components[componentName].getKeyboardNavigation();
                return modules.concat(navModules);
            }, [
                // Add an empty module at the start of list, to allow users to
                // tab into the chart.
                new KeyboardNavigationHandler(this.chart, {
                    init: function () { }
                })
            ]);
            this.updateExitAnchor();
        }
        else {
            this.modules = [];
            this.currentModuleIx = 0;
            this.removeExitAnchor();
        }
    },
    /**
     * Reset chart navigation state if we click outside the chart and it's
     * not already reset.
     * @private
     */
    onMouseUp: function () {
        if (!this.keyboardReset &&
            !(this.chart.pointer && this.chart.pointer.chartPosition)) {
            var chart = this.chart, curMod = this.modules &&
                this.modules[this.currentModuleIx || 0];
            if (curMod && curMod.terminate) {
                curMod.terminate();
            }
            if (chart.focusElement) {
                chart.focusElement.removeFocusBorder();
            }
            this.currentModuleIx = 0;
            this.keyboardReset = true;
        }
    },
    /**
     * Function to run on keydown
     * @private
     * @param {global.KeyboardEvent} ev
     * Browser keydown event.
     */
    onKeydown: function (ev) {
        var e = ev || win.event, preventDefault, curNavModule = this.modules && this.modules.length &&
            this.modules[this.currentModuleIx];
        // Used for resetting nav state when clicking outside chart
        this.keyboardReset = false;
        // If there is a nav module for the current index, run it.
        // Otherwise, we are outside of the chart in some direction.
        if (curNavModule) {
            var response = curNavModule.run(e);
            if (response === curNavModule.response.success) {
                preventDefault = true;
            }
            else if (response === curNavModule.response.prev) {
                preventDefault = this.prev();
            }
            else if (response === curNavModule.response.next) {
                preventDefault = this.next();
            }
            if (preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    },
    /**
     * Go to previous module.
     * @private
     */
    prev: function () {
        return this.move(-1);
    },
    /**
     * Go to next module.
     * @private
     */
    next: function () {
        return this.move(1);
    },
    /**
     * Move to prev/next module.
     * @private
     * @param {number} direction
     * Direction to move. +1 for next, -1 for prev.
     * @return {boolean}
     * True if there was a valid module in direction.
     */
    move: function (direction) {
        var curModule = this.modules && this.modules[this.currentModuleIx];
        if (curModule && curModule.terminate) {
            curModule.terminate(direction);
        }
        // Remove existing focus border if any
        if (this.chart.focusElement) {
            this.chart.focusElement.removeFocusBorder();
        }
        this.currentModuleIx += direction;
        var newModule = this.modules && this.modules[this.currentModuleIx];
        if (newModule) {
            if (newModule.validate && !newModule.validate()) {
                return this.move(direction); // Invalid module, recurse
            }
            if (newModule.init) {
                newModule.init(direction); // Valid module, init it
                return true;
            }
        }
        // No module
        this.currentModuleIx = 0; // Reset counter
        // Set focus to chart or exit anchor depending on direction
        if (direction > 0) {
            this.exiting = true;
            this.exitAnchor.focus();
        }
        else {
            this.chart.renderTo.focus();
        }
        return false;
    },
    /**
     * We use an exit anchor to move focus out of chart whenever we want, by
     * setting focus to this div and not preventing the default tab action. We
     * also use this when users come back into the chart by tabbing back, in
     * order to navigate from the end of the chart.
     * @private
     */
    updateExitAnchor: function () {
        var endMarkerId = 'highcharts-end-of-chart-marker-' + this.chart.index, endMarker = getElement(endMarkerId);
        this.removeExitAnchor();
        if (endMarker) {
            this.makeElementAnExitAnchor(endMarker);
            this.exitAnchor = endMarker;
        }
        else {
            this.createExitAnchor();
        }
    },
    /**
     * Chart container should have tabindex if navigation is enabled.
     * @private
     */
    updateContainerTabindex: function () {
        var a11yOptions = this.chart.options.accessibility, keyboardOptions = a11yOptions && a11yOptions.keyboardNavigation, shouldHaveTabindex = !(keyboardOptions && keyboardOptions.enabled === false), container = this.chart.container, curTabindex = container.getAttribute('tabIndex');
        if (shouldHaveTabindex && !curTabindex) {
            container.setAttribute('tabindex', '0');
        }
        else if (!shouldHaveTabindex && curTabindex === '0') {
            container.removeAttribute('tabindex');
        }
    },
    /**
     * @private
     */
    makeElementAnExitAnchor: function (el) {
        el.setAttribute('class', 'highcharts-exit-anchor');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-hidden', false);
        // Handle focus
        this.addExitAnchorEventsToEl(el);
    },
    /**
     * Add new exit anchor to the chart.
     *
     * @private
     */
    createExitAnchor: function () {
        var chart = this.chart, exitAnchor = this.exitAnchor = doc.createElement('div');
        // Hide exit anchor
        merge(true, exitAnchor.style, {
            position: 'absolute',
            width: '1px',
            height: '1px',
            zIndex: 0,
            overflow: 'hidden',
            outline: 'none'
        });
        chart.renderTo.appendChild(exitAnchor);
        this.makeElementAnExitAnchor(exitAnchor);
    },
    /**
     * @private
     */
    removeExitAnchor: function () {
        if (this.exitAnchor && this.exitAnchor.parentNode) {
            this.exitAnchor.parentNode
                .removeChild(this.exitAnchor);
            delete this.exitAnchor;
        }
    },
    /**
     * @private
     */
    addExitAnchorEventsToEl: function (element) {
        var chart = this.chart, keyboardNavigation = this;
        this.eventProvider.addEvent(element, 'focus', function (ev) {
            var e = ev || win.event, curModule, focusComesFromChart = (e.relatedTarget &&
                chart.container.contains(e.relatedTarget)), comingInBackwards = !(focusComesFromChart || keyboardNavigation.exiting);
            if (comingInBackwards) {
                chart.renderTo.focus();
                e.preventDefault();
                // Move to last valid keyboard nav module
                // Note the we don't run it, just set the index
                if (keyboardNavigation.modules &&
                    keyboardNavigation.modules.length) {
                    keyboardNavigation.currentModuleIx =
                        keyboardNavigation.modules.length - 1;
                    curModule = keyboardNavigation.modules[keyboardNavigation.currentModuleIx];
                    // Validate the module
                    if (curModule &&
                        curModule.validate && !curModule.validate()) {
                        // Invalid. Try moving backwards to find next valid.
                        keyboardNavigation.prev();
                    }
                    else if (curModule) {
                        // We have a valid module, init it
                        curModule.init(-1);
                    }
                }
            }
            else {
                // Don't skip the next focus, we only skip once.
                keyboardNavigation.exiting = false;
            }
        });
    },
    /**
     * Remove all traces of keyboard navigation.
     * @private
     */
    destroy: function () {
        this.removeExitAnchor();
        this.eventProvider.removeAddedEvents();
        if (this.chart.container.getAttribute('tabindex') === '0') {
            this.chart.container.removeAttribute('tabindex');
        }
    }
};
export default KeyboardNavigation;

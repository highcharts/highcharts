/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility module for Highcharts
 *
 *  License: www.highcharts.com/license
 *
 * */

/**
 * @interface Highcharts.PointAccessibilityOptionsObject
 *//**
 * Provide a description of the data point, announced to screen readers.
 * @name Highcharts.PointAccessibilityOptionsObject#description
 * @type {string|undefined}
 * @requires modules/accessibility
 * @since 7.1.0
 */

/**
 * @interface Highcharts.PointOptionsObject
 *//**
 * @name Highcharts.PointOptionsObject#accessibility
 * @type {Highcharts.PointAccessibilityOptionsObject|undefined}
 * @requires modules/accessibility
 * @since 7.1.0
 *//**
 * A description of the point to add to the screen reader information about the
 * point. Requires the Accessibility module.
 * @name Highcharts.PointOptionsObject#description
 * @type {string|undefined}
 * @requires modules/accessibility
 * @since 5.0.0
 */

'use strict';

import H from '../../parts/Globals.js';
import KeyboardNavigationHandler from './KeyboardNavigationHandler.js';
import AccessibilityComponent from './AccessibilityComponent.js';
import KeyboardNavigation from './KeyboardNavigation.js';
import LegendComponent from './components/LegendComponent.js';
import MenuComponent from './components/MenuComponent.js';
import SeriesComponent from './components/SeriesComponent.js';
import ZoomComponent from './components/ZoomComponent.js';
import RangeSelectorComponent from './components/RangeSelectorComponent.js';
import InfoRegionComponent from './components/InfoRegionComponent.js';
import ContainerComponent from './components/ContainerComponent.js';
import whcm from './high-contrast-mode.js';
import highContrastTheme from './high-contrast-theme.js';
import defaultOptions from './options.js';
import '../../modules/accessibility/a11y-i18n.js';

var addEvent = H.addEvent,
    doc = H.win.document,
    pick = H.pick,
    merge = H.merge,
    extend = H.extend,
    error = H.error;


// Add default options
merge(true, H.defaultOptions, defaultOptions, {
    accessibility: {
        highContrastTheme: highContrastTheme
    }
});

// Expose classes on Highcharts namespace
H.KeyboardNavigationHandler = KeyboardNavigationHandler;
H.AccessibilityComponent = AccessibilityComponent;


/*
 * Add focus border functionality to SVGElements. Draws a new rect on top of
 * element around its bounding box. This is used by multiple components.
 */
H.extend(H.SVGElement.prototype, {

    /**
     * @private
     * @function Highcharts.SVGElement#addFocusBorder
     *
     * @param {number} margin
     *
     * @param {Highcharts.CSSObject} style
     */
    addFocusBorder: function (margin, style) {
        // Allow updating by just adding new border
        if (this.focusBorder) {
            this.removeFocusBorder();
        }
        // Add the border rect
        var bb = this.getBBox(),
            pad = pick(margin, 3);

        bb.x += this.translateX ? this.translateX : 0;
        bb.y += this.translateY ? this.translateY : 0;

        this.focusBorder = this.renderer.rect(
            bb.x - pad,
            bb.y - pad,
            bb.width + 2 * pad,
            bb.height + 2 * pad,
            style && style.borderRadius
        )
            .addClass('highcharts-focus-border')
            .attr({
                zIndex: 99
            })
            .add(this.parentGroup);

        if (!this.renderer.styledMode) {
            this.focusBorder.attr({
                stroke: style && style.stroke,
                'stroke-width': style && style.strokeWidth
            });
        }
    },

    /**
     * @private
     * @function Highcharts.SVGElement#removeFocusBorder
     */
    removeFocusBorder: function () {
        if (this.focusBorder) {
            this.focusBorder.destroy();
            delete this.focusBorder;
        }
    }
});


/**
 * Set chart's focus to an SVGElement. Calls focus() on it, and draws the focus
 * border. This is used by multiple components.
 *
 * @private
 * @function Highcharts.Chart#setFocusToElement
 *
 * @param {Highcharts.SVGElement} svgElement
 *        Element to draw the border around.
 *
 * @param {SVGDOMElement|HTMLDOMElement} [focusElement]
 *        If supplied, it draws the border around svgElement and sets the focus
 *        to focusElement.
 */
H.Chart.prototype.setFocusToElement = function (svgElement, focusElement) {
    var focusBorderOptions = this.options.accessibility
            .keyboardNavigation.focusBorder,
        browserFocusElement = focusElement || svgElement.element;

    // Set browser focus if possible
    if (
        browserFocusElement &&
        browserFocusElement.focus
    ) {
        // If there is no focusin-listener, add one to work around Edge issue
        // where Narrator is not reading out points despite calling focus().
        if (!(
            browserFocusElement.hcEvents &&
            browserFocusElement.hcEvents.focusin
        )) {
            addEvent(browserFocusElement, 'focusin', function () {});
        }

        browserFocusElement.focus();
        // Hide default focus ring
        if (focusBorderOptions.hideBrowserFocusOutline) {
            browserFocusElement.style.outline = 'none';
        }
    }
    if (focusBorderOptions.enabled) {
        // Remove old focus border
        if (this.focusElement) {
            this.focusElement.removeFocusBorder();
        }
        // Draw focus border (since some browsers don't do it automatically)
        svgElement.addFocusBorder(focusBorderOptions.margin, {
            stroke: focusBorderOptions.style.color,
            strokeWidth: focusBorderOptions.style.lineWidth,
            borderRadius: focusBorderOptions.style.borderRadius
        });
        this.focusElement = svgElement;
    }
};


/**
 * Get descriptive label for axis. This is used by multiple components.
 *
 * @private
 * @function Highcharts.Axis#getDescription
 *
 * @return {string}
 */
H.Axis.prototype.getDescription = function () {
    return (
        this.userOptions && this.userOptions.accessibility &&
            this.userOptions.accessibility.description ||
        this.axisTitle && this.axisTitle.textStr ||
        this.options.id ||
        this.categories && 'categories' ||
        this.isDatetimeAxis && 'Time' ||
        'values'
    );
};


/**
 * The Accessibility class
 *
 * @private
 * @requires module:modules/accessibility
 *
 * @class
 * @name Highcharts.Accessibility
 *
 * @param {Highcharts.Chart} chart
 *        Chart object
 */
function Accessibility(chart) {
    this.init(chart);
}

Accessibility.prototype = {

    /**
     * Initialize the accessibility class
     * @private
     * @param {Highcharts.Chart} chart
     *        Chart object
     */
    init: function (chart) {
        var a11yOptions = chart.options.accessibility;
        this.chart = chart;

        // Abort on old browsers
        if (!doc.addEventListener || !chart.renderer.isSVG) {
            chart.renderTo.setAttribute('aria-hidden', true);
            return;
        }

        // Copy over any deprecated options that are used. We could do this on
        // every update, but it is probably not needed.
        this.copyDeprecatedOptions();

        // Add the components
        var components = this.components = {
            container: new ContainerComponent(chart),
            infoRegion: new InfoRegionComponent(chart),
            legend: new LegendComponent(chart),
            chartMenu: new MenuComponent(chart),
            rangeSelector: new RangeSelectorComponent(chart),
            series: new SeriesComponent(chart),
            zoom: new ZoomComponent(chart)
        };
        if (a11yOptions.customComponents) {
            extend(this.components, a11yOptions.customComponents);
        }

        this.keyboardNavigation = new KeyboardNavigation(chart, components);
        this.update();
    },


    /**
     * Update all components.
     */
    update: function () {
        var components = this.components,
            chart = this.chart,
            a11yOptions = chart.options.accessibility;

        // Update the chart type list as this is used by multiple modules
        chart.types = this.getChartTypes();

        // Update markup
        Object.keys(components).forEach(function (componentName) {
            components[componentName].onChartUpdate();
        });

        // Update keyboard navigation
        this.keyboardNavigation.update(
            a11yOptions.keyboardNavigation.order
        );

        // Handle high contrast mode
        if (
            !chart.highContrastModeActive && // Only do this once
            whcm.isHighContrastModeActive(chart)
        ) {
            whcm.setHighContrastTheme(chart);
        }
    },


    /**
     * Destroy all elements.
     */
    destroy: function () {
        var chart = this.chart || {};

        // Destroy components
        var components = this.components;
        Object.keys(components).forEach(function (componentName) {
            components[componentName].destroy();
        });

        // Kill keyboard nav
        if (this.keyboardNavigation) {
            this.keyboardNavigation.destroy();
        }

        // Hide container from screen readers if it exists
        if (chart.renderTo) {
            chart.renderTo.setAttribute('aria-hidden', true);
        }

        // Remove focus border if it exists
        if (chart.focusElement) {
            chart.focusElement.removeFocusBorder();
        }
    },


    /**
     * Return a list of the types of series we have in the chart.
     * @private
     */
    getChartTypes: function () {
        var types = {};
        this.chart.series.forEach(function (series) {
            types[series.type] = 1;
        });
        return Object.keys(types);
    },


    /**
     * Copy options that are deprecated over to new options. Logs warnings to
     * console for deprecated options used. The following options are
     * deprecated:
     *
     *  chart.description -> accessibility.description
     *  chart.typeDescription -> accessibility.typeDescription
     *  series.description -> series.accessibility.description
     *  series.exposeElementToA11y -> series.accessibility.exposeAsGroupOnly
     *  series.pointDescriptionFormatter ->
     *      series.accessibility.pointDescriptionFormatter
     *  series.skipKeyboardNavigation ->
     *      series.accessibility.keyboardNavigation.enabled
     *  point.description -> point.accessibility.description
     *  axis.description -> axis.accessibility.description
     *
     * @private
     */
    copyDeprecatedOptions: function () {
        var chart = this.chart,
            // Warn user that a deprecated option was used
            warn = function (oldOption, newOption) {
                error(
                    'Highcharts: Deprecated option ' + oldOption +
                    ' used. Use ' + newOption + ' instead.', false, chart
                );
            },
            // Set a new option on a root prop, where the option is defined as
            // an array of suboptions.
            traverseSetOption = function (val, optionAsArray, root) {
                var opt = root,
                    prop,
                    i = 0;
                for (;i < optionAsArray.length - 1; ++i) {
                    prop = optionAsArray[i];
                    opt = opt[prop] = pick(opt[prop], {});
                }
                opt[optionAsArray[optionAsArray.length - 1]] = val;
            },
            // Map of deprecated series options. New options are defined as
            // arrays of paths under series.options.
            oldToNewSeriesOptions = {
                description: ['accessibility', 'description'],
                exposeElementToA11y: ['accessibility', 'exposeAsGroupOnly'],
                pointDescriptionFormatter: [
                    'accessibility', 'pointDescriptionFormatter'
                ],
                skipKeyboardNavigation: [
                    'accessibility', 'keyboardNavigation', 'enabled'
                ]
            };

        // Deal with chart wide options (description, typeDescription)
        var chartOptions = chart.options.chart || {},
            a11yOptions = chart.options.accessibility || {};
        ['description', 'typeDescription'].forEach(function (prop) {
            if (chartOptions[prop]) {
                a11yOptions[prop] = chartOptions[prop];
                warn('chart.' + prop, 'accessibility.' + prop);
            }
        });

        // Deal with axis description
        chart.axes.forEach(function (axis) {
            var opts = axis.options;
            if (opts && opts.description) {
                opts.accessibility = opts.accessibility || {};
                opts.accessibility.description = opts.description;
                warn('axis.description', 'axis.accessibility.description');
            }
        });

        // Loop through all series and handle options
        if (!chart.series) {
            return;
        }
        chart.series.forEach(function (series) {
            // Handle series wide options
            Object.keys(oldToNewSeriesOptions).forEach(function (oldOption) {
                var optionVal = series.options[oldOption];
                if (optionVal !== undefined) {
                    // Set the new option
                    traverseSetOption(
                        // Note that skipKeyboardNavigation has inverted option
                        // value, since we set enabled rather than disabled
                        oldOption === 'skipKeyboardNavigation' ?
                            !optionVal : optionVal,
                        oldToNewSeriesOptions[oldOption],
                        series.options
                    );
                    warn(
                        'series.' + oldOption, 'series.' +
                        oldToNewSeriesOptions[oldOption].join('.')
                    );
                }
            });

            // Loop through the points and handle point.description
            if (series.points) {
                series.points.forEach(function (point) {
                    if (point.options && point.options.description) {
                        point.options.accessibility =
                            point.options.accessibility || {};
                        point.options.accessibility.description =
                            point.options.description;
                        warn('point.description',
                            'point.accessibility.description');
                    }
                });
            }
        });
    }

};


// Handle updates to the module and send render updates to components
addEvent(H.Chart, 'render', function (e) {
    var a11y = this.accessibility;
    // Update/destroy
    if (this.a11yDirty && this.renderTo) {
        delete this.a11yDirty;
        var accessibilityOptions = this.options.accessibility;
        if (accessibilityOptions && accessibilityOptions.enabled) {
            if (a11y) {
                a11y.update();
            } else {
                this.accessibility = a11y = new Accessibility(this);
            }
        } else if (a11y) {
            // Destroy if after update we have a11y and it is disabled
            if (a11y.destroy) {
                a11y.destroy();
            }
            delete this.accessibility;
        } else {
            // Just hide container
            this.renderTo.setAttribute('aria-hidden', true);
        }
    }
    // Update markup regardless
    if (a11y) {
        Object.keys(a11y.components).forEach(function (componentName) {
            a11y.components[componentName].onChartRender(e);
        });
    }
});

// Update with chart/series/point updates
addEvent(H.Chart, 'update', function (e) {
    // Merge new options
    var newOptions = e.options.accessibility;
    if (newOptions) {
        // Handle custom component updating specifically
        if (newOptions.customComponents) {
            this.options.accessibility.customComponents =
                newOptions.customComponents;
            delete newOptions.customComponents;
        }
        merge(true, this.options.accessibility, newOptions);
        // Recreate from scratch
        if (this.accessibility && this.accessibility.destroy) {
            this.accessibility.destroy();
            delete this.accessibility;
        }
    }

    // Mark dirty for update
    this.a11yDirty = true;
});

// Mark dirty for update
addEvent(H.Point, 'update', function () {
    if (this.series.chart.accessibility) {
        this.series.chart.a11yDirty = true;
    }
});
['addSeries', 'init'].forEach(function (event) {
    addEvent(H.Chart, event, function () {
        this.a11yDirty = true;
    });
});
['update', 'updatedData', 'remove'].forEach(function (event) {
    addEvent(H.Series, event, function () {
        if (this.chart.accessibility) {
            this.chart.a11yDirty = true;
        }
    });
});

// Direct updates (events happen after render)
[
    'afterDrilldown', 'drillupall'
].forEach(function (event) {
    addEvent(H.Chart, event, function () {
        if (this.accessibility) {
            this.accessibility.update();
        }
    });
});

// Destroy with chart
addEvent(H.Chart, 'destroy', function () {
    if (this.accessibility) {
        this.accessibility.destroy();
    }
});

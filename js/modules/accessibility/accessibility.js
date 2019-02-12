/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility module for Highcharts
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../parts/Globals.js';
import KeyboardNavigation from './KeyboardNavigation.js';
import LegendComponent from './components/LegendComponent.js';
import MenuComponent from './components/MenuComponent.js';
import SeriesComponent from './components/SeriesComponent.js';
import ZoomComponent from './components/ZoomComponent.js';
import RangeSelectorComponent from './components/RangeSelectorComponent.js';
import InfoRegionComponent from './components/InfoRegionComponent.js';
import defaultOptions from './options.js';
import '../../modules/accessibility/a11y-i18n.js';

var addEvent = H.addEvent,
    pick = H.pick;

// Add default options
H.merge(true, H.defaultOptions, defaultOptions);


/*
 * Add focus border functionality to SVGElements. Draws a new rect on top of
 * element around its bounding box.
 */
H.extend(H.SVGElement.prototype, {

    /**
     * @private
     * @function Highcharts.SVGElement#addFocusBorder
     *
     * @param {number} margin
     *
     * @param {Higcharts.CSSObject} style
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
 * border.
 *
 * @private
 * @function Highcharts.Chart#setFocusToElement
 *
 * @param {Highcharts.SVGElement} svgElement
 *        Element to draw the border around.
 *
 * @param {Highcharts.SVGElement} [focusElement]
 *        If supplied, it draws the border around svgElement and sets the focus
 *        to focusElement.
 */
H.Chart.prototype.setFocusToElement = function (svgElement, focusElement) {
    var focusBorderOptions = this.options.accessibility
            .keyboardNavigation.focusBorder,
        browserFocusElement = focusElement || svgElement;

    // Set browser focus if possible
    if (
        browserFocusElement.element &&
        browserFocusElement.element.focus
    ) {
        // If there is no focusin-listener, add one to work around Edge issue
        // where Narrator is not reading out points despite calling focus().
        if (!(
            browserFocusElement.element.hcEvents &&
            browserFocusElement.element.hcEvents.focusin
        )) {
            addEvent(browserFocusElement.element, 'focusin', function () {});
        }

        browserFocusElement.element.focus();
        // Hide default focus ring
        if (focusBorderOptions.hideBrowserFocusOutline) {
            browserFocusElement.css({ outline: 'none' });
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
 * The Accessibility class
 *
 * @private
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
        this.chart = chart;

        // Copy over any deprecated options that are used. We could do this on
        // every update, but it is probably not needed.
        this.copyDeprecatedOptions();

        // Add the components
        var components = this.components = {
            // container
            infoRegion: new InfoRegionComponent(chart),
            chartMenu: new MenuComponent(chart),
            rangeSelector: new RangeSelectorComponent(chart),
            series: new SeriesComponent(chart),
            legend: new LegendComponent(chart),
            zoom: new ZoomComponent(chart)
        };

        this.keyboardNavigation = new KeyboardNavigation(chart, components);
        this.update();
    },


    /**
     * Update all components.
     */
    update: function () {
        var components = this.components,
            accessibilityOptions = this.chart.options.accessibility;

        // Update markup
        Object.keys(components).forEach(function (componentName) {
            components[componentName].onChartUpdate();
        });

        // Update keyboard navigation
        this.keyboardNavigation.update(
            accessibilityOptions &&
                accessibilityOptions.keyboardNavigation &&
                accessibilityOptions.keyboardNavigation.order
        );
    },


    /**
     * Destroy all elements.
     */
    destroy: function () {
        // Destroy components
        var components = this.components;
        Object.keys(components).forEach(function (componentName) {
            components[componentName].destroy();
        });

        // Kill keyboard nav
        this.keyboardNavigation.destroy();

        // Remove focus border if it exists
        if (this.chart.focusElement) {
            this.chart.focusElement.removeFocusBorder();
        }
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
     *
     * @private
     */
    copyDeprecatedOptions: function () {
        var chart = this.chart,
            // Warn user that a deprecated option was used
            warn = function (oldOption, newOption) {
                console.warn( // eslint-disable-line
                    'Highcharts: Deprecated option ' + oldOption +
                    ' used. Use ' + newOption + ' instead.'
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

        // Loop through all series and handle options
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
            series.points.forEach(function (point) {
                if (point.options && point.options.description) {
                    point.options.accessibility =
                        point.options.accessibility || {};
                    point.options.accessibility.description =
                        point.options.description;
                    warn(
                        'point.description', 'point.accessibility.description'
                    );
                }
            });
        });
    }

};


// Init on chart when loaded
addEvent(H.Chart, 'load', function () {
    var accessibilityOptions = this.options.accessibility;
    if (accessibilityOptions && accessibilityOptions.enabled) {
        this.accessibility = new Accessibility(this);
    }
});

// Update with chart/series/point updates
addEvent(H.Chart, 'update', function () {
    var accessibilityOptions = this.options.accessibility;
    if (accessibilityOptions && accessibilityOptions.enabled) {
        if (this.accessibility) {
            this.accessibility.update();
        } else {
            this.accessibility = new Accessibility(this);
        }
    } else if (this.accessibility) {
        // Destroy if after update we have a11y and it is disabled
        if (this.accessibility.destroy) {
            this.accessibility.destroy();
        }
        delete this.accessibility;
    }
});
addEvent(H.Point, 'update', function () {
    if (this.series.chart.accessibility) {
        this.series.chart.accessibility.update();
    }
});
['update', 'updatedData'].forEach(function (event) {
    addEvent(H.Series, event, function () {
        if (this.chart.accessibility) {
            this.chart.accessibility.update();
        }
    });
});
['addSeries', 'removeSeries'].forEach(function (event) {
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

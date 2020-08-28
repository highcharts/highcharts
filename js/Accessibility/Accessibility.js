/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Accessibility module for Highcharts
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import ChartUtilities from './Utils/ChartUtilities.js';
import H from '../Core/Globals.js';
var doc = H.doc;
import KeyboardNavigationHandler from './KeyboardNavigationHandler.js';
import CartesianSeries from '../Core/Series/CartesianSeries.js';
import O from '../Core/Options.js';
var defaultOptions = O.defaultOptions;
import Point from '../Core/Series/Point.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, extend = U.extend, fireEvent = U.fireEvent, merge = U.merge;
import AccessibilityComponent from './AccessibilityComponent.js';
import KeyboardNavigation from './KeyboardNavigation.js';
import LegendComponent from './Components/LegendComponent.js';
import MenuComponent from './Components/MenuComponent.js';
import SeriesComponent from './Components/SeriesComponent/SeriesComponent.js';
import ZoomComponent from './Components/ZoomComponent.js';
import RangeSelectorComponent from './Components/RangeSelectorComponent.js';
import InfoRegionsComponent from './Components/InfoRegionsComponent.js';
import ContainerComponent from './Components/ContainerComponent.js';
import whcm from './HighContrastMode.js';
import highContrastTheme from './HighContrastTheme.js';
import defaultOptionsA11Y from './Options/Options.js';
import defaultLangOptions from './Options/LangOptions.js';
import copyDeprecatedOptions from './Options/DeprecatedOptions.js';
import './A11yI18n.js';
import './FocusBorder.js';
// Add default options
merge(true, defaultOptions, defaultOptionsA11Y, {
    accessibility: {
        highContrastTheme: highContrastTheme
    },
    lang: defaultLangOptions
});
// Expose functionality on Highcharts namespace
H.A11yChartUtilities = ChartUtilities;
H.KeyboardNavigationHandler = KeyboardNavigationHandler;
H.AccessibilityComponent = AccessibilityComponent;
/* eslint-disable no-invalid-this, valid-jsdoc */
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
        this.chart = chart;
        // Abort on old browsers
        if (!doc.addEventListener || !chart.renderer.isSVG) {
            chart.renderTo.setAttribute('aria-hidden', true);
            return;
        }
        // Copy over any deprecated options that are used. We could do this on
        // every update, but it is probably not needed.
        copyDeprecatedOptions(chart);
        this.initComponents();
        this.keyboardNavigation = new KeyboardNavigation(chart, this.components);
        this.update();
    },
    /**
     * @private
     */
    initComponents: function () {
        var chart = this.chart, a11yOptions = chart.options.accessibility;
        this.components = {
            container: new ContainerComponent(),
            infoRegions: new InfoRegionsComponent(),
            legend: new LegendComponent(),
            chartMenu: new MenuComponent(),
            rangeSelector: new RangeSelectorComponent(),
            series: new SeriesComponent(),
            zoom: new ZoomComponent()
        };
        if (a11yOptions.customComponents) {
            extend(this.components, a11yOptions.customComponents);
        }
        var components = this.components;
        this.getComponentOrder().forEach(function (componentName) {
            components[componentName].initBase(chart);
            components[componentName].init();
        });
    },
    /**
     * Get order to update components in.
     * @private
     */
    getComponentOrder: function () {
        if (!this.components) {
            return []; // For zombie accessibility object on old browsers
        }
        if (!this.components.series) {
            return Object.keys(this.components);
        }
        var componentsExceptSeries = Object.keys(this.components)
            .filter(function (c) { return c !== 'series'; });
        // Update series first, so that other components can read accessibility
        // info on points.
        return ['series'].concat(componentsExceptSeries);
    },
    /**
     * Update all components.
     */
    update: function () {
        var components = this.components, chart = this.chart, a11yOptions = chart.options.accessibility;
        fireEvent(chart, 'beforeA11yUpdate');
        // Update the chart type list as this is used by multiple modules
        chart.types = this.getChartTypes();
        // Update markup
        this.getComponentOrder().forEach(function (componentName) {
            components[componentName].onChartUpdate();
            fireEvent(chart, 'afterA11yComponentUpdate', {
                name: componentName,
                component: components[componentName]
            });
        });
        // Update keyboard navigation
        this.keyboardNavigation.update(a11yOptions.keyboardNavigation.order);
        // Handle high contrast mode
        if (!chart.highContrastModeActive && // Only do this once
            whcm.isHighContrastModeActive()) {
            whcm.setHighContrastTheme(chart);
        }
        fireEvent(chart, 'afterA11yUpdate', {
            accessibility: this
        });
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
            components[componentName].destroyBase();
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
    }
};
/**
 * @private
 */
H.Chart.prototype.updateA11yEnabled = function () {
    var a11y = this.accessibility, accessibilityOptions = this.options.accessibility;
    if (accessibilityOptions && accessibilityOptions.enabled) {
        if (a11y) {
            a11y.update();
        }
        else {
            this.accessibility = a11y = new Accessibility(this);
        }
    }
    else if (a11y) {
        // Destroy if after update we have a11y and it is disabled
        if (a11y.destroy) {
            a11y.destroy();
        }
        delete this.accessibility;
    }
    else {
        // Just hide container
        this.renderTo.setAttribute('aria-hidden', true);
    }
};
// Handle updates to the module and send render updates to components
addEvent(H.Chart, 'render', function (e) {
    // Update/destroy
    if (this.a11yDirty && this.renderTo) {
        delete this.a11yDirty;
        this.updateA11yEnabled();
    }
    var a11y = this.accessibility;
    if (a11y) {
        a11y.getComponentOrder().forEach(function (componentName) {
            a11y.components[componentName].onChartRender();
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
addEvent(Point, 'update', function () {
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
    addEvent(CartesianSeries, event, function () {
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

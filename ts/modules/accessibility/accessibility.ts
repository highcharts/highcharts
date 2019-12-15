/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility module for Highcharts
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import ChartUtilities from './utils/chartUtilities.js';
import H from '../../parts/Globals.js';
import KeyboardNavigationHandler from './KeyboardNavigationHandler.js';

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class Accessibility {
            public constructor(chart: AccessibilityChart);
            public chart: AccessibilityChart;
            public components: AccessibilityComponentsObject;
            public keyboardNavigation: KeyboardNavigation;
            public destroy(): void;
            public getChartTypes(): Array<string>;
            public init(chart: Chart): void;
            public initComponents(): void;
            public update(): void;
        }
        interface AccessibilityComponentsObject {
            [key: string]: AccessibilityComponent;
            container: ContainerComponent;
            infoRegions: InfoRegionsComponent;
            legend: LegendComponent;
            chartMenu: MenuComponent;
            rangeSelector: RangeSelectorComponent;
            series: SeriesComponent;
            zoom: ZoomComponent;
        }
        interface AccessibilityChart extends Chart {
            options: Required<Options>;
            series: Array<AccessibilitySeries>;
        }
        interface AccessibilityPoint extends Point {
            series: AccessibilitySeries;
        }
        interface AccessibilitySeries extends Series {
            chart: AccessibilityChart;
            options: Required<SeriesOptions>;
            points: Array<AccessibilityPoint>;
        }
        interface Chart {
            a11yDirty?: boolean;
            accessibility?: Accessibility;
            types?: Array<string>;
            /** @require modules/accessibility */
            updateA11yEnabled(): void;
        }
        let A11yChartUtilities: A11yChartUtilities;
    }
}

import U from '../../parts/Utilities.js';
var extend = U.extend;

var addEvent = H.addEvent,
    doc = H.win.document,
    merge = H.merge,
    fireEvent = H.fireEvent;

import AccessibilityComponent from './AccessibilityComponent.js';
import KeyboardNavigation from './KeyboardNavigation.js';
import LegendComponent from './components/LegendComponent.js';
import MenuComponent from './components/MenuComponent.js';
import SeriesComponent from './components/SeriesComponent/SeriesComponent.js';
import ZoomComponent from './components/ZoomComponent.js';
import RangeSelectorComponent from './components/RangeSelectorComponent.js';
import InfoRegionsComponent from './components/InfoRegionsComponent.js';
import ContainerComponent from './components/ContainerComponent.js';
import whcm from './high-contrast-mode.js';
import highContrastTheme from './high-contrast-theme.js';
import defaultOptions from './options/options.js';
import defaultLangOptions from './options/langOptions.js';
import copyDeprecatedOptions from './options/deprecatedOptions.js';
import './a11y-i18n.js';
import './focusBorder.js';


// Add default options
merge(
    true,
    H.defaultOptions,
    defaultOptions,
    {
        accessibility: {
            highContrastTheme: highContrastTheme
        },
        lang: defaultLangOptions
    }
);


// Expose functionality on Highcharts namespace
H.A11yChartUtilities = ChartUtilities;
H.KeyboardNavigationHandler = KeyboardNavigationHandler as any;
H.AccessibilityComponent = AccessibilityComponent as any;


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
function Accessibility(
    this: Highcharts.Accessibility,
    chart: Highcharts.Chart
): void {
    this.init(chart);
}

Accessibility.prototype = {

    /**
     * Initialize the accessibility class
     * @private
     * @param {Highcharts.Chart} chart
     *        Chart object
     */
    init: function (
        this: Highcharts.Accessibility,
        chart: Highcharts.Chart
    ): void {
        this.chart = chart as any;

        // Abort on old browsers
        if (!doc.addEventListener || !chart.renderer.isSVG) {
            chart.renderTo.setAttribute('aria-hidden', true);
            return;
        }

        // Copy over any deprecated options that are used. We could do this on
        // every update, but it is probably not needed.
        copyDeprecatedOptions(chart);

        this.initComponents();
        this.keyboardNavigation = new (KeyboardNavigation as any)(
            chart, this.components
        );
        this.update();
    },


    /**
     * @private
     */
    initComponents: function (this: Highcharts.Accessibility): void {
        var chart = this.chart,
            a11yOptions = chart.options.accessibility;

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
        // Refactor to use Object.values if we polyfill
        Object.keys(components).forEach(function (componentName: string): void {
            components[componentName].initBase(chart);
            components[componentName].init();
        });
    },


    /**
     * Update all components.
     */
    update: function (this: Highcharts.Accessibility): void {
        var components = this.components,
            chart = this.chart,
            a11yOptions = chart.options.accessibility;

        fireEvent(chart, 'beforeA11yUpdate');

        // Update the chart type list as this is used by multiple modules
        chart.types = this.getChartTypes();

        // Update markup
        Object.keys(components).forEach(function (componentName: string): void {
            components[componentName].onChartUpdate();

            fireEvent(chart, 'afterA11yComponentUpdate', {
                name: componentName,
                component: components[componentName]
            });
        });

        // Update keyboard navigation
        this.keyboardNavigation.update(
            (a11yOptions.keyboardNavigation as any).order
        );

        // Handle high contrast mode
        if (
            !chart.highContrastModeActive && // Only do this once
            whcm.isHighContrastModeActive()
        ) {
            whcm.setHighContrastTheme(chart);
        }

        fireEvent(chart, 'afterA11yUpdate');
    },


    /**
     * Destroy all elements.
     */
    destroy: function (): void {
        var chart: Highcharts.Chart = this.chart || {};

        // Destroy components
        var components = this.components;
        Object.keys(components).forEach(function (componentName: string): void {
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
    getChartTypes: function (): Array<string> {
        var types: Highcharts.Dictionary<number> = {};
        this.chart.series.forEach(function (series: Highcharts.Series): void {
            types[series.type] = 1;
        });
        return Object.keys(types);
    }
};


/**
 * @private
 */
H.Chart.prototype.updateA11yEnabled = function (): void {
    var a11y = this.accessibility,
        accessibilityOptions = this.options.accessibility;
    if (accessibilityOptions && accessibilityOptions.enabled) {
        if (a11y) {
            a11y.update();
        } else {
            this.accessibility = a11y = new (Accessibility as any)(this);
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
};

// Handle updates to the module and send render updates to components
addEvent(H.Chart, 'render', function (e: Event): void {
    // Update/destroy
    if (this.a11yDirty && this.renderTo) {
        delete this.a11yDirty;
        this.updateA11yEnabled();
    }

    const a11y = this.accessibility;
    if (a11y) {
        Object.keys(a11y.components).forEach(function (
            componentName: string
        ): void {
            a11y.components[componentName].onChartRender();
        });
    }
});

// Update with chart/series/point updates
addEvent(H.Chart as any, 'update', function (
    this: Highcharts.AccessibilityChart,
    e: { options: Highcharts.Options }
): void {
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
addEvent(H.Point, 'update', function (): void {
    if (this.series.chart.accessibility) {
        this.series.chart.a11yDirty = true;
    }
});
['addSeries', 'init'].forEach(function (event: string): void {
    addEvent(H.Chart, event, function (): void {
        this.a11yDirty = true;
    });
});
['update', 'updatedData', 'remove'].forEach(function (event: string): void {
    addEvent(H.Series, event, function (): void {
        if (this.chart.accessibility) {
            this.chart.a11yDirty = true;
        }
    });
});

// Direct updates (events happen after render)
[
    'afterDrilldown', 'drillupall'
].forEach(function (event: string): void {
    addEvent(H.Chart, event, function (): void {
        if (this.accessibility) {
            this.accessibility.update();
        }
    });
});

// Destroy with chart
addEvent(H.Chart, 'destroy', function (): void {
    if (this.accessibility) {
        this.accessibility.destroy();
    }
});

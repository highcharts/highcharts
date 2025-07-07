/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  Accessibility module for Highcharts
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

// Types
import type Chart from '../Core/Chart/Chart';
import type { Options } from '../Core/Options';

// Imports
import {
    getChartDescriptionInfo,
    getChartDetailedInfo,
    type ChartDescriptionInfo,
    type ChartDetailedInfo,
    type A11yModel
} from './ChartInfo.js';
import { ProxyProvider } from './ProxyProvider.js';
import D from '../Core/Defaults.js';
const { defaultOptions } = D;
import defaultOptionsA11y from './A11yDefaults.js';
import G from '../Core/Globals.js';
const { composed } = G;
import U from '../Core/Utilities.js';
const {
    addEvent,
    attr,
    error,
    fireEvent,
    merge,
    pushUnique
} = U;

// Declarations
declare module '../Core/Chart/ChartLike' {
    interface ChartLike {
        a11y?: A11y;
        needsA11yStatusCheck?: boolean;
    }
}


/**
 * The A11y class - collecting accessibility related logic for a chart.
 * @internal
 */
class A11y {
    private chartDescriptionInfo!: ChartDescriptionInfo;
    private chartDetailedInfo?: ChartDetailedInfo;
    private model?: A11yModel;
    private proxyProvider!: ProxyProvider;
    private autoDescEl!: HTMLElement;


    /**
     * Init the class. Called on chart init, and on chart updates.
     *
     * Chart option updates, or data changes that cause model changes, will
     * cause re-init of the class. Regular data changes will not (so we can
     * support live data without messing up focus etc).
     */
    constructor(public chart: Chart) {
        // Hide chart
        attr(chart.container, {
            role: 'presentation',
            'aria-hidden': true
        });
        chart.renderer.box.removeAttribute('role');
        chart.renderer.box.removeAttribute('aria-label');

        // Create basic description container & content
        const i = this.chartDescriptionInfo = getChartDescriptionInfo(chart);
        this.proxyProvider = new ProxyProvider(chart);

        // Add description container & contents
        this.proxyProvider.addGroup('description');
        this.proxyProvider.addTouchableProxy(
            'description',
            chart.title?.element, i.headingLevel, i.chartTitle, 'hc-title'
        );
        if (i.chartSubtitle) {
            this.proxyProvider.addTouchableProxy(
                'description',
                chart.subtitle?.element, 'p', i.chartSubtitle, 'hc-subtitle'
            );
        }
        if (i.description) {
            this.proxyProvider.addSROnly(
                'description', 'p', i.description, 'hc-author-description'
            );
        }

        // Fix damn link clicks in proxies etc.

        // The auto description contents will need to change on render, the
        // rest of desc can stay the same. Handle whole thing here, and just
        // update the desc content on every render.

        // Handle container order

        // Menu can probably be handled here, should not change unless options
        // are updated?

        // Role="app" container should be created here, but contents (data)
        // should be handled in update().

        // Legend, zoom etc should be put here, but update on the specific
        // legend/zoom render/update events since the elements may change on
        // scroll/drilldown etc.

        // Credits here. How do we handle the link in regards to AST filtering?

        // Handle announcer here too
    }


    /**
     * Update accessibility functionality for the chart.
     * Called on every chart render.
     */
    public update(): void {
        const chart = this.chart,
            curModel = this.getChartModel(chart);

        // If we change model, we should just re-init the module
        if (this.model && curModel !== this.model) {
            this.destroy();
            this.chart.a11y = new A11y(chart);
            this.chart.a11y.update();
            return;
        }
        this.model = curModel;

        // Compute chart information for this update
        this.chartDetailedInfo = getChartDetailedInfo(chart, curModel);
        const eventContext = {
            chartDescriptionInfo: this.chartDescriptionInfo,
            chartDetailedInfo: this.chartDetailedInfo
        };

        fireEvent(chart, 'beforeA11yUpdate', eventContext);


        // Role="application" yes/no
        // Keyboard nav
        // Clip path proxies etc? Make the proxy shape = the data shape.

        // Data container contents should be updated here, but don't delete the
        // role="app", keep focus.
        // What if drilldown -> less data -> different model?
        // Keep existing model?


        // Todo: Also update positions for series.animateFinished.

        this.proxyProvider.updatePositions();
        fireEvent(chart, 'afterA11yUpdate', eventContext);
    }


    /**
     * Helper function to determine the correct interaction model for the chart.
     */
    private getChartModel(chart: Chart): A11yModel {
        if (chart.options.a11y?.model) {
            return chart.options.a11y.model;
        }
        if (
            chart.pointCount < 4 &&
            (
                chart.options.tooltip?.enabled === false ||
                chart.series.every((s): boolean =>
                    s.options.enableMouseTracking === false
                )
            )
        ) {
            return 'summary';
        }
        if (chart.pointCount < 16) {
            return 'list';
        }
        return 'application';
    }


    /**
     * Destructor - remove traces of the a11y module
     * (e.g. HTML elements, event handlers).
     */
    public destroy(): void {
        const chart = this.chart;
        this.proxyProvider?.destroy();
        delete chart.a11y;

        // Unhide chart SVG
        chart.renderer?.boxWrapper.attr({
            role: 'img',
            'aria-label': this.chartDescriptionInfo
                .chartTitle.replace(/</g, '&lt;')
        });
        chart.container.removeAttribute('role');
        chart.container.removeAttribute('aria-hidden');
    }
}


namespace A11y {

    /**
     * Composition for A11y functionality
     * @internal
     */
    export function compose(ChartClass: typeof Chart): void {
        if (pushUnique(composed, 'A11y.A11y')) {
            merge(
                true,
                defaultOptions,
                defaultOptionsA11y
            );

            addEvent(ChartClass, 'init', function (): void {
                this.needsA11yStatusCheck = true;
            });

            addEvent(ChartClass, 'render', function (): void {
                if (this.needsA11yStatusCheck) {
                    this.needsA11yStatusCheck = false;
                    // Handle legacy module
                    if (this.a11yDirty) {
                        error(
                            'The "accessibility.js" module has been replaced ' +
                            'by the "a11y.js" module. These should not be ' +
                            'used together.', false, this
                        );
                        return;
                    }
                    if (this.options.a11y?.enabled === false) {
                        this.a11y?.destroy();
                    } else {
                        this.a11y = this.a11y || new A11y(this);
                    }
                }
                this.a11y?.update();
            });

            // Re-init module on all chart updates
            addEvent(ChartClass, 'update', function (
                e: { options: Options }
            ): void {
                const newOptions = e.options.a11y;
                if (newOptions) {
                    merge(true, this.options.a11y, newOptions);
                }
                this.a11y?.destroy();
                this.needsA11yStatusCheck = true;
            });

            addEvent(ChartClass, 'destroy', function (): void {
                this.a11y?.destroy();
            });
        }
    }
}

export default A11y;

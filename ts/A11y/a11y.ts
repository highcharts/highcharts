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
import { getChartInfo, type ChartInfo, type A11yModel } from './ChartInfoProvider';
import D from '../Core/Defaults.js';
const { defaultOptions } = D;
import defaultOptionsA11y from './A11yDefaults.js';
import H from '../Core/Globals.js';
const { composed } = H;
import U from '../Core/Utilities.js';
const {
    addEvent,
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

    constructor(public chart: Chart) {

        // Setup containers & structure (one time setup)
        // Proxy, announcer, heading, subtitle, desc, hint, ...
    }

    private chartInfo!: ChartInfo;
    private model?: A11yModel;

    /**
     * Update accessibility functionality for the chart.
     * Called on every chart render.
     */
    public update(): void {
        const chart = this.chart,
            curModel = ((): A11yModel => {
                if (chart.options.a11y?.model) {
                    return chart.options.a11y.model;
                }
                if (chart.pointCount < 4) {
                    return 'summary';
                }
                if (chart.pointCount < 16) {
                    return 'list';
                }
                return 'application';
            })();

        // If we change model, we should just re-init the module
        if (this.model && curModel !== this.model) {
            this.destroy();
            this.chart.a11y = new A11y(chart);
            this.chart.a11y.update();
            return;
        }
        this.model = curModel;

        // Compute chart information for this update
        this.chartInfo = getChartInfo(chart, curModel);

        fireEvent(chart, 'beforeA11yUpdate', { chartInfo: this.chartInfo });

        // Overlay container contents
        // Role="application" yes/no
        // Keyboard nav

        // Todo
        console.log('A11y module update placeholder', this.chartInfo.title, Math.random().toFixed(5)); // eslint-disable-line no-console

        fireEvent(chart, 'afterA11yUpdate', {
            a11y: this,
            chartInfo: this.chartInfo
        });
    }

    /**
     * Remove traces of the a11y module.
     */
    public destroy(): void {
        delete this.chart.a11y;
        this.chart.renderer?.boxWrapper.attr({
            role: 'img',
            'aria-label': this.chartInfo.title.replace(/</g, '&lt;')
        });
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
                            'The accessibility.js module has been replaced ' +
                            'by the a11y.js module. These should not be used ' +
                            'together.', false, this
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

            addEvent(ChartClass, 'update', function (
                e: { options: Options }
            ): void {
                const newOptions = e.options.a11y;
                if (newOptions) {
                    merge(true, this.options.a11y, newOptions);
                    this.a11y?.destroy();
                    this.needsA11yStatusCheck = true;
                }
            });

            addEvent(ChartClass, 'destroy', function (): void {
                this.a11y?.destroy();
            });
        }
    }
}

export default A11y;

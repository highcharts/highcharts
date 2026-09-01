/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type ScatterPoint from './ScatterPoint';
import type ScatterSeriesOptions from './ScatterSeriesOptions';
import type { SeriesTypeOptions } from '../../Core/Series/SeriesType';
import type { DeepPartial } from '../../Shared/Types';

import D from '../../Core/Defaults.js';
const { defaultOptions } = D;
import ScatterSeriesDefaults, {
    prefixesSeriesName,
    scatterHeaderFormat,
    supportsSharedTooltip
} from './ScatterSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: ColumnSeries,
    line: LineSeries
} = SeriesRegistry.seriesTypes;
import { addEvent, extend, merge } from '../../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module '../../Core/Series/SeriesBase' {
    interface SeriesBase {
        /**
         * Allow scatter points on the edge to be interacted
         * with outside the plot.
         */
        allowOutsidePlotInteraction?: boolean;
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * Scatter series type.
 *
 * @private
 */
class ScatterSeries extends LineSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions = merge(
        LineSeries.defaultOptions,
        ScatterSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<ScatterPoint>;

    public options!: ScatterSeriesOptions;

    public points!: Array<ScatterPoint>;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */
    /**
     * Honor explicit shared-tooltip opt-in for cartesian scatter-like
     * series while keeping the default behavior unchanged.
     * @private
     */
    public setOptions(
        itemOptions: DeepPartial<SeriesTypeOptions>
    ): this['options'] {
        // Set before calling super, so that the shared-tooltip default for
        // `stickyTracking` is resolved with the right value
        this.noSharedTooltip = !supportsSharedTooltip(this);

        const options = super.setOptions(itemOptions),
            tooltipOptions = this.tooltipOptions;

        this.noSharedTooltip = !(
            supportsSharedTooltip(this) &&
            tooltipOptions.shared
        );

        // Give the series name up from the header only when the point lines
        // are going to carry it instead, and only when the header is still
        // this series type's own (#22967).
        if (
            prefixesSeriesName(this) &&
            tooltipOptions.headerFormat === scatterHeaderFormat
        ) {
            tooltipOptions.headerFormat =
                defaultOptions.tooltip?.headerFormat || '';
        }

        return options;
    }

    /**
     * Optionally add the jitter effect.
     * @private
     */
    public applyJitter(): void {
        const series = this,
            jitter = this.options.jitter,
            len = this.points.length;

        /**
         * Return a repeatable, pseudo-random number based on an integer
         * seed.
         * @private
         */
        function unrandom(seed: number): number {
            const rand = Math.sin(seed) * 10000;
            return rand - Math.floor(rand);
        }

        if (jitter) {
            this.points.forEach((point, i): void => {
                (['x', 'y'] as const).forEach((dim, j): void => {
                    if (jitter[dim] && !point.isNull) {
                        const plotProp: 'plotX'|'plotY' =
                                `plot${dim.toUpperCase() as 'X'|'Y'}`,
                            axis = series[`${dim}Axis`];

                        if (axis && !axis.logarithmic) {

                            // Identify the outer bounds of the jitter range
                            // (#25054)
                            const translatedJitter = jitter[dim] * axis.transA *
                                    (axis.reversed ? -1 : 1),
                                min = (point[plotProp] || 0) - translatedJitter,
                                max = (point[plotProp] || 0) + translatedJitter;

                            // Find a random position within this range
                            point[plotProp] = min +
                                (max - min) * unrandom(i + j * len);

                            // Update clientX for the tooltip k-d-tree
                            if (dim === 'x') {
                                point.clientX = point.plotX;
                            }
                        }
                    }
                });
            });
        }
    }

    /**
     * @private
     */
    public drawGraph(): void {
        if (this.options.lineWidth) {
            super.drawGraph();
        } else if (this.graph) {
            this.graph = this.graph.destroy();
        }
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface ScatterSeries {
    pointClass: typeof ScatterPoint;
    sharedTooltipPointFormat: string;
    sharedTooltipType: string;
}
extend(ScatterSeries.prototype, {
    allowOutsidePlotInteraction: true,
    drawTracker: ColumnSeries.prototype.drawTracker,
    sorted: false,
    requireSorting: false,
    noSharedTooltip: true,
    sharedTooltipPointFormat: ScatterSeriesDefaults.tooltip?.pointFormat,
    sharedTooltipType: 'scatter',
    trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup']
});

/* *
 *
 *  Events
 *
 * */

/* eslint-disable no-invalid-this */

addEvent(ScatterSeries, 'afterTranslate', function (): void {
    this.applyJitter();
});

/* eslint-enable no-invalid-this */

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        scatter: typeof ScatterSeries;
    }
}
SeriesRegistry.registerSeriesType('scatter', ScatterSeries);


/* *
 *
 *  Default Export
 *
 * */

export default ScatterSeries;

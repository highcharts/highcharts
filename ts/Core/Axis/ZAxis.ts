/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AxisLike from './AxisLike';
import type AxisOptions from './AxisOptions';
import type Chart from '../Chart/Chart.js';

import Axis from './Axis.js';
import U from '../Utilities.js';
const {
    addEvent,
    merge,
    pick,
    splat
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module './AxisType' {
    interface AxisTypeRegistry {
        ZAxis: ZAxis;
    }
}

declare module '../Chart/ChartLike'{
    interface ChartLike {
        zAxis?: Array<ZAxis>;
        addZAxis(options: AxisOptions): Axis;
    }
}

declare module '../Options' {
    interface Options {
        zAxis?: (
            DeepPartial<AxisOptions>|
            Array<DeepPartial<AxisOptions>>
        );
    }
}

/* eslint-disable valid-jsdoc */

/**
 * 3D chart with support of z coordinates.
 * @private
 * @class
 */
class ZChart {

    /* *
     *
     *  Static Functions
     *
     * */

    public static compose(ChartClass: typeof Chart): void {

        addEvent(ChartClass, 'afterGetAxes', ZChart.onAfterGetAxes);

        const chartProto = ChartClass.prototype as ZChart;

        chartProto.addZAxis = ZChart.wrapAddZAxis;
        chartProto.collectionsWithInit.zAxis = [chartProto.addZAxis];
        chartProto.collectionsWithUpdate.push('zAxis');

    }
    /**
     * Get the Z axis in addition to the default X and Y.
     * @private
     */
    public static onAfterGetAxes(this: ZChart): void {
        const chart = this;
        const options = this.options;
        const zAxisOptions = options.zAxis = splat(options.zAxis || {});

        if (!chart.is3d()) {
            return;
        }
        chart.zAxis = [];
        zAxisOptions.forEach(function (
            axisOptions: AxisOptions,
            i: number
        ): void {
            // Z-Axis is shown horizontally, so it's kind of a X-Axis
            axisOptions.isX = true;
            chart
                .addZAxis(axisOptions)
                .setScale();
        });
    }

    /**
     * @private
     */
    public static wrapAddZAxis(
        this: Chart,
        options: AxisOptions
    ): Axis {
        return new ZAxis(this, options);
    }

}

/**
 * @private
 */
interface ZChart extends Chart {
    // nothing to add to instances
}

/**
 * 3D axis for z coordinates.
 */
class ZAxis extends Axis implements AxisLike {

    /* *
     *
     *  Static Properties
     *
     * */

    public static ZChartComposition = ZChart;

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(chart: Chart, userOptions: AxisOptions) {
        super(chart, userOptions);
    }

    /* *
     *
     *  Properties
     *
     * */

    public ignoreMaxPadding?: boolean;
    public ignoreMinPadding?: boolean;
    public isZAxis: true = true;

    /* *
     *
     *  Functions
     *
     * */

    public getSeriesExtremes(): void {
        const axis = this;
        const chart = axis.chart;

        axis.hasVisibleSeries = false;

        // Reset properties in case we're redrawing (#3353)
        axis.dataMin = axis.dataMax = axis.ignoreMinPadding = (
            axis.ignoreMaxPadding = void 0
        );

        if (axis.stacking) {
            axis.stacking.buildStacks();
        }

        // loop through this axis' series
        axis.series.forEach(function (series): void {

            if (
                series.visible ||
                !chart.options.chart.ignoreHiddenSeries
            ) {

                let seriesOptions = series.options,
                    zData: Array<(number|null|undefined)>,
                    threshold = seriesOptions.threshold;

                axis.hasVisibleSeries = true;

                // Validate threshold in logarithmic axes
                if (axis.positiveValuesOnly && (threshold as any) <= 0) {
                    threshold = void 0;
                }

                zData = series.zData as any;
                if (zData.length) {
                    axis.dataMin = Math.min(
                        pick(axis.dataMin, zData[0] as any),
                        Math.min.apply(null, zData as any)
                    );
                    axis.dataMax = Math.max(
                        pick(axis.dataMax, zData[0] as any),
                        Math.max.apply(null, zData as any)
                    );
                }
            }
        });
    }

    /**
     * @private
     */
    public setAxisSize(): void {
        const axis = this;
        const chart = axis.chart;

        super.setAxisSize();

        axis.width = axis.len = (
            chart.options.chart.options3d &&
            chart.options.chart.options3d.depth
        ) || 0;
        axis.right = chart.chartWidth - axis.width - axis.left;
    }

    /**
     * @private
     */
    public setOptions(userOptions: DeepPartial<AxisOptions>): void {

        userOptions = merge<DeepPartial<AxisOptions>>({
            offset: 0,
            lineWidth: 0
        }, userOptions);

        // #14793, this used to be set on the prototype
        this.isZAxis = true;

        super.setOptions(userOptions);

        this.coll = 'zAxis';
    }

}

export default ZAxis;

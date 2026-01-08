/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AxisBase from './AxisBase';
import type { XAxisOptions } from './AxisOptions';
import type Chart from '../Chart/Chart.js';
import type { DeepPartial } from '../../Shared/Types';

import Axis from './Axis.js';
import D from '../Defaults.js';
const { defaultOptions } = D;
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

declare module '../Chart/ChartBase'{
    interface ChartBase {
        zAxis?: Array<ZAxis>;
        addZAxis(options: DeepPartial<XAxisOptions>): Axis;
    }
}

declare module '../Options' {
    interface Options {
        /**
         * The Z axis or depth axis for 3D plots.
         *
         * See the [Axis class](/class-reference/Highcharts.Axis) for
         * programmatic access to the axis.
         *
         * @sample {highcharts} highcharts/3d/scatter-zaxis-categories/
         *         Z-Axis with Categories
         * @sample {highcharts} highcharts/3d/scatter-zaxis-grid/
         *         Z-Axis with styling
         *
         * @since     5.0.0
         * @product   highcharts
         * @excluding breaks, crosshair, height, left, lineColor, lineWidth,
         *            nameToX, showEmpty, top, width
         */
        zAxis?: (DeepPartial<XAxisOptions>|Array<DeepPartial<XAxisOptions>>);
    }
}

/* *
 *
 *  Functions
 *
 * */

/** @internal */
function chartAddZAxis(
    this: Chart,
    options: DeepPartial<XAxisOptions>
): Axis {
    return new ZAxis(this, options);
}

/**
 * Get the Z axis in addition to the default X and Y.
 * @internal
 */
function onChartAfterCreateAxes(this: Chart): void {
    const zAxisOptions = this.options.zAxis = splat(this.options.zAxis || {});

    if (!this.is3d()) {
        return;
    }

    this.zAxis = [];

    zAxisOptions.forEach((axisOptions): void => {
        this.addZAxis(axisOptions).setScale();
    });
}

/* *
 *
 *  Class
 *
 * */

/**
 * 3D axis for z coordinates.
 */
class ZAxis extends Axis implements AxisBase {

    /* *
     *
     *  Static Properties
     *
     * */

    /** @internal */
    public static compose(
        ChartClass: typeof Chart
    ): void {
        const chartProto = ChartClass.prototype;

        if (!chartProto.addZAxis) {

            defaultOptions.zAxis = merge(defaultOptions.xAxis, {
                offset: 0,
                lineWidth: 0
            });

            chartProto.addZAxis = chartAddZAxis;
            chartProto.collectionsWithInit.zAxis = [chartProto.addZAxis];
            chartProto.collectionsWithUpdate.push('zAxis');

            addEvent(ChartClass, 'afterCreateAxes', onChartAfterCreateAxes);
        }

    }

    /* *
     *
     *  Constructor
     *
     * */

    public init(
        chart: Chart,
        userOptions: XAxisOptions
    ):void {
        // #14793, this used to be set on the prototype
        this.isZAxis = true;

        super.init(chart, userOptions, 'zAxis');

    }

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public ignoreMaxPadding?: boolean;

    /** @internal */
    public ignoreMinPadding?: boolean;

    public isZAxis: true = true;

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    public getSeriesExtremes(): void {
        this.hasVisibleSeries = false;

        // Reset properties in case we're redrawing (#3353)
        this.dataMin = this.dataMax = this.ignoreMinPadding = (
            this.ignoreMaxPadding = void 0
        );

        if (this.stacking) {
            this.stacking.buildStacks();
        }

        // Loop through this axis' series
        this.series.forEach((series): void => {

            if (series.reserveSpace()) {

                let threshold = series.options.threshold;

                this.hasVisibleSeries = true;

                // Validate threshold in logarithmic axes
                if (this.positiveValuesOnly && (threshold as any) <= 0) {
                    threshold = void 0;
                }

                const zData = series.getColumn('z');

                if (zData.length) {
                    this.dataMin = Math.min(
                        pick(this.dataMin, zData[0] as any),
                        Math.min.apply(null, zData as any)
                    );
                    this.dataMax = Math.max(
                        pick(this.dataMax, zData[0] as any),
                        Math.max.apply(null, zData as any)
                    );
                }
            }
        });
    }

    /** @internal */
    public setAxisSize(): void {
        const chart = this.chart;

        super.setAxisSize();

        this.width = this.len = chart.options.chart.options3d?.depth || 0;
        this.right = chart.chartWidth - this.width - this.left;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ZAxis;

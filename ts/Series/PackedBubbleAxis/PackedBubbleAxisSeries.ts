/* *
 *
 *  (c) 2010-2021 Grzegorz Blachlinski, Sebastian Bochan
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

import type Axis from '../../Core/Axis/Axis';
import type { BubblePointMarkerOptions } from '../Bubble/BubblePointOptions';
import PackedBubbleSeries from '../PackedBubble/PackedBubbleSeries.js';
import type PackedBubblePointOptions from '../PackedBubble/PackedBubblePointOptions';
import type PackedBubbleSeriesOptions from '../PackedBubble/PackedBubbleSeriesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';

import Color from '../../Core/Color/Color.js';
const { parse: color } = Color;
import H from '../../Core/Globals.js';
const { noop } = H;
import PackedBubbleSeriesDefaults from '../PackedBubble/PackedBubbleSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: {
        prototype: seriesProto
    },
    seriesTypes: {
        bubble: BubbleSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    defined,
    extend,
    fireEvent,
    isNumber,
    merge,
    addEvent,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.packedbubble
 *
 * @extends Highcharts.Series
 */
class PackedBubbleAxisSeries extends PackedBubbleSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: PackedBubbleSeriesOptions = merge(
        BubbleSeries.defaultOptions,
        PackedBubbleSeriesDefaults
    );

    /* *
     *
     *  Static Functions
     *
     * */

    /* *
     *
     *  Properties
     *
     * */

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */
    public init(): PackedBubbleSeries {
        const series = this;
        seriesProto.init.apply(series, arguments);
        series.xAxis.min = Math.min(
            series.xAxis && series.xAxis.min || Infinity,
            series.x || series.index
        );
        series.xAxis.max = Math.max(
            pick(series.xAxis && series.xAxis.max, -Infinity),
            pick(series.x, series.index)
        );
        series.data.forEach(function (p): void {
            p.x = series.x || series.index;
        });
        const xArr: number[] = [];
        series.xData.forEach(function (p): void {
            xArr.push(pick(series.x, series.index));
        });
        series.xData = xArr;
        /* eslint-disable no-invalid-this */

        // When one series is modified, the others need to be recomputed
        series.eventsToUnbind.push(addEvent(this, 'updatedData', function (
            this: PackedBubbleSeries
        ): void {
            this.chart.series.forEach((s): void => {
                if (s.type === this.type) {
                    s.isDirty = true;
                }
            }, this);
        }));
        /* eslint-enable no-invalid-this */
        return this;
    }
    /**
     * Extend the base translate method to handle bubble size,
     * and correct positioning them.
     * @private
     */
    public translate(): void {
        const chart = this.chart,
            data = this.data,
            index = this.index,
            useSimulation = this.options.useSimulation;

        let point,
            radius: number|undefined,
            positions;

        this.processedXData = this.xData;
        this.generatePoints();

        // merged data is an array with all of the data from all series
        if (!defined(chart.allDataPoints)) {
            chart.allDataPoints = this.accumulateAllPoints();
            // calculate radius for all added data
            this.getPointRadius();
        }

        // after getting initial radius, calculate bubble positions

        if (useSimulation) {
            positions = chart.allDataPoints;
        } else {
            positions = this.placeBubbles(chart.allDataPoints);
            this.options.draggable = false;
        }

        // Set the shape and arguments to be picked up in drawPoints
        for (const position of positions) {

            if (position[3] === index) {

                // update the series points with the val from positions
                // array
                point = data[position[4] as any];
                radius = pick(position[2], void 0);

                if (!useSimulation) {
                    point.plotX = (
                        (position[0] as any) - chart.plotLeft +
                        chart.diffX
                    );
                    point.plotY = (
                        (position[1] as any) - chart.plotTop +
                        chart.diffY
                    );
                }
                if (isNumber(radius)) {
                    point.marker = extend(point.marker, {
                        radius,
                        width: 2 * radius,
                        height: 2 * radius
                    });
                    point.radius = radius;
                    point.x = point.series.index;
                    point.y = 0;
                }
            }
        }

        if (useSimulation) {
            this.options.centerX = this.xAxis.toPixels(
                this.options.x || this.index,
                true
            );
            this.options.centerY = this.options.y ? this.yAxis.toPixels(
                this.options.y,
                true
            ) : this.options.centerY;
            this.deferLayout();
        }

        fireEvent(this, 'afterTranslate');
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Prototype
 *
 * */

interface PackedBubbleAxisSeries extends PackedBubbleSeries {
    isCartesian: boolean;
    x: number;
}
extend(PackedBubbleAxisSeries.prototype, {
    isCartesian: true,
    axisTypes: ['xAxis', 'yAxis']
});

/* *
 *
 *  Class Namespace
 *
 * */

namespace PackedBubbleAxisSeries {

    export type Data = [
        (number|null),
        (number|null),
        (number|null),
        number,
        number,
        PackedBubblePointOptions
    ];

}

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        packedbubbleaxis: typeof PackedBubbleAxisSeries;
    }
}
SeriesRegistry.registerSeriesType('packedbubbleaxis', PackedBubbleAxisSeries);

/* *
 *
 *  Default Export
 *
 * */

export default PackedBubbleAxisSeries;

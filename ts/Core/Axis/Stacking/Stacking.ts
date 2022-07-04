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

import type {
    AlignObject,
    AlignValue,
    VerticalAlignValue
} from '../../Renderer/AlignObject';
import type AnimationOptions from '../../Animation/AnimationOptions';
import type { YAxisOptions } from '../AxisOptions';
import type BBoxObject from '../../Renderer/BBoxObject';
import type ColorType from '../../Color/ColorType';
import type CSSObject from '../../Renderer/CSSObject';
import type { DataLabelOverflowValue } from '../../Series/DataLabelOptions';
import type FormatUtilities from '../../FormatUtilities';
import type { OptionsOverflowValue } from '../../Options';
import type SVGElement from '../../Renderer/SVG/SVGElement';
import type { StackOverlowValue } from './StackItem';

import Axis from '../Axis.js';
import Chart from '../../Chart/Chart.js';
import H from '../../Globals.js';
import Series from '../../Series/Series.js';
import StackingAxis from './StackingAxis.js';
import StackItem from './StackItem.js';
import U from '../../Utilities.js';
const {
    correctFloat,
    defined,
    isArray,
    objectEach,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Chart/ChartLike'{
    interface ChartLike {
        getStacks(): void;
    }
}

declare module '../../Series/PointLike' {
    interface PointLike {
        leftCliff?: number;
        rightCliff?: number;
    }
}

declare module '../../Series/SeriesLike' {
    interface SeriesLike {
        isRadialBar?: boolean;
        negStacks?: any; // @todo
        singleStacks?: any; // @todo
        stack?: StackOverlowValue;
        stackedYData?: Array<number>;
        stackKey?: string;
        getStackIndicator(
            stackIndicator: (StackItemIndicatorObject|undefined),
            x: number,
            index: number,
            key?: string
        ): StackItemIndicatorObject;
        modifyStacks(): void;
        percentStacker(
            pointExtremes: Array<number>,
            stack: StackItem,
            i: number
        ): void;
        setGroupedPoints(): void;
        setStackedPoints(
            stackingParam?: string
        ): void;
    }
}

declare module '../../Series/SeriesOptions' {
    interface SeriesOptions {
        stack?: (number|string);
        stacking?: StackOverlowValue;
    }
}


interface StackItemIndicatorObject {
    index: number;
    key?: string;
    stackKey?: string;
    x: number;
}


/* eslint-disable no-invalid-this, valid-jsdoc */


/**
 * Generate stacks for each series and calculate stacks total values
 *
 * @private
 * @function Highcharts.Chart#getStacks
 */
Chart.prototype.getStacks = function (this: Chart): void {
    const chart = this,
        inverted = chart.inverted;

    // reset stacks for each yAxis
    chart.yAxis.forEach(function (axis): void {
        if (axis.stacking && axis.stacking.stacks && axis.hasVisibleSeries) {
            axis.stacking.oldStacks = axis.stacking.stacks;
        }
    });

    chart.series.forEach(function (series): void {
        const xAxisOptions = series.xAxis && series.xAxis.options || {};

        if (
            series.options.stacking &&
            (
                series.visible === true ||
                chart.options.chart.ignoreHiddenSeries === false
            )
        ) {
            series.stackKey = [
                series.type,
                pick(series.options.stack, ''),
                inverted ? xAxisOptions.top : xAxisOptions.left,
                inverted ? xAxisOptions.height : xAxisOptions.width
            ].join(',');
        }
    });
};


// Stacking methods defined on the Axis prototype

StackingAxis.compose(Axis);


// Stacking methods defined for Series prototype

/**
 * Set grouped points in a stack-like object. When `centerInCategory` is true,
 * and `stacking` is not enabled, we need a pseudo (horizontal) stack in order
 * to handle grouping of points within the same category.
 *
 * @private
 * @function Highcharts.Series#setStackedPoints
 * @return {void}
 */
Series.prototype.setGroupedPoints = function (): void {

    const stacking = this.yAxis.stacking;

    if (
        this.options.centerInCategory &&
        (this.is('column') || this.is('columnrange')) &&
        // With stacking enabled, we already have stacks that we can compute
        // from
        !this.options.stacking &&
        // With only one series, we don't need to consider centerInCategory
        this.chart.series.length > 1
    ) {
        Series.prototype.setStackedPoints.call(this, 'group');

    // After updating, if we now have proper stacks, we must delete the group
    // pseudo stacks (#14986)
    } else if (stacking) {
        objectEach(stacking.stacks, (type, key): void => {
            if (key.slice(-5) === 'group') {
                objectEach(type, (stack): void => stack.destroy());
                delete stacking.stacks[key];
            }
        });
    }
};

/**
 * Adds series' points value to corresponding stack
 *
 * @private
 * @function Highcharts.Series#setStackedPoints
 */
Series.prototype.setStackedPoints = function (stackingParam?: string): void {

    const stacking = stackingParam || this.options.stacking;

    if (!stacking || (
        this.visible !== true &&
        this.chart.options.chart.ignoreHiddenSeries !== false
    )) {
        return;
    }

    let series = this,
        xData = series.processedXData,
        yData = series.processedYData,
        stackedYData = [],
        yDataLength = (yData as any).length,
        seriesOptions = series.options,
        threshold = seriesOptions.threshold,
        stackThreshold = pick(seriesOptions.startFromThreshold && threshold, 0),
        stackOption = seriesOptions.stack,
        stackKey = stackingParam ? `${series.type},${stacking}` : series.stackKey,
        negKey = '-' + stackKey,
        negStacks = series.negStacks,
        yAxis = series.yAxis as StackingAxis.Composition,
        stacks = yAxis.stacking.stacks,
        oldStacks = yAxis.stacking.oldStacks,
        stackIndicator: (StackItemIndicatorObject|undefined),
        isNegative,
        stack,
        other,
        key,
        pointKey,
        i,
        x,
        y;


    yAxis.stacking.stacksTouched += 1;

    // loop over the non-null y values and read them into a local array
    for (i = 0; i < yDataLength; i++) {
        x = (xData as any)[i];
        y = (yData as any)[i];
        stackIndicator = series.getStackIndicator(
            stackIndicator,
            x,
            series.index as any
        );
        pointKey = stackIndicator.key;
        // Read stacked values into a stack based on the x value,
        // the sign of y and the stack key. Stacking is also handled for null
        // values (#739)
        isNegative = negStacks && y < (stackThreshold ? 0 : (threshold as any));
        key = isNegative ? negKey : stackKey;

        // Create empty object for this stack if it doesn't exist yet
        if (!stacks[key as any]) {
            stacks[key as any] = {};
        }

        // Initialize StackItem for this x
        if (!stacks[key as any][x]) {
            if ((oldStacks as any)[key as any] &&
                (oldStacks as any)[key as any][x]
            ) {
                stacks[key as any][x] = (oldStacks as any)[key as any][x];
                stacks[key as any][x].total = null;
            } else {
                stacks[key as any][x] = new StackItem(
                    yAxis,
                    (
                        yAxis.options as YAxisOptions
                    ).stackLabels as any,
                    isNegative,
                    x,
                    stackOption as any
                );
            }
        }

        // If the StackItem doesn't exist, create it first
        stack = stacks[key as any][x];
        if (y !== null) {
            stack.points[pointKey as any] = stack.points[series.index as any] =
                [pick(stack.cumulative, stackThreshold as any)];

            // Record the base of the stack
            if (!defined(stack.cumulative)) {
                stack.base = pointKey;
            }
            stack.touched = yAxis.stacking.stacksTouched;

            // In area charts, if there are multiple points on the same X value,
            // let the area fill the full span of those points
            if (stackIndicator.index > 0 && series.singleStacks === false) {
                stack.points[pointKey as any][0] =
                    stack.points[series.index + ',' + x + ',0'][0];
            }

        // When updating to null, reset the point stack (#7493)
        } else {
            stack.points[pointKey as any] = stack.points[series.index as any] =
                null as any;
        }

        // Add value to the stack total
        if (stacking === 'percent') {

            // Percent stacked column, totals are the same for the positive and
            // negative stacks
            other = isNegative ? stackKey : negKey;
            if (negStacks && stacks[other as any] && stacks[other as any][x]) {
                other = stacks[other as any][x];
                stack.total = other.total =
                    Math.max(other.total as any, stack.total as any) +
                    Math.abs(y) ||
                    0;

            // Percent stacked areas
            } else {
                stack.total =
                    correctFloat((stack.total as any) + (Math.abs(y) || 0));
            }

        } else if (stacking === 'group') {
            if (isArray(y)) {
                y = y[0];
            }

            // In this stack, the total is the number of valid points
            if (y !== null) {
                stack.total = (stack.total || 0) + 1;
            }

        } else {
            stack.total = correctFloat(stack.total + (y || 0));
        }

        if (stacking === 'group') {
            // This point's index within the stack, pushed to stack.points[1]
            stack.cumulative = (stack.total || 1) - 1;
        } else {
            stack.cumulative =
                pick(stack.cumulative, stackThreshold as any) + (y || 0);
        }

        if (y !== null) {
            (stack.points[pointKey as any] as any).push(stack.cumulative);
            stackedYData[i] = stack.cumulative;
            stack.hasValidPoints = true;
        }
    }

    if (stacking === 'percent') {
        yAxis.stacking.usePercentage = true;
    }

    if (stacking !== 'group') {
        this.stackedYData = stackedYData as any; // To be used in getExtremes
    }

    // Reset old stacks
    yAxis.stacking.oldStacks = {};
};

/**
 * Iterate over all stacks and compute the absolute values to percent
 *
 * @private
 * @function Highcharts.Series#modifyStacks
 */
Series.prototype.modifyStacks = function (): void {
    let series = this,
        yAxis = series.yAxis as StackingAxis.Composition,
        stackKey = series.stackKey,
        stacks = yAxis.stacking.stacks,
        processedXData = series.processedXData,
        stackIndicator: StackItemIndicatorObject,
        stacking = series.options.stacking;

    if ((series as any)[stacking + 'Stacker']) { // Modifier function exists
        [stackKey, '-' + stackKey].forEach(function (
            key: (string|undefined)
        ): void {
            let i = (processedXData as any).length,
                x,
                stack,
                pointExtremes;

            while (i--) {
                x = (processedXData as any)[i];
                stackIndicator = series.getStackIndicator(
                    stackIndicator,
                    x,
                    series.index as any,
                    key
                );
                stack = stacks[key as any] && stacks[key as any][x];
                pointExtremes =
                    stack && stack.points[stackIndicator.key as any];
                if (pointExtremes) {
                    (series as any)[stacking + 'Stacker'](
                        pointExtremes, stack, i
                    );
                }
            }
        });
    }
};

/**
 * Modifier function for percent stacks. Blows up the stack to 100%.
 *
 * @private
 * @function Highcharts.Series#percentStacker
 */
Series.prototype.percentStacker = function (
    pointExtremes: Array<number>,
    stack: StackItem,
    i: number
): void {
    const totalFactor = stack.total ? 100 / stack.total : 0;

    // Y bottom value
    pointExtremes[0] = correctFloat(pointExtremes[0] * totalFactor);
    // Y value
    pointExtremes[1] = correctFloat(pointExtremes[1] * totalFactor);
    (this.stackedYData as any)[i] = pointExtremes[1];
};

/**
 * Get stack indicator, according to it's x-value, to determine points with the
 * same x-value
 *
 * @private
 * @function Highcharts.Series#getStackIndicator
 */
Series.prototype.getStackIndicator = function (
    stackIndicator: (StackItemIndicatorObject|undefined),
    x: number,
    index: number,
    key?: string
): StackItemIndicatorObject {
    // Update stack indicator, when:
    // first point in a stack || x changed || stack type (negative vs positive)
    // changed:
    if (!defined(stackIndicator) ||
        stackIndicator.x !== x ||
        (key && stackIndicator.stackKey !== key)
    ) {
        stackIndicator = {
            x: x,
            index: 0,
            key: key,
            stackKey: key
        };
    } else {
        (stackIndicator).index++;
    }

    stackIndicator.key =
        [index, x, stackIndicator.index].join(',');

    return stackIndicator;
};

(H as any).StackItem = StackItem; // @todo -> master

/* *
 *
 *  Default Export
 *
 * */

export default StackItem;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Stack of data points
 *
 * @product highcharts
 *
 * @interface Highcharts.StackItemObject
 *//**
 * Alignment settings
 * @name Highcharts.StackItemObject#alignOptions
 * @type {Highcharts.AlignObject}
 *//**
 * Related axis
 * @name Highcharts.StackItemObject#axis
 * @type {Highcharts.Axis}
 *//**
 * Cumulative value of the stacked data points
 * @name Highcharts.StackItemObject#cumulative
 * @type {number}
 *//**
 * True if on the negative side
 * @name Highcharts.StackItemObject#isNegative
 * @type {boolean}
 *//**
 * Related SVG element
 * @name Highcharts.StackItemObject#label
 * @type {Highcharts.SVGElement}
 *//**
 * Related stack options
 * @name Highcharts.StackItemObject#options
 * @type {Highcharts.YAxisStackLabelsOptions}
 *//**
 * Total value of the stacked data points
 * @name Highcharts.StackItemObject#total
 * @type {number}
 *//**
 * Shared x value of the stack
 * @name Highcharts.StackItemObject#x
 * @type {number}
 */

''; // keeps doclets above in JS file

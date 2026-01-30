/* *
 *
 *  Highcharts variwide module
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

import type StackingAxis from '../../Core/Axis/Stacking/StackingAxis';
import type Types from '../../Shared/Types';
import type RangeSelector from '../../Stock/RangeSelector/RangeSelector';
import type VariwideSeriesOptions from './VariwideSeriesOptions';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: ColumnSeries
} = SeriesRegistry.seriesTypes;
import VariwideComposition from './VariwideComposition.js';
import VariwidePoint from './VariwidePoint.js';
import VariwideSeriesDefaults from './VariwideSeriesDefaults.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    arrayMin,
    arrayMax,
    crisp,
    extend,
    merge,
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
 * @name Highcharts.seriesTypes.variwide
 *
 * @augments Highcharts.Series
 */

class VariwideSeries extends ColumnSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static compose = VariwideComposition.compose;

    public static defaultOptions: VariwideSeriesOptions = merge(
        ColumnSeries.defaultOptions,
        VariwideSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public crispOption?: boolean;
    public data!: Array<VariwidePoint>;
    public options!: VariwideSeriesOptions;
    public points!: Array<VariwidePoint>;
    public relZ!: Array<number>;
    public totalZ!: number;
    public zData?: Array<number>;

    /* *
     *
     * Functions
     *
     * */

    public processData(force?: boolean): undefined {
        this.totalZ = 0;
        this.relZ = [];
        SeriesRegistry.seriesTypes.column.prototype.processData.call(
            this,
            force
        );

        const zData = this.getColumn('z');

        (this.xAxis.reversed ?
            zData.slice().reverse() :
            zData
        ).forEach(
            function (
                this: VariwideSeries,
                z: number,
                i: number
            ): void {
                this.relZ[i] = this.totalZ;
                this.totalZ += z;
            },
            this
        );

        if (this.xAxis.categories) {
            this.xAxis.variwide = true;
            this.xAxis.zData = zData; // Used for label rank
        }
        return;
    }

    /**
     * Translate an x value inside a given category index into the distorted
     * axis translation.
     *
     * @private
     * @function Highcharts.Series#postTranslate
     *
     * @param {number} index
     *        The category index
     *
     * @param {number} x
     *        The X pixel position in undistorted axis pixels
     *
     * @param {Highcharts.Point} point
     *        For crosshairWidth for every point
     *
     * @return {number}
     *         Distorted X position
     */
    public postTranslate(
        index: number,
        x: number,
        point?: VariwidePoint
    ): number {

        const axis = this.xAxis,
            relZ = this.relZ,
            i = axis.reversed ? relZ.length - index : index,
            goRight = axis.reversed ? -1 : 1,
            minPx = axis.toPixels(
                axis.reversed ?
                    (axis.dataMax || 0) + axis.pointRange :
                    (axis.dataMin || 0)
            ),
            maxPx = axis.toPixels(
                axis.reversed ?
                    (axis.dataMin || 0) :
                    (axis.dataMax || 0) + axis.pointRange
            ),
            len = Math.abs(maxPx - minPx),
            totalZ = this.totalZ,
            left = this.chart.inverted ?
                maxPx - (this.chart.plotTop - goRight * axis.minPixelPadding) :
                minPx - this.chart.plotLeft - goRight * axis.minPixelPadding,
            linearSlotLeft = i / relZ.length * len,
            linearSlotRight = (i + goRight) / relZ.length * len,
            slotLeft = (pick(relZ[i], totalZ) / totalZ) * len,
            slotRight = (pick(relZ[i + goRight], totalZ) / totalZ) * len,
            xInsideLinearSlot = (x - (left + linearSlotLeft));

        // Set crosshairWidth for every point (#8173)
        if (point) {
            point.crosshairWidth = slotRight - slotLeft;
        }

        return left + slotLeft +
            xInsideLinearSlot * (slotRight - slotLeft) /
            (linearSlotRight - linearSlotLeft);
    }

    /* eslint-enable valid-jsdoc */

    public translate(): void {
        // Temporarily disable crisping when computing original shapeArgs
        this.crispOption = this.options.crisp;
        this.options.crisp = false;

        super.translate();

        // Reset option
        this.options.crisp = this.crispOption;
    }

    /**
     * Function that corrects stack labels positions
     * @private
     */
    public correctStackLabels(): void {
        const series = this,
            options = series.options,
            yAxis = series.yAxis as StackingAxis;

        let pointStack,
            pointWidth,
            stack,
            xValue;

        for (const point of series.points) {
            xValue = point.x;
            pointWidth = (point.shapeArgs as any).width;
            stack = yAxis.stacking.stacks[(
                series.negStacks &&
                (point.y as any) < (
                    options.startFromThreshold ?
                        0 :
                        (options.threshold as any)
                ) ?
                    '-' :
                    ''
            ) + series.stackKey];

            if (stack) {
                pointStack = stack[xValue as any];
                if (pointStack && !point.isNull) {
                    pointStack.setOffset(
                        -(pointWidth / 2) || 0,
                        pointWidth || 0,
                        void 0,
                        void 0,
                        point.plotX,
                        series.xAxis
                    );
                }
            }
        }
    }

    public getXExtremes(
        xData: Array<number>|Types.TypedArray
    ): RangeSelector.RangeObject {
        const max = arrayMax(xData),
            maxZ = this.getColumn('z')[xData.indexOf(max)];

        return {
            min: arrayMin(xData),
            max: max + (this.xAxis.categories ? 0 : maxZ)
        };
    }
}

// Extend translation by distorting X position based on Z.
addEvent(VariwideSeries, 'afterColumnTranslate', function (): void {

    // Temporarily disable crisping when computing original shapeArgs
    const xAxis = this.xAxis,
        inverted = this.chart.inverted;

    let i = -1;

    // Distort the points to reflect z dimension
    for (const point of this.points) {
        ++i;

        const shapeArgs = point.shapeArgs || {},
            { x = 0, width = 0 } = shapeArgs,
            { plotX = 0, tooltipPos, z = 0 } = point;

        let left: number, right: number;

        if (xAxis.variwide) {
            left = this.postTranslate(i, x, point);
            right = this.postTranslate(i, x + width);

        // For linear or datetime axes, the variwide column should start with X
        // and extend Z units, without modifying the axis.
        } else {
            left = plotX;
            right = xAxis.translate(point.x + z, false, false, false, true);
        }

        if (this.crispOption) {
            left = crisp(left, this.borderWidth);
            right = crisp(right, this.borderWidth);
        }

        shapeArgs.x = left;
        shapeArgs.width = Math.max(right - left, 1);

        // Crosshair position (#8083)
        point.plotX = (left + right) / 2;

        // Adjust the tooltip position
        if (tooltipPos) {
            if (!inverted) {
                tooltipPos[0] = shapeArgs.x + shapeArgs.width / 2;
            } else {
                tooltipPos[1] = xAxis.len - shapeArgs.x - shapeArgs.width / 2;
            }
        }
    }

    if (this.options.stacking) {
        this.correctStackLabels();
    }

}, { order: 2 });

/* *
 *
 *  Class Prototype
 *
 * */

interface VariwideSeries {
    irregularWidths: boolean;
    parallelArrays: Array<string>;
    pointArrayMap: Array<string>;
    pointClass: typeof VariwidePoint;
}

extend(VariwideSeries.prototype, {
    irregularWidths: true,
    keysAffectYAxis: ['y'],
    pointArrayMap: ['y', 'z'],
    parallelArrays: ['x', 'y', 'z'],
    pointClass: VariwidePoint
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        variwide: typeof VariwideSeries;
    }
}

SeriesRegistry.registerSeriesType('variwide', VariwideSeries);

/* *
 *
 *  Default Export
 *
 * */

export default VariwideSeries;

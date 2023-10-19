/* *
 *
 *  (c) 2010-2021 Kacper Madej
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

import type BulletSeriesOptions from './BulletSeriesOptions';
import type DataExtremesObject from '../../Core/Series/DataExtremesObject';

import BulletPoint from './BulletPoint.js';
import BulletSeriesDefaults from './BulletSeriesDefaults.js';
import ColumnSeries from '../Column/ColumnSeries.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
const {
    extend,
    isNumber,
    merge,
    pick,
    relativeLength
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The bullet series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.bullet
 *
 * @augments Highcharts.Series
 */
class BulletSeries extends ColumnSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: BulletSeriesOptions = merge(
        ColumnSeries.defaultOptions,
        BulletSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<BulletPoint> = void 0 as any;

    public options: BulletSeriesOptions = void 0 as any;

    public points: Array<BulletPoint> = void 0 as any;

    public targetData: Array<number> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Draws the targets. For inverted chart, the `series.group` is rotated,
     * so the same coordinates apply. This method is based on column series
     * drawPoints function.
     *
     * @ignore
     * @function Highcharts.Series#drawPoints
     */
    public drawPoints(): void {
        const series = this,
            chart = series.chart,
            options = series.options,
            animationLimit = options.animationLimit || 250;

        super.drawPoints.apply(this, arguments);

        for (const point of series.points) {
            const pointOptions = point.options,
                targetVal = point.target,
                pointVal = point.y;

            let targetShapeArgs,
                targetGraphic = point.targetGraphic,
                width,
                height,
                targetOptions,
                y;

            if (isNumber(targetVal) && targetVal !== null) {
                targetOptions = merge(
                    options.targetOptions,
                    pointOptions.targetOptions
                );
                height = targetOptions.height;

                let shapeArgs = point.shapeArgs;

                // #15547
                if (point.dlBox && shapeArgs && !isNumber(shapeArgs.width)) {
                    shapeArgs = point.dlBox;
                }

                width = relativeLength(
                    targetOptions.width as any,
                    (shapeArgs as any).width
                );
                y = series.yAxis.translate(
                    targetVal,
                    false,
                    true,
                    false,
                    true
                ) - (targetOptions.height as any) / 2 - 0.5;

                targetShapeArgs = series.crispCol.apply({
                // Use fake series object to set borderWidth of target
                    chart: chart,
                    borderWidth: targetOptions.borderWidth,
                    options: {
                        crisp: options.crisp
                    }
                }, [
                    (
                        (shapeArgs as any).x +
                        (shapeArgs as any).width / 2 - width / 2
                    ),
                    y,
                    width,
                    height as any
                ]);

                if (targetGraphic) {
                    // Update
                    targetGraphic[
                        chart.pointCount < animationLimit ?
                            'animate' :
                            'attr'
                    ](targetShapeArgs);

                    // Add or remove tooltip reference
                    if (isNumber(pointVal) && pointVal !== null) {
                        (targetGraphic.element as any).point = point;
                    } else {
                        (targetGraphic.element as any).point = void 0;
                    }
                } else {
                    point.targetGraphic = targetGraphic = chart.renderer
                        .rect()
                        .attr(targetShapeArgs)
                        .add(series.group);
                }

                // Presentational
                if (!chart.styledMode) {
                    targetGraphic.attr({
                        fill: pick(
                            targetOptions.color,
                            pointOptions.color,
                            (series.zones.length && (point.getZone.call({
                                series: series,
                                x: point.x,
                                y: targetVal,
                                options: {}
                            }).color || series.color)) || void 0,
                            point.color,
                            series.color
                        ),
                        stroke: pick(
                            targetOptions.borderColor,
                            point.borderColor,
                            series.options.borderColor
                        ),
                        'stroke-width': targetOptions.borderWidth,
                        r: targetOptions.borderRadius
                    });
                }

                // Add tooltip reference
                if (isNumber(pointVal) && pointVal !== null) {
                    (targetGraphic.element as any).point = point;
                }

                targetGraphic.addClass(point.getClassName() +
                ' highcharts-bullet-target', true);
            } else if (targetGraphic) {
                // #1269:
                point.targetGraphic = targetGraphic.destroy() as any;
            }
        }

    }

    /**
     * Includes target values to extend extremes from y values.
     *
     * @ignore
     * @function Highcharts.Series#getExtremes
     */
    public getExtremes(yData?: Array<number>): DataExtremesObject {
        const dataExtremes = super.getExtremes.call(this, yData),
            targetData = this.targetData;

        if (targetData && targetData.length) {
            const targetExtremes = super.getExtremes.call(
                this,
                targetData
            );
            if (isNumber(targetExtremes.dataMin)) {
                dataExtremes.dataMin = Math.min(
                    pick(dataExtremes.dataMin, Infinity),
                    targetExtremes.dataMin
                );
            }
            if (isNumber(targetExtremes.dataMax)) {
                dataExtremes.dataMax = Math.max(
                    pick(dataExtremes.dataMax, -Infinity),
                    targetExtremes.dataMax
                );
            }
        }
        return dataExtremes;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Prototype
 *
 * */

interface BulletSeries {
    parallelArrays: Array<string>;
    pointArrayMap: Array<string>;
    pointClass: typeof BulletPoint;
}
extend(BulletSeries.prototype, {
    parallelArrays: ['x', 'y', 'target'],
    pointArrayMap: ['y', 'target']
});

BulletSeries.prototype.pointClass = BulletPoint;

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        bullet: typeof BulletSeries;
    }
}

SeriesRegistry.registerSeriesType('bullet', BulletSeries);

/* *
 *
 *  Default Export
 *
 * */

export default BulletSeries;

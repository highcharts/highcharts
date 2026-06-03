/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Andrzej Buleczka
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

import type BBoxObject from '../Core/Renderer/BBoxObject';
import type DataLabelOptions from '../Core/Series/DataLabelOptions';
import type Point from '../Core/Series/Point';
import type Series from '../Core/Series/Series';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';

import ColumnSeries from './Column/ColumnSeries.js';
import {
    isNumber
} from '../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

namespace RangeDataLabel {

    export interface DataLabelOptionsWithPointValKey extends DataLabelOptions {
        pointValKey?: string;
    }

    interface PointComposition extends Point {
        below?: boolean;
        highPlot?: number;
        lowPlot?: number;
        medianPlot?: number;
        plotClose?: number;
        plotHigh?: number;
        plotLow?: number;
        plotOpen?: number;
        q1Plot?: number;
        q3Plot?: number;
    }

    export interface SeriesComposition<
        PointValKey extends string = string
    > extends Series {
        pointArrayMap: Array<PointValKey>;
        pointValKey: PointValKey;
    }

    type PlotYKey = (
        'highPlot' |
        'lowPlot' |
        'medianPlot' |
        'plotClose' |
        'plotHigh' |
        'plotLow' |
        'plotOpen' |
        'plotY' |
        'q1Plot' |
        'q3Plot'
    );

    const plotYKeys: Partial<Record<string, Array<PlotYKey>>> = {
        close: ['plotClose'],
        high: ['highPlot', 'plotHigh'],
        low: ['lowPlot', 'plotLow'],
        median: ['medianPlot'],
        open: ['plotOpen'],
        q1: ['q1Plot'],
        q3: ['q3Plot'],
        y: ['plotY']
    };

    /* *
     *
     *  Functions
     *
     * */

    function getPointPlotY(
        point: PointComposition,
        pointValKey: string
    ): number|undefined {
        const keys = plotYKeys[pointValKey] ?? [];

        for (const key of keys) {
            const value = point[key];

            if (isNumber(value)) {
                return value;
            }
        }
    }

    function getBelow(
        point: PointComposition,
        options: DataLabelOptions,
        plotY: number
    ): boolean {
        const plotHigh = getPointPlotY(point, 'high'),
            plotLow = getPointPlotY(point, 'low');

        if (isNumber(plotHigh) && isNumber(plotLow)) {
            return options.inside ?
                plotY === Math.min(plotHigh, plotLow) :
                plotY === Math.max(plotHigh, plotLow);
        }

        return false;
    }

    export function compose<T extends typeof Series>(
        SeriesClass: T
    ): T {
        const seriesProto = SeriesClass.prototype as SeriesComposition;

        seriesProto.alignDataLabel = alignDataLabel;
        seriesProto.getDataLabelValue = getDataLabelValue;

        return SeriesClass;
    }

    export function resolvePointValKey<PointValKey extends string>(
        series: SeriesComposition<PointValKey>,
        rawKey?: PointValKey
    ): PointValKey {
        return rawKey && series.pointArrayMap.indexOf(rawKey) > -1 ?
            rawKey :
            series.pointValKey;
    }

    export function getDataLabelValue(
        this: SeriesComposition,
        point: Point,
        options: DataLabelOptions
    ): number|undefined {
        const pointValKey = resolvePointValKey(
                this,
                (options as DataLabelOptionsWithPointValKey).pointValKey
            ),
            value = point.getNestedProperty(pointValKey);

        return isNumber(value) ? value : void 0;
    }

    export function getOptionsPointValKey(
        options?: DataLabelOptions
    ): string|undefined {
        return (options as DataLabelOptionsWithPointValKey|undefined)
            ?.pointValKey;
    }

    export function alignDataLabel(
        this: SeriesComposition,
        point: PointComposition,
        dataLabel: SVGElement,
        options: DataLabelOptionsWithPointValKey,
        alignTo?: BBoxObject,
        isNew?: boolean
    ): void {
        const series = this,
            pointValKey = resolvePointValKey(series, options.pointValKey),
            plotY = getPointPlotY(point, pointValKey),
            shapeArgs = point.shapeArgs,
            originalPlotY = point.plotY,
            originalDlBox = point.dlBox,
            originalBelow = point.below;

        if (isNumber(plotY)) {
            point.plotY = plotY;

            if (shapeArgs) {
                point.dlBox = {
                    x: shapeArgs.x ?? 0,
                    y: plotY,
                    width: shapeArgs.width ?? 0,
                    height: 0
                };
            }

            point.below = getBelow(point, options, plotY);
        }

        ColumnSeries.prototype.alignDataLabel.call(
            series,
            point,
            dataLabel,
            options,
            alignTo,
            isNew
        );

        point.plotY = originalPlotY;
        point.dlBox = originalDlBox;
        point.below = originalBelow;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default RangeDataLabel;

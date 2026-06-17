/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Andrzej Buleczka
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

    export interface DataLabelOptionsWithAlignToKey extends DataLabelOptions {
        alignToKey?: string;
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

        return SeriesClass;
    }

    /**
     * Default formatter for range series data labels. Renders the value of
     * the point key the label is aligned to, so the legacy high and low
     * labels keep showing their respective values without an explicit format.
     * Does not modify `point.y`. Falls back to `point.y` (the value of
     * `series.pointValKey`) for an unresolved key.
     * @internal
     */
    export function formatter(
        this: Point,
        options: DataLabelOptionsWithAlignToKey
    ): string {
        const rawValue = options.alignToKey ?
                this.getNestedProperty(options.alignToKey) :
                this.y,
            value = isNumber(rawValue) ? rawValue : this.y;

        return isNumber(value) ?
            this.series.chart.numberFormatter(value, -1) :
            '';
    }

    /**
     * Rewrite a label's `format` so that `{y}` and `{point.y}` references
     * resolve to the value of the point key the label is aligned to, keeping
     * the legacy per-label `{y}` behavior of range data labels.
     * @internal
     */
    export function applyAlignToKeyValue(
        options: DataLabelOptionsWithAlignToKey
    ): void {
        const { alignToKey, format } = options;

        // An explicit `format` ignores `alignToKey`, so its `{y}` (and
        // `{point.y}`) tokens point at the whole point. Rewrite them to the
        // aligned key so each range label keeps rendering its own value.
        // The default formatter already reads `alignToKey`.
        if (alignToKey && format) {
            options.format = format.replace(
                /\{(?:point\.)?y([:}])/g,
                '{point.' + alignToKey + '$1'
            );
        }
    }

    export function resolveAlignToKey<PointValKey extends string>(
        series: SeriesComposition<PointValKey>,
        rawKey?: PointValKey
    ): PointValKey {
        return rawKey && series.pointArrayMap.indexOf(rawKey) > -1 ?
            rawKey :
            series.pointValKey;
    }

    export function alignDataLabel(
        this: SeriesComposition,
        point: PointComposition,
        dataLabel: SVGElement,
        options: DataLabelOptionsWithAlignToKey,
        alignTo?: BBoxObject,
        isNew?: boolean
    ): void {
        const series = this,
            alignToKey = resolveAlignToKey(series, options.alignToKey),
            plotY = getPointPlotY(point, alignToKey),
            shapeArgs = point.shapeArgs,
            originalPlotY = point.plotY,
            originalDlBox = point.dlBox,
            originalBelow = point.below;

        if (isNumber(plotY)) {
            point.plotY = plotY;

            if (shapeArgs && !options.inside) {
                point.dlBox = {
                    x: shapeArgs.x ?? 0,
                    y: plotY,
                    width: shapeArgs.width ?? 0,
                    height: 0
                };
            }

            const below = point.below = getBelow(point, options, plotY);

            if (series.chart.inverted) {
                options.align ??= below ? 'right' : 'left';
            } else {
                options.verticalAlign ??= below ? 'top' : 'bottom';
            }
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

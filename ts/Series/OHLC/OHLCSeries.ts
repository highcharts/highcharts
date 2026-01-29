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

/* eslint @typescript-eslint/no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

/* *
 *
 *  Imports
 *
 * */

import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type OHLCSeriesOptions from './OHLCSeriesOptions';
import type Series from '../../Core/Series/Series';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import H from '../../Core/Globals.js';
const { composed } = H;
import OHLCPoint from './OHLCPoint.js';
import OHLCSeriesDefaults from './OHLCSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    hlc: HLCSeries
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    crisp,
    extend,
    merge,
    pushUnique
} = U;

/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 */
function onSeriesAfterSetOptions(
    this: Series,
    e: { options: LineSeriesOptions }
): void {
    const options = e.options,
        dataGrouping = options.dataGrouping;

    if (
        dataGrouping &&
        options.useOhlcData &&
        options.id !== 'highcharts-navigator-series'
    ) {
        dataGrouping.approximation = 'ohlc';
    }
}

/**
 * Add useOhlcData option
 * @private
 */
function onSeriesInit(
    this: Series,
    eventOptions: { options: OHLCSeriesOptions }
): void {
    // eslint-disable-next-line no-invalid-this
    const series = this,
        options = eventOptions.options;

    if (
        options.useOhlcData &&
        options.id !== 'highcharts-navigator-series'
    ) {
        extend(series, {
            pointValKey: OHLCSeries.prototype.pointValKey,
            // Keys: ohlcProto.keys, // @todo potentially nonsense
            pointArrayMap: OHLCSeries.prototype.pointArrayMap,
            toYData: OHLCSeries.prototype.toYData
        });
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * The ohlc series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ohlc
 *
 * @augments Highcharts.Series
 */
class OHLCSeries extends HLCSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: OHLCSeriesOptions = merge(
        HLCSeries.defaultOptions,
        OHLCSeriesDefaults
    );

    /* *
     *
     *  Static Functions
     *
     * */

    public static compose(
        SeriesClass: typeof Series,
        ..._args: Array<never>
    ): void {

        if (pushUnique(composed, 'OHLCSeries')) {
            addEvent(SeriesClass, 'afterSetOptions', onSeriesAfterSetOptions);
            addEvent(SeriesClass, 'init', onSeriesInit);
        }

    }

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<OHLCPoint>;

    public options!: OHLCSeriesOptions;

    public points!: Array<OHLCPoint>;

    /* *
     *
     *  Functions
     *
     * */

    public getPointPath(point: OHLCPoint, graphic: SVGElement): SVGPath {
        const path = super.getPointPath(point, graphic),
            strokeWidth = graphic.strokeWidth(),
            crispX = crisp(point.plotX || 0, strokeWidth),
            halfWidth = Math.round((point.shapeArgs as any).width / 2);

        if (point.open !== null) {
            const plotOpen = crisp(point.plotOpen, strokeWidth);
            path.push(
                ['M', crispX, plotOpen],
                ['L', crispX - halfWidth, plotOpen]
            );

            super.extendStem(path, strokeWidth / 2, plotOpen);
        }
        return path;
    }

    /**
     * Postprocess mapping between options and SVG attributes
     * @private
     */
    public pointAttribs(
        point: OHLCPoint,
        state: StatesOptionsKey
    ): SVGAttributes {
        const attribs = super.pointAttribs.call(this, point, state),
            options = this.options;

        delete attribs.fill;

        if (
            !point.options.color &&
            options.upColor &&
            point.open < point.close
        ) {
            attribs.stroke = options.upColor;
        }

        return attribs;
    }

    public toYData(point: OHLCPoint): Array<number> {
        // Return a plain array for speedy calculation
        return [point.open, point.high, point.low, point.close];
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface OHLCSeries {
    pointClass: typeof OHLCPoint;
    pointAttrToOptions: Record<string, string>;
    toYData(point: OHLCPoint): Array<number>;
}
extend(OHLCSeries.prototype, {
    pointClass: OHLCPoint,
    pointArrayMap: ['open', 'high', 'low', 'close']
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        ohlc: typeof OHLCSeries;
    }
}
SeriesRegistry.registerSeriesType('ohlc', OHLCSeries);

/* *
 *
 *  Default Export
 *
 * */

export default OHLCSeries;

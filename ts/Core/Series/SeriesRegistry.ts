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

import type Chart from '../Chart/Chart';
import type Series from './Series.js';
import type SeriesOptions from './SeriesOptions';
import type {
    SeriesTypeOptions,
    SeriesTypeRegistry
} from './SeriesType';

import H from '../Globals.js';
import D from '../DefaultOptions.js';
const { defaultOptions } = D;
import Point from './Point.js';
import U from '../Utilities.js';
const {
    error,
    extendClass,
    merge
} = U;

/* *
 *
 *  Namespace
 *
 * */

namespace SeriesRegistry {

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    export let series: typeof Series;

    /**
     * @internal
     * @todo Move `Globals.seriesTypes` code to her.
     */
    export const seriesTypes = H.seriesTypes;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Internal function to initialize an individual series.
     * @private
     */
    export function getSeries(
        chart: Chart,
        options: DeepPartial<SeriesTypeOptions> = {}
    ): Series {
        const optionsChart = chart.options.chart,
            type = (
                options.type ||
                optionsChart.type ||
                optionsChart.defaultSeriesType ||
                ''
            ),
            SeriesClass: typeof Series = seriesTypes[type] as any;

        // No such series type
        if (!SeriesRegistry) {
            error(17, true, chart as any, { missingModuleFor: type });
        }

        const series = new SeriesClass();

        if (typeof series.init === 'function') {
            series.init(chart, options);
        }

        return series;
    }

    /**
     * Registers class pattern of a series.
     *
     * @private
     */
    export function registerSeriesType(
        seriesType: string,
        seriesClass: typeof Series
    ): void {
        const defaultPlotOptions = defaultOptions.plotOptions || {},
            seriesOptions: SeriesOptions = (seriesClass as any).defaultOptions;

        if (!seriesClass.prototype.pointClass) {
            seriesClass.prototype.pointClass = Point;
        }

        seriesClass.prototype.type = seriesType;

        if (seriesOptions) {
            defaultPlotOptions[seriesType] = seriesOptions;
        }

        seriesTypes[seriesType] = seriesClass;
    }

    /**
     * Old factory to create new series prototypes.
     *
     * @deprecated
     * @function Highcharts.seriesType
     *
     * @param {string} type
     * The series type name.
     *
     * @param {string} parent
     * The parent series type name. Use `line` to inherit from the basic
     * {@link Series} object.
     *
     * @param {Highcharts.SeriesOptionsType|Highcharts.Dictionary<*>} options
     * The additional default options that are merged with the parent's options.
     *
     * @param {Highcharts.Dictionary<*>} [props]
     * The properties (functions and primitives) to set on the new prototype.
     *
     * @param {Highcharts.Dictionary<*>} [pointProps]
     * Members for a series-specific extension of the {@link Point} prototype if
     * needed.
     *
     * @return {Highcharts.Series}
     * The newly created prototype as extended from {@link Series} or its
     * derivatives.
     */
    export function seriesType<T extends typeof Series>(
        type: keyof SeriesTypeRegistry,
        parent: (keyof SeriesTypeRegistry|undefined),
        options: T['prototype']['options'],
        seriesProto?: DeepPartial<T['prototype']>,
        pointProto?: DeepPartial<T['prototype']['pointClass']['prototype']>
    ): T {
        const defaultPlotOptions = defaultOptions.plotOptions || {};

        parent = parent || '';

        // Merge the options
        defaultPlotOptions[type] = merge(
            defaultPlotOptions[parent],
            options
        );

        // Create the class
        registerSeriesType(type, extendClass(
            seriesTypes[parent] as any || function (): void {},
            seriesProto
        ) as any);
        seriesTypes[type].prototype.type = type;

        // Create the point class if needed
        if (pointProto) {
            seriesTypes[type].prototype.pointClass =
                extendClass(Point, pointProto);
        }

        return seriesTypes[type] as unknown as T;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Default Export
 *
 * */

export default SeriesRegistry;

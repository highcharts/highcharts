/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type AnimationOptionsObject from '../Animation/AnimationOptionsObject';
import type {
    SeriesLike,
    SeriesLikeOptions,
    SeriesTypeRegistry
} from './Types';
import type Chart from '../Chart/Chart';
import H from '../Globals.js';
import Point from './Point.js';
import U from '../Utilities.js';
const {
    error,
    extendClass,
    fireEvent,
    getOptions,
    isObject,
    merge,
    objectEach
} = U;

/**
 * Internal namespace
 * @private
 * @todo remove
 */
declare global {
    namespace Highcharts {
        let seriesTypes: SeriesTypeRegistry;
        function seriesType<T extends typeof BaseSeries>(
            type: keyof SeriesTypeRegistry,
            parent: (keyof SeriesTypeRegistry|undefined),
            options: DeepPartial<T['prototype']['options']>,
            props?: DeepPartial<T['prototype']>,
            pointProps?: DeepPartial<T['prototype']['pointClass']['prototype']>
        ): T;
    }
}

import '../Options.js';

/**
 * @class
 * @name Highcharts.Series
 */
abstract class BaseSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly defaultOptions: BaseSeries.Options = {
        type: 'base'
    };

    public static readonly seriesTypes = {} as BaseSeries.SeriesTypesRegistry;

    /* *
     *
     *  Static Functions
     *
     * */

    public static addSeries(
        seriesName: string,
        seriesType: typeof BaseSeries
    ): void {
        BaseSeries.seriesTypes[seriesName] = seriesType;
    }

    public static cleanRecursively<T>(
        toClean: DeepRecord<string, T>,
        reference: DeepRecord<string, T>
    ): DeepRecord<string, T> {
        var clean: DeepRecord<string, T> = {};

        objectEach(toClean, function (
            _val: (T|DeepRecord<string, T>),
            key: (number|string)
        ): void {
            var ob;

            // Dive into objects (except DOM nodes)
            if (
                isObject(toClean[key], true) &&
                !toClean.nodeType && // #10044
                reference[key]
            ) {
                ob = BaseSeries.cleanRecursively<T>(
                    toClean[key] as DeepRecord<string, T>,
                    reference[key] as DeepRecord<string, T>
                );
                if (Object.keys(ob).length) {
                    clean[key] = ob;
                }

            // Arrays, primitives and DOM nodes are copied directly
            } else if (
                isObject(toClean[key]) ||
                toClean[key] !== reference[key]
            ) {
                clean[key] = toClean[key];
            }
        });

        return clean;
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * Internal function to initialize an individual series.
     * @private
     */
    public static getSeries(
        chart: Chart,
        options: DeepPartial<BaseSeries.Options> = {}
    ): Highcharts.Series {
        const optionsChart = chart.options.chart as Highcharts.ChartOptions,
            type = (
                options.type ||
                optionsChart.type ||
                optionsChart.defaultSeriesType ||
                ''
            ),
            Series: Highcharts.Series = BaseSeries.seriesTypes[type] as any;

        // No such series type
        if (!Series) {
            error(17, true, chart as any, { missingModuleFor: type });
        }

        return new Series(chart, options);
    }

    /**
     * Factory to create new series prototypes.
     *
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
    // docs: add to API + extending Highcharts
    public static seriesType<T extends typeof BaseSeries>(
        type: keyof SeriesTypeRegistry,
        parent: (keyof SeriesTypeRegistry|undefined),
        options: DeepPartial<T['prototype']['options']>,
        seriesProto?: DeepPartial<T['prototype']>,
        pointProto?: DeepPartial<T['prototype']['pointClass']['prototype']>
    ): T {
        const defaultOptions: Record<string, any> = getOptions().plotOptions || {},
            seriesTypes = BaseSeries.seriesTypes;

        parent = parent || '';

        // Merge the options
        defaultOptions[type] = merge(
            defaultOptions[parent],
            options
        );

        // Create the class
        BaseSeries.addSeries(type, extendClass(
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

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        chart: Chart,
        options?: DeepPartial<BaseSeries.Options>
    ) {
        const mergedOptions = merge(
            BaseSeries.defaultOptions,
            options
        );

        this.chart = chart;
        this._i = chart.series.length;

        chart.series.push(this as any);

        this.options = mergedOptions;
        this.userOptions = merge(options) as Highcharts.SeriesOptions;
    }

    /* *
     *
     *  Properties
     *
     * */

    public _i: number;

    public readonly chart: Chart;

    public isDirty?: boolean;

    public options: BaseSeries.Options;

    public userOptions: DeepPartial<BaseSeries.Options>;

    /* *
     *
     *  Functions
     *
     * */

    public abstract drawGraph(): void;

    public abstract translate(): void;

    public update(
        newOptions: DeepPartial<BaseSeries.Options>,
        redraw: boolean = true
    ): BaseSeries {
        let series: BaseSeries = this;

        newOptions = BaseSeries.cleanRecursively(newOptions, this.userOptions);

        const newType = newOptions.type;

        if (
            typeof newType !== 'undefined' &&
            newType !== series.type
        ) {
            series = BaseSeries.getSeries(series.chart, newOptions);
        }

        fireEvent(series, 'update', { newOptions });

        series.userOptions = merge(newOptions);

        fireEvent(series, 'afterUpdate', { newOptions });

        if (redraw) {
            series.chart.redraw();
        }

        return series;
    }
}

interface BaseSeries extends SeriesLike {
    new(...args: Array<any>): this;
    pointClass: typeof Point;
    type: string;
}

BaseSeries.prototype.pointClass = Point;

namespace BaseSeries {

    export interface Options extends SeriesLikeOptions {
        animation?: (boolean|DeepPartial<AnimationOptionsObject>);
        dataSorting?: Highcharts.DataSortingOptionsObject; // cartasian series
        index?: number;
        /** @private */
        isInternal?: boolean;
        pointStart?: number;
    }

    export interface SeriesTypesRegistry extends SeriesTypeRegistry {
        [key: string]: typeof BaseSeries;
    }

}

// backwards compatibility

H.seriesType = BaseSeries.seriesType;
H.seriesTypes = BaseSeries.seriesTypes;

/* *
 *
 *  Export
 *
 * */

export default BaseSeries;

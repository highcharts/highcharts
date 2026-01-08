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

import type { DeepPartial } from '../../Shared/Types';
import type { SeriesTypeRegistry } from './SeriesType';
import type Series from './Series.js';

import H from '../Globals.js';
import D from '../Defaults.js';
const { defaultOptions } = D;
import Point from './Point.js';
import U from '../Utilities.js';
const {
    extend,
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

    /**
     * Registers class pattern of a series.
     *
     * @internal
     */
    export function registerSeriesType(
        seriesType: string,
        SeriesClass: typeof Series
    ): boolean {
        const defaultPlotOptions = defaultOptions.plotOptions || {},
            seriesOptions = SeriesClass.defaultOptions,
            seriesProto = SeriesClass.prototype;

        seriesProto.type = seriesType;

        if (!seriesProto.pointClass) {
            seriesProto.pointClass = Point;
        }

        if (seriesTypes[seriesType]) {
            return false;
        }

        if (seriesOptions) {
            defaultPlotOptions[seriesType] = seriesOptions;
        }

        seriesTypes[seriesType] = SeriesClass;

        return true;
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
        type: Extract<keyof SeriesTypeRegistry, string>,
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
        delete seriesTypes[type];
        const parentClass = (
                seriesTypes[parent] as typeof Series ||
                (H as unknown as { Series: typeof Series }).Series
            ),
            childClass = extendClass(parentClass, seriesProto) as typeof Series;

        registerSeriesType(type, childClass);
        seriesTypes[type].prototype.type = type;

        // Create the point class if needed
        if (pointProto) {
            class PointClass extends Point {}
            extend(PointClass.prototype, pointProto as any);
            seriesTypes[type].prototype.pointClass = PointClass;
        }

        return seriesTypes[type] as unknown as T;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default SeriesRegistry;

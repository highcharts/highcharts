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

/* *
 *
 *  Imports
 *
 * */

import type Chart from './Chart/Chart';
import type { DeepPartial } from '../Shared/Types';
import type Options from './Options';
import type { SeriesTypeRegistry } from './Series/SeriesType';
import type SizeObject from './Renderer/SizeObject';
import type Time from './Time';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Helper interface to add property types to `Globals`.
 *
 * Use the `declare module 'GlobalsBase'` pattern to overload the interface in
 * this definition file.
 */
export interface GlobalsBase {
    /** @internal */
    readonly Obj: ObjectConstructor;
    /** @internal */
    readonly SVG_NS: string;
    /** @internal */
    chartCount: number;
    /**
     * An array containing the current chart objects in the page. A chart's
     * position in the array is preserved throughout the page's lifetime. When
     * a chart is destroyed, the array item becomes `undefined`.
     */
    readonly charts: Array<(Chart|undefined)>;
    /** @internal */
    readonly composed: Array<unknown>;
    /**
     * A hook for defining additional date format specifiers. New
     * specifiers are defined as key-value pairs by using the
     * specifier as key, and a function which takes the timestamp as
     * value. This function returns the formatted portion of the
     * date.
     *
     * Using `dateFormats` is also a convenient way to define new keys for
     * complex locale-aware date formats compatible with the
     * [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
     * browser API, whenever the built-in formats are not sufficient.
     *
     * @sample highcharts/global/dateformats/
     *         Adding support for week number
     * @sample highcharts/global/dateformats-object/
     *         A locale-aware date format using `Intl.DateTimeFormat`
     */
    readonly dateFormats: Record<string, Time.TimeFormatCallbackFunction>;
    /** @internal */
    readonly deg2rad: number;
    /** @internal */
    readonly doc: Document;
    /** @internal */
    readonly isChrome: boolean;
    /** @internal */
    readonly isFirefox: boolean;
    /** @internal */
    readonly isMS: boolean;
    /** @internal */
    readonly isSafari: boolean;
    /** @internal */
    readonly isTouchDevice: boolean;
    /** @internal */
    readonly isWebKit: boolean;
    /** @internal */
    readonly marginNames: ReadonlyArray<
    'plotTop'|'marginRight'|'marginBottom'|'plotLeft'
    >;
    /** @internal */
    readonly nav: Navigator;
    /** @internal */
    readonly noop: (this: any, ...args: Array<any>) => any;
    /** @internal */
    readonly pageLang?: string,
    /** @internal */
    readonly product: string;
    /** @internal */
    readonly seriesTypes: SeriesTypeRegistry;
    /** @internal */
    readonly supportsPassiveEvents: boolean;
    /** @internal */
    readonly svg: boolean;
    /** @internal */
    readonly symbolSizes: Record<string, SizeObject>;
    /** @internal */
    theme?: DeepPartial<Options>;
    /** @internal */
    readonly userAgent: string;
    /** @internal */
    readonly version: string;
    /** @internal */
    readonly win: (Window&typeof globalThis);
}

/* *
 *
 *  Default Export
 *
 * */

export default GlobalsBase;

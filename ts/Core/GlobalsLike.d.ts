/* *
 *
 *  (c) 2010-2024 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type Chart from './Chart/Chart';
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
 * Use the `declare module 'GlobalsLike'` pattern to overload the interface in
 * this definition file.
 */
export interface GlobalsLike {
    readonly Obj: ObjectConstructor;
    readonly SVG_NS: string;
    chartCount: number;
    readonly charts: Array<(Chart|undefined)>;
    readonly composed: Array<unknown>;
    readonly dateFormats: Record<string, Time.TimeFormatCallbackFunction>;
    readonly deg2rad: number;
    readonly doc: Document;
    readonly hasBidiBug: boolean;
    readonly isChrome: boolean;
    readonly isFirefox: boolean;
    readonly isMS: boolean;
    readonly isSafari: boolean;
    readonly isTouchDevice: boolean;
    readonly isWebKit: boolean;
    readonly marginNames: ReadonlyArray<string>;
    readonly nav: Navigator;
    readonly noop: (this: any, ...args: Array<any>) => any;
    readonly product: string;
    readonly seriesTypes: SeriesTypeRegistry;
    readonly supportsPassiveEvents: boolean;
    readonly svg: boolean;
    readonly symbolSizes: Record<string, SizeObject>;
    theme?: DeepPartial<Options>;
    readonly userAgent: string;
    readonly version: string;
    // eslint-disable-next-line node/no-unsupported-features/es-builtins
    readonly win: (Window&typeof globalThis);
}

/* *
 *
 *  Default Export
 *
 * */

export default GlobalsLike;

/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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
    readonly charts: Array<(Chart|undefined)>;
    /** @internal */
    readonly composed: Array<unknown>;
    readonly dateFormats: Record<string, Time.TimeFormatCallbackFunction>;
    /** @internal */
    readonly deg2rad: number;
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
    readonly nav: Navigator;
    readonly noop: (this: any, ...args: Array<any>) => any;
    readonly pageLang?: string,
    readonly product: string;
    readonly seriesTypes: SeriesTypeRegistry;
    /** @internal */
    readonly supportsPassiveEvents: boolean;
    /** @internal */
    readonly svg: boolean;
    /** @internal */
    readonly symbolSizes: Record<string, SizeObject>;
    theme?: DeepPartial<Options>;
    /** @internal */
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

export default GlobalsBase;

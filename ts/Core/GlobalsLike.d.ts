/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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
 * Deprecated API
 * @private
 */
declare global {
    /**
     * [[include:README.md]]
     * @deprecated
     * @todo remove
     */
    namespace Highcharts {
        // @todo remove
    }
    interface Document {
        /** @deprecated */
        exitFullscreen: () => Promise<void>;
        /** @deprecated */
        mozCancelFullScreen: Function;
        /** @deprecated */
        msExitFullscreen: Function;
        /** @deprecated */
        msHidden: boolean;
        /** @deprecated */
        webkitExitFullscreen: Function;
        /** @deprecated */
        webkitHidden: boolean;
    }
    interface Element {
        /** @deprecated */
        currentStyle?: ElementCSSInlineStyle;
        /** @deprecated */
        mozRequestFullScreen: Function;
        /** @deprecated */
        msMatchesSelector: Element['matches'];
        /** @deprecated */
        msRequestFullscreen: Function;
        /** @deprecated */
        webkitMatchesSelector: Element['matches'];
        /** @deprecated */
        webkitRequestFullScreen: Function;
    }
    interface MSPointerEvent {
        /** @deprecated */
        readonly MSPOINTER_TYPE_TOUCH: string;
    }
    interface PointerEvent {
        /** @deprecated */
        readonly MSPOINTER_TYPE_TOUCH: string;
        /** @deprecated */
        readonly toElement: Element;
    }
    interface Window {
        /** @deprecated */
        createObjectURL?: (typeof URL)['createObjectURL'];
        /** @deprecated */
        opera?: unknown;
        /** @deprecated */
        webkitAudioContext?: typeof AudioContext;
        /** @deprecated */
        webkitURL?: typeof URL;
    }
}

/**
 * @deprecated
 * @todo remove
 */
export type InternalNamespace = typeof Highcharts;

/**
 * Helper interface to add property types to `Globals`.
 *
 * Use the `declare module 'GlobalsLike'` pattern to overload the interface in
 * this definition file.
 */
export interface GlobalsLike extends InternalNamespace {
    readonly Obj: ObjectConstructor;
    readonly SVG_NS: string;
    chartCount: number;
    readonly charts: Array<(Chart|undefined)>;
    readonly dateFormats: Record<string, Time.TimeFormatCallbackFunction>;
    readonly deg2rad: number;
    readonly doc: Document;
    readonly hasBidiBug: boolean;
    readonly hasTouch: boolean;
    readonly isChrome: boolean;
    readonly isFirefox: boolean;
    readonly isMS: boolean;
    readonly isSafari: boolean;
    readonly isTouchDevice: boolean;
    readonly isWebKit: boolean;
    readonly marginNames: ReadonlyArray<string>;
    readonly nav: Navigator;
    readonly noop: (this: unknown, ...args: Array<unknown>) => unknown;
    readonly product: string;
    readonly seriesTypes: SeriesTypeRegistry;
    readonly supportsPassiveEvents: boolean;
    readonly svg: boolean;
    readonly symbolSizes: Record<string, SizeObject>;
    theme?: Partial<Options>;
    readonly userAgent: string;
    readonly version: string;
    // eslint-disable-next-line node/no-unsupported-features/es-builtins
    readonly win: (Window&typeof globalThis);
}

export default GlobalsLike;

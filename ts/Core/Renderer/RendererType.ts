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

import type SVGRenderer from './SVG/SVGRenderer';

/* *
 *
 *  Declarations
 *
 * */

/**
 * All possible renderer class constructors.
 * @internal
 */
export type RendererClass = RendererTypeRegistry[keyof RendererTypeRegistry];

/**
 * All possible renderer types.
 * @internal
 */
export type RendererType = RendererTypeRegistry[
    keyof RendererTypeRegistry
]['prototype'];

/**
 * Helper interface to add series types to `SeriesOptionsType` and `SeriesType`.
 *
 * Use the `declare module 'SeriesType'` pattern to overload the interface in
 * this definition file.
 * @internal
 */
export interface RendererTypeRegistry {
    [key: string]: typeof SVGRenderer;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default RendererType;

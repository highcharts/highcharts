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

import type SVGRenderer from './SVG/SVGRenderer';

/* *
 *
 *  Declarations
 *
 * */

/**
 * All possible renderer class constructors.
 */
export type RendererClass = RendererTypeRegistry[keyof RendererTypeRegistry];

/**
 * All possible renderer types.
 */
export type RendererType = RendererTypeRegistry[
    keyof RendererTypeRegistry
]['prototype'];

/**
 * Helper interface to add series types to `SeriesOptionsType` and `SeriesType`.
 *
 * Use the `declare module 'SeriesType'` pattern to overload the interface in
 * this definition file.
 */
export interface RendererTypeRegistry {
    [key: string]: typeof SVGRenderer;
}

/* *
 *
 *  Default Export
 *
 * */

export default RendererType;

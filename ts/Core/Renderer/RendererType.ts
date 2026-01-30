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

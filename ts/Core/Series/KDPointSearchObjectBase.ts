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
 *  Declarations
 *
 * */

/**
 * Helper interface for point types to add optional members to all point
 * instances.
 *
 * Use the `declare module './PointBase'` pattern to overload the interface in
 * this definition file.
 *
 * @internal
 */
export interface KDPointSearchObjectBase {
    clientX?: number;
    plotY?: number;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default KDPointSearchObjectBase;

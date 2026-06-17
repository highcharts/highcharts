/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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

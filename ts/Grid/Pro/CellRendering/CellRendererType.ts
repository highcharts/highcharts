/* *
 *
 *  Cell Renderer Type
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */


/* *
 *
 *  Declarations
 *
 * */

/**
 * Contains all possible class types of the cell renderer registry.
 */
export type CellRendererClassType =
    CellRendererTypeRegistry[keyof CellRendererTypeRegistry];

/**
 * Contains all possible types of the class registry.
 */
export type CellRendererType = CellRendererClassType['prototype'];

/**
 * Describes the class registry as a record object with class name and their
 * class types (aka class constructor).
 */
export interface CellRendererTypeRegistry {
    // Extend this interface with the declare module pattern.
}

/* *
 *
 *  Export
 *
 * */

export default CellRendererType;

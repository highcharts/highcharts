/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2026 Highsoft AS
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
 * Contains all possible class types of the class registry.
 */
export type ComponentClassType =
    ComponentTypeRegistry[keyof ComponentTypeRegistry];

/**
 * Contains all possible types of the class registry.
 */
export type ComponentType = ComponentClassType['prototype'];

/**
 * Describes the class registry as a record object with class name and their
 * class types (aka class constructor).
 */
export interface ComponentTypeRegistry {
    // Extend this interface with the declare module pattern.
    // [key: string]: typeof Component;
}

/* *
 *
 *  Export
 *
 * */

export default ComponentType;

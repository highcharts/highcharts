/* *
 *
 *  Cell Content Type
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

import TextContent from "../../Core/Table/CellContent/TextContent";

/* *
 *
 *  Declarations
 *
 * */

/**
 * Contains all possible class types of the cell content registry.
 */
export type CellContentClassType =
    CellContentTypeRegistry[keyof CellContentTypeRegistry];

/**
 * Contains all possible types of the class registry.
 */
export type CellContentType = CellContentClassType['prototype'];

/**
 * Describes the class registry as a record object with class name and their
 * class types (aka class constructor).
 */
export interface CellContentTypeRegistry {
    text: typeof TextContent;
    // Extend this interface with the declare module pattern.
}

/* *
 *
 *  Export
 *
 * */

export default CellContentType;

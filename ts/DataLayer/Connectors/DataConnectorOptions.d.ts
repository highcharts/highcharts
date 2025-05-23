/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Karol Kolodziej
 *  - Dawid Dragula
 *
 * */


/* *
 *
 *  Imports
 *
 * */

import type { DataModifierTypeOptions } from '../Modifiers/DataModifierType';


/* *
 *
 *  Declarations
 *
 * */


/**
 * Option of the DataConnector.
 */
export interface DataConnectorOptions {
    type: string;
    id: string;
    dataTables: DataTableConnectorOptions[];
}

export interface DataTableConnectorOptions {
    key?: string;
    dataModifier?: DataModifierTypeOptions;
}


/* *
 *
 *  Default Export
 *
 * */

export default DataConnectorOptions;

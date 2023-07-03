/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Karol Kolodziej
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { DataModifierTypeOptions } from '../Modifiers/DataModifierType';
import type DataTable from '../DataTable';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Option of the DataConnector.
 */
export interface DataConnectorOptions {
    /**
     * Option of the modifier that is used to modify the data.
     */
    dataModifier?: DataModifierTypeOptions;
    /**
     * Options for the data table.
     */
    dataTable?: DataTable.Options;
    /**
     * Your custom metadata.
     */
    metadata?: Metadata;
}

/**
 * Metadata
 */
export interface Metadata {
    columns: Record<string, MetaColumn>;
}

/**
 * Metadata entry containing the name of the column and a metadata object.
 */
export interface MetaColumn {
    dataType?: string;
    defaultValue?: (boolean|null|number|string);
    index?: number;
    title?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataConnectorOptions;

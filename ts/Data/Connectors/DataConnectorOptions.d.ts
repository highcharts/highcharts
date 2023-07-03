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
     * Contains custom metadata related to the connector source, for example the
     * column order on the source side.
     */
    metadata?: Metadata;
}

/**
 * Contains custom metadata related to the connector source, for example the
 * column order on the source side.
 */
export interface Metadata {
    /**
     * Metadata entry containing the name of the column and a metadata object.
     */
    columns: Record<string, MetaColumn>;
}

/**
 * Metadata for a specific column in the connector source.
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

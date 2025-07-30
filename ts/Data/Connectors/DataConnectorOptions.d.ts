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
 *  - Kamil Kubik
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
    id: string;
    type: string;
    dataTables?: DataTableConnectorOptions[];
    dataModifier?: DataModifierTypeOptions;
    metadata?: Metadata;
}

export interface DataTableConnectorOptions {
    key?: string;
    dataModifier?: DataModifierTypeOptions;
    firstRowAsNames?: boolean;
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
    defaultValue?: boolean | null | number | string;
    index?: number;
    title?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataConnectorOptions;

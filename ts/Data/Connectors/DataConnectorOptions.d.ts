/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type { DataTableValue } from '../DataTableOptions';
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

    /**
     * @internal
     * @private
     * @deprecated
     * Removed in Dashboards v4.0.0
     *
     * {@link https://api.highcharts.com/dashboards/#interfaces/Data_Connectors_DataConnectorOptions.DataConnectorOptions | Check how to upgrade your connector to use the new options structure}
     */
    options?: never;
}

export interface DataTableConnectorOptions {
    key?: string;
    dataModifier?: DataModifierTypeOptions;
    firstRowAsNames?: boolean;
    metadata?: Record<string, DataTableValue>;
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

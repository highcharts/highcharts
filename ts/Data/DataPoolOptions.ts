/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { DataConnectorTypes } from './Connectors/DataConnectorType';

/* *
 *
 *  Declarations
 *
 * */

export interface DataPoolOptions {
    connectors: Array<DataPoolConnectorOptions>;
}

export interface DataPoolConnectorOptions
<T extends keyof DataConnectorTypes = keyof DataConnectorTypes> {
    /**
     * The unique identifier of the connector. Used later when referencing
     * the connector in the component where it is used.
     **/
    id: string;
    /**
     * The options of the given connector type.
     **/
    options: DataConnectorTypes[T]['prototype']['options'];
    /**
     * The type of the connector, depends on your data source.
     * Possible values are:
     * - `CSV`
     * - `GoogleSheets`
     * - `HTMLTable`
     **/
    type: T;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataPoolOptions;

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

import type {
    DataConnectorType,
    DataConnectorRegistry
} from './Connectors/DataConnectorType.js';

/* *
 *
 *  Declarations
 *
 * */

export interface DataPoolOptions {
    connectors: Array<DataPoolConnectorOptions>;
}

export interface DataPoolConnectorOptions {
    name: string;
    options: DataConnectorType['prototype']['options'];
    type: keyof DataConnectorRegistry;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataPoolOptions;

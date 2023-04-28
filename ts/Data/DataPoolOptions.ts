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

import type { DataConnectorTypes } from './Connectors/DataConnectorType.js';

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
    name: string;
    options: DataConnectorTypes[T]['prototype']['options'];
    type: T;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataPoolOptions;

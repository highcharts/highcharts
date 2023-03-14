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
    ConnectorType,
    ConnectorTypeRegistry
} from './Connectors/ConnectorType.js';

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
    options: ConnectorType['prototype']['options'];
    type: keyof ConnectorTypeRegistry;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataPoolOptions;

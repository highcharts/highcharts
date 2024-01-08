/* *
 *
 *  (c) 2009-2024 Highsoft AS
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

import type DataConnectorOptions from './DataConnectorOptions';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options of the GoogleSheetsConnector.
 */
export interface HTMLTableConnectorOptions extends DataConnectorOptions {
    /**
     * The id of the HTML table element to load or a reference to the HTML.
     */
    table: (string|HTMLElement);
}

/* *
 *
 *  Default Export
 *
 * */

export default HTMLTableConnectorOptions;

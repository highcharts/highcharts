/* *
 *
 *  (c) 2009-2025 Highsoft AS
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
     * The corresponding connector type.
     */
    type: 'HTMLTable';
    /**
     * The id of the HTML data table element to load or a reference to the HTML.
     */
    htmlTable: string | HTMLElement;
}

/* *
 *
 *  Default Export
 *
 * */

export default HTMLTableConnectorOptions;

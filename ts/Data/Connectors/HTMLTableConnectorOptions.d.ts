/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Karol Kołodziej
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

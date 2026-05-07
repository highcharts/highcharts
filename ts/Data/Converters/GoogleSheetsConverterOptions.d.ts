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
 *  - Kamil Kubik
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { GoogleSheetsBeforeParseCallbackFunction } from '../Connectors/GoogleSheetsConnectorOptions';

import type { Options as DataConverterOptions } from './DataConverter';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options of the GoogleSheetsConverter.
 */
export interface GoogleSheetsConverterOptions extends DataConverterOptions {
    json?: GoogleSpreadsheetJSON;
    beforeParse?: GoogleSheetsBeforeParseCallbackFunction;
}

/**
 * Google's spreadsheet format.
 */
export interface GoogleSpreadsheetJSON {
    majorDimension: ('COLUMNS'|'ROWS');
    values: Array<Array<(boolean|null|number|string|undefined)>>;
}

/* *
 *
 *  Default Export
 *
 * */

export default GoogleSheetsConverterOptions;

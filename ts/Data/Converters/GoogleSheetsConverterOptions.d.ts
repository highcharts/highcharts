/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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

import DataConverter from './DataConverter';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options of the GoogleSheetsConverter.
 */
export interface GoogleSheetsConverterOptions extends DataConverter.Options {
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

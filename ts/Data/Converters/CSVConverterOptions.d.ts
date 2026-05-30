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

import type { CSVBeforeParseCallbackFunction } from '../Connectors/CSVConnectorOptions';

import type { Options as DataConverterOptions } from './DataConverter';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options of the CSVConverter.
 */
export interface CSVConverterOptions extends DataConverterOptions {
    startRow: number;
    endRow: number;
    startColumn: number;
    endColumn: number;
    csv?: string;
    decimalPoint?: string;
    itemDelimiter?: string;
    lineDelimiter: string;
    useLocalDecimalPoint?: boolean;
    decimalRegex?: RegExp;
    beforeParse?: CSVBeforeParseCallbackFunction;
}

/* *
 *
 *  Default Export
 *
 * */

export default CSVConverterOptions;

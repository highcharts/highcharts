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

import type { CSVBeforeParseCallbackFunction } from '../Connectors/CSVConnectorOptions';

import DataConverter from './DataConverter';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options of the CSVConverter.
 */
export interface CSVConverterOptions extends DataConverter.Options {
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

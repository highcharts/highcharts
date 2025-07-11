/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

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

import type {
    ColumnNamesOptions,
    JSONBeforeParseCallbackFunction
} from '../Connectors/JSONConnectorOptions';

import DataConverter from './DataConverter';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options of the JSONConverter.
 */
export interface JSONConverterOptions extends DataConverter.Options {
    data: JSONData;
    orientation: 'columns' | 'rows';
    columnNames?: string[] | ColumnNamesOptions;
    beforeParse?: JSONBeforeParseCallbackFunction;
}

export type JSONData =
    (number | string)[][] | Record<string, number | string>[];

/* *
 *
 *  Default Export
 *
 * */

export default JSONConverterOptions;

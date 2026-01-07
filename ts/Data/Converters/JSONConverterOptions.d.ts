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

import type {
    ColumnIdsOptions,
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
    orientation: 'columns' | 'rows';
    data?: JSONData;
    columnIds?: string[] | ColumnIdsOptions;
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

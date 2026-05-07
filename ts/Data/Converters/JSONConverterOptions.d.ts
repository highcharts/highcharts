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

import type {
    ColumnIdsOptions,
    JSONBeforeParseCallbackFunction
} from '../Connectors/JSONConnectorOptions';

import type { Options as DataConverterOptions } from './DataConverter';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options of the JSONConverter.
 */
export interface JSONConverterOptions extends DataConverterOptions {
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

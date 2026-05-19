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

import type { Options as DataConverterOptions } from './DataConverter';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options of the HTMLTableConverter.
 */
export interface HTMLTableConverterOptions extends DataConverterOptions {
    startRow: number;
    endRow: number;
    startColumn: number;
    endColumn: number;
    decimalPoint?: string;
    exportIDColumn?: boolean;
    tableCaption?: string;
    tableElement?: (HTMLElement|null);
    useLocalDecimalPoint?: boolean;
    useMultiLevelHeaders?: boolean;
    useRowspanHeaders?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default HTMLTableConverterOptions;

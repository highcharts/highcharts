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

import DataConverter from './DataConverter';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options of the HTMLTableConverter.
 */
export interface HTMLTableConverterOptions extends DataConverter.Options {
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

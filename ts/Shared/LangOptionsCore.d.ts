/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

export interface LangOptionsCore {
    decimalPoint?: string;
    invalidDate?: string;
    locale?: string|Array<string>;
    months?: Array<string>;
    shortMonths?: Array<string>;
    shortWeekdays?: Array<string>;
    thousandsSep?: string;
    weekdays?: Array<string>;
    weekFrom?: string;
}

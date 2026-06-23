/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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

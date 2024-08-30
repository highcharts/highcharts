/* *
 *
 *  (c) 2010-2024 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

export interface FormatterCallback<TScope, TValue=undefined> {
    (this: TScope, value: TValue): string;
}

/* *
 *
 *  Export
 *
 * */

export default FormatterCallback;

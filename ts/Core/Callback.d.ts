/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

export interface Callback<TScope, TReturn> extends CallbackLike {
    (this: TScope): TReturn;
}

export interface CallbackLike extends Function {
    // interface to add function members
}

export interface EventCallback<TScope, TEvent = AnyRecord> extends EventCallbackLike {
    (this: TScope, e: TEvent): (boolean|void);
}

export interface EventCallbackLike extends Function {
    // interface to add function members
}

export interface FormatterCallback<TScope, TEvent> extends FormatterCallbackLike {
    (this: TScope, e: TEvent): string;
}

export interface FormatterCallbackLike extends Function {
    // interface to add function members
}

/* *
 *
 *  Export
 *
 * */

export default Callback;

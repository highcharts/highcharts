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

export interface Callback<TScope, TReturn> extends CallbackLike {
    (this: TScope): TReturn;
}

export interface CallbackLike {
    (this: any): any;
}

export interface EventCallback<TScope, TEvent extends object> extends EventCallbackLike {
    (this: TScope, e: TEvent): (boolean|void);
}

export interface EventCallbackLike {
    (this: any, e: object): (boolean|void);
}

export interface FormatterCallback<TScope, TEvent extends object> extends Callback<TScope, string> {
    (this: TScope, e: TEvent): string;
}

export interface FormatterCallbackLike {
    (this: any, e: object): string;
}

/* *
 *
 *  Export
 *
 * */

export default Callback;

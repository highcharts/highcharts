/* *
 *
 *  (c) 2010-2025 Highsoft AS
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

export interface Callback<TScope, TReturn> extends CallbackLike {
    (this: TScope): TReturn;
}

export interface CallbackLike {
    (this: any): any;
}

export interface EventCallback<TScope, TEvent extends object> extends EventCallbackBase {
    (this: TScope, e: TEvent): (boolean|void);
}

export interface EventCallbackBase {
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

/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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

/**
 * Generic callback function.
 *
 * @callback Highcharts.Callback
 *
 * @param {TScope} this
 * The context for the callback.
 *
 * @return {TReturn}
 * Return value.
 */
export interface Callback<TScope, TReturn> {
    (this: TScope): TReturn;
}

/**
 * Generic event callback function.
 *
 * @callback Highcharts.EventCallback
 *
 * @param {TScope} this
 * The context for the callback.
 *
 * @param {TEvent} e
 * Event argument.
 *
 * @return {boolean|void}
 * Return value.
 */
export interface EventCallback<TScope, TEvent=AnyRecord|Event> {
    (this: TScope, e: TEvent): (boolean|void);
}

/**
 * Generic formatter callback function.
 *
 * @callback Highcharts.FormatterCallback
 *
 * @param {TScope} this
 * The context for the callback.
 *
 * @param {TEvent} e
 * Event argument.
 *
 * @return {string}
 * Return value.
 */
export interface FormatterCallback<TScope, TEvent=unknown> {
    (this: TScope, e: TEvent): string;
}

/* *
 *
 *  Export
 *
 * */

export default Callback;

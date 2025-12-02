/* *
 *
 *  (c) 2010-2025 Highsoft AS
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

export interface EventCallback<T> {
    (this: T, eventArguments: (AnyRecord|Event)): (boolean|void);
}

/* *
 *
 *  Export
 *
 * */

export default EventCallback;

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

export interface EventCallback<T> {
    (this: T, eventArguments: (AnyRecord|Event)): (boolean|void);
}

/* *
 *
 *  Export
 *
 * */

export default EventCallback;

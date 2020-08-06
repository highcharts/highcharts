/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

declare interface DataEventEmitter<TEventTypes extends string> {

    emit(
        type: TEventTypes,
        e: DataEventEmitter.EventObject<TEventTypes>
    ): void;

    on(
        type: TEventTypes,
        callback: DataEventEmitter.EventCallback<this, TEventTypes>
    ): Function;

}

declare namespace DataEventEmitter {

    export interface EventCallback<TThis, TEventTypes> {
        (this: TThis, e: DataEventEmitter.EventObject<TEventTypes>): void;
    }

    export interface EventObject<TEventTypes> {
        readonly type?: TEventTypes;
    }
}

export default DataEventEmitter;

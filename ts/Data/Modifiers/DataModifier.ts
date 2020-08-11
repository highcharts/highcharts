/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';
import type DataJSON from '../DataJSON';
import type DataTable from '../DataTable';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    merge
} = U;

/** eslint-disable valid-jsdoc */

/* *
 *
 *  Class
 *
 * */

abstract class DataModifier implements DataEventEmitter {

    /* *
     *
     *  Static Properties
     *
     * */

    private static readonly nameRegExp = /^function\s+(\w*?)(?:DataModifier)?\s*\(/;

    private static readonly registry: Record<string, typeof DataModifier> = {};

    /* *
     *
     *  Static Functions
     *
     * */

    public static addModifier(modifier: typeof DataModifier): boolean {
        const name = DataModifier.getName(modifier),
            registry = DataModifier.registry;

        if (
            !name ||
            registry[name]
        ) {
            return false;
        }

        registry[name] = modifier;

        return true;
    }

    public static getAllModifiers(): Record<string, typeof DataModifier> {
        return merge(DataModifier.registry);
    }

    public static getModifier(
        name: string,
        options: DataModifier.Options
    ): (DataModifier|undefined) {
        const Class = DataModifier.registry[name] as unknown as DataModifier.ClassConstructor;

        if (Class) {
            return new Class(options);
        }

        return;
    }

    private static getName(modifier: (typeof DataModifier|Function)): string {
        return (
            modifier.toString().match(DataModifier.nameRegExp) ||
            ['', '']
        )[1];
    }

    /* *
     *
     *  Properties
     *
     * */

    public abstract readonly options: DataModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    public abstract execute(table: DataTable): DataTable;

    public emit(
        type: DataModifier.EventTypes,
        e?: DataModifier.EventObject
    ): void {
        fireEvent(this, type, e);
    }

    public on(
        type: DataModifier.EventTypes,
        callback: DataModifier.EventCallback
    ): Function {
        return addEvent(this, type, callback);
    }

    public abstract toJSON(): DataModifier.ClassJSON;

}

/* *
 *
 *  Namespace
 *
 * */

namespace DataModifier {

    export type EventTypes = ('execute'|'afterExecute');

    export interface ClassConstructor {
        new(options?: DeepPartial<Options>): DataModifier;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: Options;
    }

    export interface EventCallback extends DataEventEmitter.EventCallback {
        (this: DataModifier, e: EventObject): void;
    }

    export interface EventObject extends DataEventEmitter.EventObject {
        readonly table: DataTable;
    }

    export interface Options extends DataJSON.Object {
        modifier: string;
    }

}

export default DataModifier;

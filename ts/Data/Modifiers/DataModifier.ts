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

/* *
 *
 *  Imports
 *
 * */

import type DataTable from '../DataTable';
import DataJSON from '../DataJSON.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    merge
} = U;

/** eslint-disable valid-jsdoc */

/* *
 *
 *  Class
 *
 * */

class DataModifier implements DataJSON.Class {

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

    public static fromJSON(json: DataModifier.ClassJSON): DataModifier {
        return new DataModifier(json.options);
    }

    public static getAllModifiers(): Record<string, typeof DataModifier> {
        return merge(DataModifier.registry);
    }

    public static getModifier(
        name: string,
        options: DataModifier.Options
    ): (DataModifier|undefined) {
        const Class = DataModifier.registry[name];

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
     *  Constructors
     *
     * */

    protected constructor(options?: DeepPartial<DataModifier.Options>) {
        const defaultOptions: DataModifier.Options = {
            modifier: DataModifier.getName(this.constructor)
        };

        this.options = merge(defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly options: DataModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    public execute(table: DataTable): DataTable {
        return table;
    }

    public on(
        eventName: DataModifier.EventNames,
        callback: DataModifier.EventCallback
    ): Function {
        return addEvent(this, eventName, callback);
    }

    public toJSON(): DataModifier.ClassJSON {
        return {
            $class: 'DataModifier',
            options: merge(this.options)
        };
    }

}

/* *
 *
 *  Namespace
 *
 * */

namespace DataModifier {

    export type EventNames = ('execute'|'afterExecute');

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: Options;
    }

    export interface EventCallback {
        (this: DataModifier, e: EventObject): void;
    }

    export interface EventObject {
        readonly type: EventNames;
    }

    export interface Options extends DataJSON.Object {
        modifier: string;
    }

}

DataJSON.addClass(DataModifier);

export default DataModifier;

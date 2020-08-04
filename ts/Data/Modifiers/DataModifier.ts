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

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataTable from '../DataTable';
import DataJSON from '../DataJSON';
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

abstract class DataModifier implements DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */

    public static _DATA_CLASS_NAME_ = 'DataModifier';

    private static registry: Record<string, DataModifier>;

    /* *
     *
     *  Static Functions
     *
     * */

    public static getModiferPool(): Record<string, DataModifier> {
        return merge(DataModifier.registry);
    }

    public static fromJSON(json: DataModifier.JSON): (DataJSON.Class|undefined) {
        return DataJSON.fromJSON(json);
    }

    public static registerModifier(modifier: DataModifier): void {
        DataModifier.registry[modifier.name] = modifier;
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(name: string) {
        this.name = name;
        DataModifier.registerModifier(this);
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly name: string;

    /* *
     *
     *  Functions
     *
     * */

    public abstract execute(dataTable: DataTable): DataTable;

    public on(
        eventName: DataModifier.EventNames,
        callback: DataModifier.EventCallback
    ): Function {
        return addEvent(this, eventName, callback);
    }

    public toJSON(): DataModifier.JSON {
        return {
            _DATA_CLASS_NAME_: 'DataModifier',
            name: this.name
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

    export interface EventCallback {
        (this: DataModifier, e: EventObject): void;
    }

    export interface EventObject {
        readonly type: EventNames;
    }

    export interface JSON extends DataJSON.ClassJSON {
        name: string;
    }

}

DataJSON.addClass(DataModifier);

export default DataModifier;

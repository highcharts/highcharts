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

import type DataEventEmitter from '../DataEventEmitter';
import type DataJSON from '../DataJSON';
import type DataTable from '../DataTable';
import type DataValueType from '../DataValueType';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent
} = U;

abstract class DataParser<TEventObject extends DataParser.EventObject>
implements DataEventEmitter<TEventObject>, DataJSON.Class {

    /* *
     *
     *  Functions
     *
     * */

    public abstract getTable(): DataTable;

    public emit(e: TEventObject): void {
        fireEvent(this, e.type, e);
    }

    public on(
        type: TEventObject['type'],
        callback: DataEventEmitter.EventCallback<this, TEventObject>
    ): Function {
        return addEvent(this, type, callback);
    }

    public abstract parse(options: DataParser.Options): void;

    public abstract toJSON(): DataJSON.ClassJSON;

}

namespace DataParser {

    export interface EventObject extends DataEventEmitter.EventObject {
        readonly type: ('parse'|'afterParse'|'parseError');
        readonly columns: DataValueType[][];
        readonly error?: (string|Error);
        readonly headers: string[];
    }

    export interface Options extends DataJSON.Object {
        // nothing here yet
    }

}

export default DataParser;

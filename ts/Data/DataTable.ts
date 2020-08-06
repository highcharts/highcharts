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

import type DataEventEmitter from './DataEventEmitter';
import DataJSON from './DataJSON.js';
import DataRow from './DataRow.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    uniqueKey
} = U;

/** eslint-disable valid-jsdoc */

/**
 * @private
 */
class DataTable implements DataEventEmitter<DataTable.EventTypes>, DataJSON.Class {

    /* *
     *
     *  Static Functions
     *
     * */

    public static fromJSON(json: DataTable.ClassJSON): DataTable {
        const rows = json.rows,
            dataRows: Array<DataRow> = [];

        try {
            for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
                dataRows[i] = DataRow.fromJSON(rows[i]);
            }
            return new DataTable(dataRows);
        } catch (error) {
            return new DataTable();
        }
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(rows: Array<DataRow> = []) {
        const rowsIdMap: Record<string, DataRow> = {};

        let row: DataRow;

        rows = rows.slice();

        this.id = uniqueKey();
        this.rows = rows;
        this.rowsIdMap = rowsIdMap;
        this.watchsIdMap = {};

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            row = rows[i];
            rowsIdMap[row.id] = row;
            this.watchRow(row);
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly id: string;

    private rows: Array<DataRow>;

    private rowsIdMap: Record<string, DataRow>;

    private versionId?: string;

    private watchsIdMap: Record<string, Array<Function>>;

    /* *
     *
     *  Functions
     *
     * */

    public clear(): void {

        this.emit('clearTable', { });

        const rowIds = this.getRowIds();

        for (let i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
            this.unwatchRow(rowIds[i], true);
        }

        this.rows.length = 0;
        this.rowsIdMap = {};
        this.watchsIdMap = {};

        this.emit('afterClearTable', { });
    }

    public deleteRow(id: string): (DataRow|undefined) {
        const row = this.rowsIdMap[id],
            rowId = row.id,
            index = this.rows.indexOf(row);

        this.emit('deleteRow', { index, row });

        this.rows[index] = row;
        delete this.rowsIdMap[rowId];
        this.unwatchRow(rowId);

        this.emit('afterDeleteRow', { index, row });

        return row;
    }

    public emit(type: DataTable.EventTypes, e: DataTable.EventObjects): void {
        fireEvent(this, type, e);
    }

    public getAllRows(): Array<DataRow> {
        return this.rows.slice();
    }

    public getRow(indexOrID: (number|string)): (DataRow|undefined) {

        if (typeof indexOrID === 'string') {
            return this.rowsIdMap[indexOrID];
        }

        return this.rows[indexOrID];
    }

    /**
     * @todo Consider implementation via property getter `.length` depending on
     *       browser support.
     * @return {number}
     * Number of rows in this table.
     */
    public getRowCount(): number {
        return this.rows.length;
    }

    public getRowIds(): Array<string> {
        return Object.keys(this.rowsIdMap);
    }

    public getVersionId(): string {
        return this.versionId || (this.versionId = uniqueKey());
    }

    public insertRow(row: DataRow): boolean {
        const rowId = row.id;
        const index = this.rows.length;

        if (typeof this.rowsIdMap[rowId] !== 'undefined') {
            return false;
        }

        this.emit('insertRow', { index, row });

        this.rows.push(row);
        this.rowsIdMap[rowId] = row;
        this.watchRow(row);

        this.emit('afterInsertRow', { index, row });

        return true;
    }

    public on(
        event: DataTable.EventTypes,
        callback: DataTable.EventCallbacks<this>
    ): Function {
        return addEvent(this, event, callback);
    }

    private watchRow(row: DataRow): void {
        const table = this,
            index = table.rows.indexOf(row),
            watchsIdMap = table.watchsIdMap,
            watchs: Array<Function> = [];

        /** @private */
        function callback(): void {
            table.versionId = uniqueKey();
            fireEvent(table, 'afterUpdateRow', { index, row });
        }

        watchs.push(row.on('afterClearRow', callback));
        watchs.push(row.on('afterDeleteColumn', callback));
        watchs.push(row.on('afterInsertColumn', callback));
        watchs.push(row.on('afterUpdateColumn', callback));

        watchsIdMap[row.id] = watchs;
    }

    public toJSON(): DataTable.ClassJSON {
        const json: DataTable.ClassJSON = {
            $class: 'DataTable',
            rows: []
        };
        const rows = this.rows;

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            json.rows.push(rows[i].toJSON());
        }

        return json;
    }

    public toString(): string {
        return JSON.stringify(this.rows);
    }

    private unwatchRow(rowId: string, skipDelete?: boolean): void {
        const watchsIdMap = this.watchsIdMap;
        const watchs = watchsIdMap[rowId] || [];

        for (let i = 0, iEnd = watchs.length; i < iEnd; ++i) {
            watchs[i]();
        }

        if (!skipDelete) {
            delete watchsIdMap[rowId];
        }
    }

}

namespace DataTable {

    export type EventCallbacks<TThis> = (RowEventCallback<TThis>|TableEventCallback<TThis>);

    export type EventObjects = (RowEventObject|TableEventObject);

    export type EventTypes = (RowEventTypes|TableEventTypes);

    export type RowEventTypes = (
        'deleteRow'|'afterDeleteRow'|
        'insertRow'|'afterInsertRow'|
        'afterUpdateRow'
    );

    export type TableEventTypes = (
        'clearTable'|'afterClearTable'
    );

    export interface ClassJSON extends DataJSON.ClassJSON {
        rows: Array<DataRow.ClassJSON>;
    }

    export interface RowEventCallback<TThis> extends DataEventEmitter.EventCallback<TThis, RowEventTypes> {
        (this: TThis, e: RowEventObject): void;
    }

    export interface RowEventObject extends DataEventEmitter.EventObject<RowEventTypes> {
        readonly index: number;
        readonly row: DataRow;
    }

    export interface TableEventCallback<TThis> extends DataEventEmitter.EventCallback<TThis, TableEventTypes> {
        (this: TThis, e: TableEventObject): void;
    }

    export interface TableEventObject extends DataEventEmitter.EventObject<TableEventTypes> {
    }

}

DataJSON.addClass(DataTable);

export default DataTable;

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
class DataTable {

    /* *
     *
     *  Static Functions
     *
     * */

    public static parse(json: DataTable.TableJSON): DataTable {
        try {
            const rows: Array<DataRow> = [];
            for (let i = 0, iEnd = json.length; i < iEnd; ++i) {
                rows[i] = DataTable.parseRow(json[i]);
            }
            return new DataTable(rows);
        } catch (error) {
            return new DataTable();
        }
    }

    private static parseRow(json: DataTable.TableRowJSON): DataRow {
        const columns: DataRow.Columns = { id: uniqueKey() };
        const keys = Object.keys(json);
        let key: (string|undefined);
        let value;
        while (typeof (key = keys.pop()) !== 'undefined') {
            value = json[key];
            if (value instanceof Array) {
                columns[key] = DataTable.parse(value);
            } else {
                columns[key] = value;
            }
        }
        return new DataRow(columns);
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(rows: Array<DataRow> = []) {
        this.id = uniqueKey();
        this.rows = rows.slice();
        this.rowsIdMap = {};
        this.watchsIdMap = {};

        const rowsIdMap: Record<string, DataRow> = this.rowsIdMap = {};
        let row: DataRow;

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            row = rows[i];
            rowsIdMap[row.id] = row;
            this.insert(row);
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

    private watchsIdMap: Record<string, Function>;

    /* *
     *
     *  Functions
     *
     * */

    public clear(): void {
        const rowIds = this.getRowIds();
        for (var i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
            this.delete(rowIds[i]);
        }
    }

    public delete(id: string): DataRow {
        const table = this;
        const row = table.rowsIdMap[id];
        const rowId = row.id;
        const index = table.rows.indexOf(row);
        fireEvent(
            table,
            'deleteRow',
            { index, row },
            function (): void {
                table.rows[index] = row;
                delete table.rowsIdMap[rowId];
                table.unwatch(rowId);
                fireEvent(table, 'afterDeleteRow', { index, row });
            }
        );
        return row;
    }

    public getAllRows(): Array<DataRow> {
        return this.rows.slice();
    }

    public getById(id: string): (DataRow|undefined) {
        return this.rowsIdMap[id];
    }

    public getByIndex(index: number): (DataRow|undefined) {
        return this.rows[index];
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

    public insert(row: DataRow): boolean {
        const table = this;
        const index = table.rows.length;
        if (typeof table.rowsIdMap[row.id] !== 'undefined') {
            return false;
        }
        fireEvent(
            table,
            'insertRow',
            { index, row },
            function (): void {
                table.rows.push(row);
                table.rowsIdMap[row.id] = row;
                table.watch(row);
                fireEvent(table, 'afterInsertRow', { index, row });
            }
        );
        return true;
    }

    public on(
        event: DataTable.RowEvents,
        callback: DataTable.RowEventListener
    ): Function {
        return addEvent(this, event, callback);
    }

    private watch(row: DataRow): void {
        const table = this;
        const index = table.rows.indexOf(row);
        const watchsIdMap = table.watchsIdMap;
        watchsIdMap[row.id] = row.on(
            'afterUpdateColumn',
            function (): void {
                table.versionId = uniqueKey();
                fireEvent(table, 'afterUpdateRow', { index, row });
            }
        );
    }

    public toString(): string {
        return JSON.stringify(this.rows);
    }

    private unwatch(rowId: string): void {
        const watchsIdMap = this.watchsIdMap;
        if (watchsIdMap[rowId]) {
            watchsIdMap[rowId]();
            delete watchsIdMap[rowId];
        }
    }

}

namespace DataTable {
    export type RowEvents = ('afterDeleteRow'|'afterInsertRow'|'afterUpdateRow'|'deleteRow'|'insertRow');
    export interface RowEventListener {
        (this: DataTable, e: RowEventObject): void;
    }
    export interface RowEventObject {
        readonly index: number;
        readonly row: DataRow;
    }
    export interface TableJSON extends Array<TableRowJSON> {
        [key: number]: TableRowJSON;
    }
    export interface TableRowJSON {
        [key: string]: (boolean|null|number|string|TableJSON);
    }
}

export default DataTable;

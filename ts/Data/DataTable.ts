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
        const columns: DataRow.Columns = {};
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
        const table = this;
        const row = table.getRow(0);
        const index = 0;
        fireEvent(
            table,
            'clearTable',
            { index, row },
            function (): void {
                const rowIds = table.getRowIds();
                for (let i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
                    table.unwatchRow(rowIds[i], true);
                }
                table.rows.length = 0;
                table.rowsIdMap = {};
                table.watchsIdMap = {};
                fireEvent(table, 'afterClearTable', { index, row });
            }
        );
    }

    public deleteRow(id: string): (DataRow|undefined) {
        const table = this;
        const row = table.rowsIdMap[id];
        const index = table.rows.indexOf(row);

        let result: (DataRow|undefined);

        fireEvent(
            table,
            'deleteRow',
            { index, row },
            function (): void {
                const rowId = row.id;
                table.rows[index] = row;
                delete table.rowsIdMap[rowId];
                table.unwatchRow(rowId);
                result = row;
                fireEvent(table, 'afterDeleteRow', { index, row });
            }
        );

        return result;
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
        const table = this;
        const rowId = row.id;
        const index = table.rows.length;

        let succeeded = false;

        if (typeof table.rowsIdMap[rowId] !== 'undefined') {
            return succeeded;
        }

        fireEvent(
            table,
            'insertRow',
            { index, row },
            function (): void {
                table.rows.push(row);
                table.rowsIdMap[rowId] = row;
                table.watchRow(row);
                succeeded = true;
                fireEvent(table, 'afterInsertRow', { index, row });
            }
        );

        return succeeded;
    }

    public on(
        event: DataTable.RowEvents,
        callback: DataTable.RowEventListener
    ): Function {
        return addEvent(this, event, callback);
    }

    private watchRow(row: DataRow): void {

        /** @private */
        function callback(): void {
            table.versionId = uniqueKey();
            fireEvent(table, 'afterUpdateRow', { index, row });
        }

        const table = this;
        const index = table.rows.indexOf(row);
        const watchsIdMap = table.watchsIdMap;
        const watchs: Array<Function> = [];

        watchs.push(row.on('afterClearRow', callback));
        watchs.push(row.on('afterDeleteColumn', callback));
        watchs.push(row.on('afterInsertColumn', callback));
        watchs.push(row.on('afterUpdateColumn', callback));

        watchsIdMap[row.id] = watchs;
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
    export type RowEvents = (
        'clearTable'|'afterClearTable'|
        'deleteRow'|'afterDeleteRow'|
        'insertRow'|'afterInsertRow'|
        'afterUpdateRow'
    );
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

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
        this.id = uniqueKey();
        this.rows = rows;
        this.absoluteLength = rows.length;
        this.relativeLength = rows.length;
        this.relativeStart = 0;
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly id: string;

    public absoluteLength: number;

    public relativeLength: number;

    public relativeStart: number;

    private rows: Array<DataRow>;

    private version?: number;

    /* *
     *
     *  Functions
     *
     * */

    private absolutePosition(relativeIndex: number): number {
        if (
            relativeIndex < 0 &&
            this.relativeStart < Math.abs(relativeIndex)
        ) {
            return this.absoluteLength + this.relativeStart + relativeIndex;
        }
        return this.relativeStart + relativeIndex;
    }

    public clear(): void {
        this.rows.length = 0;
    }

    public getAbsolute(index: number): DataRow {
        return this.rows[index];
    }

    public getRelative(index: number): DataRow {
        return this.rows[this.absolutePosition(index)];
    }

    public getVersion(): number {
        return this.version || (this.version = 0);
    }

    public setAbsolute(
        dataRow: DataRow,
        index: number = this.absoluteLength
    ): number {
        const table = this;
        fireEvent(
            table,
            'newDataRow',
            { dataRow, index },
            function (e: DataTable.RowEventObject): void {
                table.rows[e.index] = e.dataRow;
                table.absoluteLength = table.rows.length;
            }
        );
        return index;
    }

    public setRelative(
        dataRow: DataRow,
        index: number = this.relativeLength
    ): number {
        const table = this;
        index = table.absolutePosition(index);
        fireEvent(
            table,
            'newDataRow',
            { dataRow, index },
            function (e: DataTable.RowEventObject): void {
                table.rows[e.index] = e.dataRow;
                table.absoluteLength = table.rows.length;
                ++table.relativeLength;
            }
        );
        return index;
    }

    public toString(): string {
        return JSON.stringify(this.rows);
    }

}

namespace DataTable {
    export interface RowEventObject {
        dataRow: DataRow;
        index: number;
    }
    export interface TableJSON extends Array<TableRowJSON> {
        [key: number]: TableRowJSON;
    }
    export interface TableRowJSON {
        [key: string]: (boolean|null|number|string|TableJSON);
    }
}

export default DataTable;

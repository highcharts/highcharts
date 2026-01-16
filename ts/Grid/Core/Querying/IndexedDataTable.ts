/* *
 *
 *  Grid Indexed Data Table class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { TypedArrayConstructor } from '../../../Shared/Types';

import DataTable from '../../../Data/DataTable.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Lightweight DataTable view that maps local row indexes to original ones
 * without copying column data.
 */
class IndexedDataTable extends DataTable {

    /* *
     *
     *  Properties
     *
     * */

    private readonly indices: number[];
    private columnViews?: Record<string, DataTable.Column>;
    private readonly source: DataTable;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(source: DataTable, indices: number[]) {
        super({});

        // Reuse source columns without copying.
        (this as { columns: Record<string, DataTable.Column> }).columns =
            source.columns;

        this.source = source;
        this.indices = indices;
        this.rowCount = indices.length;
        this.setOriginalRowIndexes(indices);
    }


    /* *
     *
     *  Methods
     *
     * */

    protected override applyRowCount(rowCount: number): void {
        this.rowCount = rowCount;
    }

    private getMappedIndex(index: number): number {
        return this.indices[index] ?? index;
    }

    private getColumnValue(
        column: DataTable.Column,
        index: number
    ): DataTable.CellType {
        return (column as DataTable.BasicColumn)[index] as DataTable.CellType;
    }

    private setColumnValue(
        column: DataTable.Column,
        index: number,
        value: DataTable.CellType
    ): void {
        (column as DataTable.BasicColumn)[index] = value;
    }

    private getColumnView(
        columnId: string,
        column: DataTable.Column
    ): DataTable.Column {
        this.columnViews ??= {} as Record<string, DataTable.Column>;
        const existing = this.columnViews[columnId];
        if (existing) {
            return existing;
        }

        const indices = this.indices;
        const table = this;
        const view = new Proxy(column, {
            get(
                target: DataTable.Column,
                prop: string | symbol,
                receiver: unknown
            ): unknown {
                if (prop === 'length') {
                    return table.rowCount;
                }
                if (typeof prop === 'string') {
                    const index = Number(prop);
                    if (!Number.isNaN(index)) {
                        const mapped = indices[index];
                        return table.getColumnValue(target, mapped);
                    }
                }
                return Reflect.get(target, prop, receiver);
            }
        });

        this.columnViews[columnId] = view as DataTable.Column;
        return view as DataTable.Column;
    }

    public override getColumn(
        columnId: string,
        asReference?: boolean
    ): (DataTable.Column | undefined) {
        return this.getColumns([columnId], asReference)[columnId];
    }

    public override getColumns(
        columnIds?: Array<string>,
        asReference?: boolean,
    ): DataTable.ColumnCollection;
    public override getColumns(
        columnIds: (Array<string> | undefined),
        asReference: true
    ): Record<string, DataTable.Column>;
    public override getColumns(
        columnIds: (Array<string> | undefined),
        asReference: false,
        asBasicColumns: true
    ): Record<string, DataTable.BasicColumn>;
    public override getColumns(
        columnIds?: Array<string>,
        asReference?: boolean,
        asBasicColumns?: boolean
    ): DataTable.ColumnCollection {
        const columns = this.columns;
        const ids = columnIds || Object.keys(columns);
        const result: DataTable.ColumnCollection = {};
        const rowCount = this.rowCount;

        for (const columnId of ids) {
            const column = columns[columnId];
            if (!column) {
                continue;
            }

            if (asReference) {
                result[columnId] = this.getColumnView(columnId, column);
                continue;
            }

            if (
                !asBasicColumns &&
                ArrayBuffer.isView(column) &&
                !(column instanceof DataView)
            ) {
                const ArrayConstructor = Object.getPrototypeOf(column)
                    .constructor as TypedArrayConstructor | ArrayConstructor;
                const copy = new ArrayConstructor(rowCount) as DataTable.Column;
                for (let i = 0; i < rowCount; i++) {
                    const value = this.getColumnValue(
                        column,
                        this.getMappedIndex(i)
                    );
                    this.setColumnValue(copy, i, value);
                }
                result[columnId] = copy;
                continue;
            }

            const copy = new Array(rowCount);
            for (let i = 0; i < rowCount; i++) {
                const value = this.getColumnValue(
                    column,
                    this.getMappedIndex(i)
                );
                this.setColumnValue(copy, i, value);
            }
            result[columnId] = copy as DataTable.Column;
        }

        return result;
    }

    public override getRowObjects(
        rowIndex: number = 0,
        rowCount: number = (this.rowCount - rowIndex),
        columnIds?: Array<string>
    ): (Array<DataTable.RowObject>) {
        const columns = this.columns;
        const ids = columnIds || Object.keys(columns);
        const max = Math.min(this.rowCount, rowIndex + rowCount);
        const rows: Array<DataTable.RowObject> = new Array(
            Math.max(0, max - rowIndex)
        );

        for (
            let i = rowIndex,
                i2 = 0;
            i < max;
            ++i, ++i2
        ) {
            const row: DataTable.RowObject = rows[i2] = {};
            const mappedIndex = this.getMappedIndex(i);

            for (const columnId of ids) {
                const column = columns[columnId];
                row[columnId] = column ?
                    this.getColumnValue(column, mappedIndex) :
                    void 0;
            }
        }

        return rows;
    }

    public override getRows(
        rowIndex: number = 0,
        rowCount: number = (this.rowCount - rowIndex),
        columnIds?: Array<string>
    ): (Array<DataTable.Row>) {
        const columns = this.columns;
        const ids = columnIds || Object.keys(columns);
        const max = Math.min(this.rowCount, rowIndex + rowCount);
        const rows: Array<DataTable.Row> = new Array(
            Math.max(0, max - rowIndex)
        );

        for (
            let i = rowIndex,
                i2 = 0;
            i < max;
            ++i, ++i2
        ) {
            const row: DataTable.Row = rows[i2] = [];
            const mappedIndex = this.getMappedIndex(i);

            for (const columnId of ids) {
                const column = columns[columnId];
                row.push(
                    column ?
                        this.getColumnValue(column, mappedIndex) :
                        void 0
                );
            }
        }

        return rows;
    }

    public override getVersionTag(): string {
        return this.source.getVersionTag();
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default IndexedDataTable;

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

import type DataValueType from '../DataValueType.js';

import DataParser from './DataParser.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';

const { fireEvent, merge } = U;

class HTMLTableParser extends DataParser {
    protected static readonly defaultOptions: HTMLTableParser.Options = {
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE,
        firstRowAsNames: true
    };

    constructor(
        dataTable: DataTable = new DataTable()
    ) {
        super();
        this.dataTable = dataTable;
        this.options = HTMLTableParser.defaultOptions;
    }
    private columns?: DataValueType[][];
    private headers?: string[];
    private dataTable: DataTable;
    public options: HTMLTableParser.Options;

    public parse(options: Partial<HTMLTableParser.Options>): void {
        this.options = merge(options, HTMLTableParser.defaultOptions);
        const columns: [] = [],
            headers: string[] = [],
            store = this,
            {
                startRow,
                endRow,
                startColumn,
                endColumn,
                tableElement
            } = store.options;

        if (!(tableElement instanceof HTMLElement)) {
            fireEvent(this, 'fail', {
                error: 'Not a valid HTML Table'
            });
            return;
        }

        let colsCount: number,
            rowNo: number,
            colNo: number,
            item: Element;
        const rows = tableElement.getElementsByTagName('tr'),
            rowsCount = rows.length;

        rowNo = 0;

        while (rowNo < rowsCount) {
            if (rowNo >= startRow && rowNo <= endRow) {

                const cols = rows[rowNo].children;
                colsCount = cols.length;
                colNo = 0;

                while (colNo < colsCount) {
                    const row = (columns as any)[colNo - startColumn];
                    item = cols[colNo];
                    let i = 1;

                    if (
                        (
                            item.tagName === 'TD' ||
                            item.tagName === 'TH'
                        ) &&
                        colNo >= startColumn &&
                        colNo <= endColumn
                    ) {
                        if (!(columns as any)[colNo - startColumn]) {
                            (columns as any)[colNo - startColumn] = [];
                        }

                        if (item.tagName === 'TH') {
                            headers.push(item.innerHTML);
                        }

                        (columns as any)[colNo - startColumn][
                            rowNo - startRow
                        ] = item.innerHTML;

                        // Loop over all previous indices and make sure
                        // they are nulls, not undefined.
                        while (
                            rowNo - startRow >= i &&
                            row[rowNo - startRow - i] === void 0
                        ) {
                            row[rowNo - startRow - i] = null;
                            i++;
                        }
                    }

                    colNo++;
                }
            }

            rowNo++;
        }
        this.columns = columns;
        this.headers = headers;
    }

    public getTable(): DataTable {
        return DataTable.fromColumns(this.columns, this.headers);
    }


}
namespace HTMLTableParser {
    export interface Options {
        tableElement?: HTMLElement;
        firstRowAsNames: boolean;
        startRow: number;
        endRow: number;
        startColumn: number;
        endColumn: number;
    }
}

export default HTMLTableParser;

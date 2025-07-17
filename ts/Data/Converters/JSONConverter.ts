/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Pawel Lysy
 *  - Kamil Kubik
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEvent from '../DataEvent';
import type { ColumnNamesOptions } from '../Connectors/JSONConnectorOptions';
import type JSONConverterOptions from './JSONConverterOptions';

import DataConverter from './DataConverter.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const { error, isArray, merge, objectEach } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Handles parsing and transforming JSON to a table.
 *
 * @private
 */
class JSONConverter extends DataConverter {
    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options
     */
    protected static readonly defaultOptions: JSONConverterOptions = {
        ...DataConverter.defaultOptions,
        data: [],
        orientation: 'rows'
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the JSON parser.
     *
     * @param {Partial<JSONConverterOptions>} [options]
     * Options for the JSON parser.
     */
    public constructor(options?: Partial<JSONConverterOptions>) {
        const mergedOptions = merge(JSONConverter.defaultOptions, options);

        super(mergedOptions);

        this.options = mergedOptions;
        this.table = new DataTable();
    }

    /* *
     *
     *  Properties
     *
     * */

    private columns: DataTable.BasicColumn[] = [];
    private headers: string[] | ColumnNamesOptions = [];

    /**
     * Options for the DataConverter.
     */
    public readonly options: JSONConverterOptions;

    private table: DataTable;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initiates parsing of JSON structure.
     *
     * @param {Partial<JSONConverterOptions>}[options]
     * Options for the parser
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits JSONConverter#parse
     * @emits JSONConverter#afterParse
     */
    public parse(
        options: Partial<JSONConverterOptions>,
        eventDetail?: DataEvent.Detail
    ): void {
        const converter = this;

        options = merge(converter.options, options);

        const {
            beforeParse,
            orientation,
            firstRowAsNames,
            columnNames
        } = options;
        let data = options.data;

        if (!data) {
            return;
        }

        converter.columns = [];

        converter.emit({
            type: 'parse',
            columns: converter.columns,
            detail: eventDetail,
            headers: converter.headers
        });

        if (beforeParse) {
            data = beforeParse(data);
        }

        data = data.slice();

        if (orientation === 'columns') {
            for (let i = 0, iEnd = data.length; i < iEnd; i++) {
                const item = data[i];

                if (!(item instanceof Array)) {
                    return;
                }

                if (converter.headers instanceof Array) {
                    if (firstRowAsNames) {
                        converter.headers.push(`${item.shift()}`);
                    } else if (columnNames && columnNames instanceof Array) {
                        converter.headers.push(columnNames[i]);
                    }

                    converter.table.setColumn(
                        converter.headers[i] || i.toString(),
                        item
                    );
                } else {
                    error(
                        'JSONConverter: Invalid `columnNames` option.',
                        false
                    );
                }
            }
        } else if (orientation === 'rows') {
            if (firstRowAsNames) {
                converter.headers = data.shift() as string[];
            } else if (columnNames) {
                converter.headers = columnNames;
            }

            for (
                let rowIndex = 0, iEnd = data.length;
                rowIndex < iEnd;
                rowIndex++
            ) {
                let row = data[rowIndex];

                if (isArray(row)) {
                    for (
                        let columnIndex = 0, jEnd = row.length;
                        columnIndex < jEnd;
                        columnIndex++
                    ) {
                        if (converter.columns.length < columnIndex + 1) {
                            converter.columns.push([]);
                        }
                        converter.columns[columnIndex].push(
                            row[columnIndex]
                        );
                        if (converter.headers instanceof Array) {
                            this.table.setColumn(
                                converter.headers[columnIndex] ||
                                    columnIndex.toString(),
                                converter.columns[columnIndex]
                            );
                        } else {
                            error(
                                'JSONConverter: Invalid `columnNames` option.',
                                false
                            );
                        }
                    }
                } else {
                    const columnNames = converter.headers;

                    if (columnNames && !(columnNames instanceof Array)) {
                        const newRow = {} as Record<string, string | number>;

                        objectEach(
                            columnNames,
                            (
                                arrayWithPath: (string | number)[],
                                name
                            ): void => {
                                newRow[name] = arrayWithPath.reduce(
                                    (acc: any, key: string | number): any =>
                                        acc[key], row
                                );
                            });

                        row = newRow;
                    }

                    this.table.setRows([row], rowIndex);
                }
            }
        }

        converter.emit({
            type: 'afterParse',
            columns: converter.columns,
            detail: eventDetail,
            headers: converter.headers
        });
    }

    /**
     * Handles converting the parsed data to a table.
     *
     * @return {DataTable}
     * Table from the parsed CSV.
     */
    public getTable(): DataTable {
        return this.table;
    }

}

/* *
 *
 *  Registry
 *
 * */

declare module './DataConverterType' {
    interface DataConverterTypes {
        JSON: typeof JSONConverter;
    }
}

DataConverter.registerType('JSON', JSONConverter);

/* *
 *
 *  Default Export
 *
 * */

export default JSONConverter;

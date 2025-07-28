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
import type { ColumnIdsOptions } from '../Connectors/JSONConnectorOptions';
import type JSONConverterOptions from './JSONConverterOptions';

import DataConverter from './DataConverter.js';
import DataConverterUtils from './DataConverterUtils.js';
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
    }

    /* *
     *
     *  Properties
     *
     * */

    private columns: DataTable.BasicColumn[] = [];
    private headerColumnIds: string[] | ColumnIdsOptions = [];
    private headers: string[] = [];


    /**
     * Options for the DataConverter.
     */
    public readonly options: JSONConverterOptions;

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
            columnIds
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
                    } else if (columnIds && columnIds instanceof Array) {
                        converter.headers.push(columnIds[i]);
                    }

                    this.columns.push(item);

                } else {
                    error(
                        'JSONConverter: Invalid `columnIds` option.',
                        false
                    );
                }
            }
        } else if (orientation === 'rows') {
            if (firstRowAsNames) {
                converter.headers = data.shift() as string[];
            } else if (columnIds) {
                converter.headerColumnIds = columnIds;
            }

            for (
                let rowIndex = 0, iEnd = data.length;
                rowIndex < iEnd;
                rowIndex++
            ) {
                let row = data[rowIndex];

                if (!isArray(row)) {
                    if (columnIds && !(columnIds instanceof Array)) {
                        const newRow: (string | number)[] = [];

                        objectEach(
                            columnIds,
                            (
                                arrayWithPath: (string | number)[],
                                name
                            ): void => {
                                newRow.push(arrayWithPath.reduce(
                                    (acc: any, key: string | number): any =>
                                        acc[key], row
                                ));
                                if (converter.headers.indexOf(name) < 0) {
                                    converter.headers.push(name);
                                }
                            });

                        row = newRow;
                    } else {
                        row = Object.values(data[rowIndex]);
                        converter.headerColumnIds = Object.keys(data[rowIndex]);
                    }
                }

                for (
                    let columnIndex = 0,
                        jEnd = (row as Array<string|number>).length;
                    columnIndex < jEnd;
                    columnIndex++
                ) {
                    if (converter.columns.length < columnIndex + 1) {
                        converter.columns.push([]);
                    }

                    converter.columns[columnIndex].push(
                        (row as Array<string|number>)[columnIndex]
                    );

                    // Create headers only once.
                    if (!firstRowAsNames && rowIndex === 0) {
                        if (
                            converter.headerColumnIds instanceof Array
                        ) {
                            converter.headers.push(
                                converter.headerColumnIds[columnIndex] ||
                                columnIndex.toString()
                            );
                        } else {
                            error(
                                'JSONConverter: Invalid `columnIds` option.',
                                false
                            );
                        }
                    }
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
        const { columns, headers } = this;

        return DataConverterUtils.getTableFromColumns(
            columns,
            headers
        );
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

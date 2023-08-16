/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Pawel Lysy
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEvent from '../DataEvent';
import type DataConnector from '../Connectors/DataConnector';

import DataConverter from './DataConverter.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Handles parsing and transforming CSV to a table.
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
    protected static readonly defaultOptions: JSONConverter.Options = {
        ...DataConverter.defaultOptions,
        data: [],
        orientation: 'columns'
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the CSV parser.
     *
     * @param {JSONConverter.UserOptions} [options]
     * Options for the CSV parser.
     */
    public constructor(
        options?: JSONConverter.UserOptions
    ) {
        const mergedOptions = merge(JSONConverter.defaultOptions, options);

        super(mergedOptions);

        this.options = mergedOptions;
    }

    /* *
     *
     *  Properties
     *
     * */

    private columns: Array<DataTable.Column> = [];
    private headers: Array<string> = [];
    private dataTypes: Array<Array<string>> = [];
    /**
     * Options for the DataConverter.
     */
    public readonly options: JSONConverter.Options;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Creates a CSV string from the datatable on the connector instance.
     *
     * @param {DataConnector} connector
     * Connector instance to export from.
     *
     * @param {JSONConverter.Options} [options]
     * Options used for the export.
     *
     * @return {string}
     * CSV string from the connector table.
     */
    public export(
        connector: DataConnector,
        options: JSONConverter.Options = this.options
    ): string {
        return '';
    }

    /**
     * Initiates parsing of JSON structure.
     *
     * @param {JSONConverter.UserOptions}[options]
     * Options for the parser
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits JSONConverter#parse
     * @emits JSONConverter#afterParse
     */
    public parse(
        options: JSONConverter.UserOptions,
        eventDetail?: DataEvent.Detail
    ): void {

        const converter = this;
        options = merge(converter.options, options);
        const { beforeParse, orientation, firstRowAsNames } = options;
        let data = options.data;

        if (data && beforeParse) {
            data = beforeParse(data);
        }

        if (!data) {
            return;
        }

        if (orientation === 'columns') {
            for (let i = 0, iEnd = data.length; i < iEnd; i++) {
                if (firstRowAsNames) {
                    converter.headers.push(data[i][0] as string);
                }
                converter.columns.push(data[i].slice(firstRowAsNames ? 1 : 0));
            }
        } else {
            let startRow = 0;
            if (firstRowAsNames) {
                converter.headers = data[0] as Array<string>;
                startRow++;
            }

            for (
                let rowIndex = startRow, iEnd = data.length;
                rowIndex < iEnd;
                rowIndex++
            ) {
                const row = data[rowIndex] as Array<string | number>;
                for (
                    let columnIndex = 0, jEnd = row.length;
                    columnIndex < jEnd;
                    columnIndex++
                ) {
                    if (converter.columns.length < columnIndex + 1) {
                        converter.columns.push([]);
                    }
                    converter.columns[columnIndex].push(
                        data[rowIndex][columnIndex]
                    );
                }
            }
        }

    }

    /**
     * Handles converting the parsed data to a table.
     *
     * @return {DataTable}
     * Table from the parsed CSV.
     */
    public getTable(): DataTable {
        return DataConverter.getTableFromColumns(this.columns, this.headers);
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace JSONConverter {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Interface for the BeforeParse callback function
     */
    export interface DataBeforeParseCallbackFunction {
        (data: Array<Array<string|number>>): Array<Array<string|number>>;
    }

    /**
     * Options for the CSV parser that are compatible with ClassJSON
     */
    export interface Options extends DataConverter.Options {
        data: Array<Array<number|string>>;
        orientation: 'columns'|'rows';
    }

    /**
     * Options that are not compatible with ClassJSON
     */
    export interface SpecialOptions {
        beforeParse?: DataBeforeParseCallbackFunction;
    }

    /**
     * Avaliable options of the JSONConverter.
     */
    export type UserOptions = Partial<(Options&SpecialOptions)>;

}

/* *
 *
 *  Default Export
 *
 * */

export default JSONConverter;

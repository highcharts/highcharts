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
import DataStore from '../DataStore.js';
import U from '../../Core/Utilities.js';
import CSVDataStore from '../CSVDataStore.js';

const { fireEvent, merge, addEvent } = U;
/* eslint-disable valid-jsdoc, require-jsdoc */

/**
 * @private
 */

class CSVDataParser extends DataParser implements DataParser {
    /*
     * Default options
     */
    protected static readonly defaultOptions: CSVDataParser.Options = {
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE,
        decimalPoint: '.',
        lineDelimiter: '\n',
        firstRowAsNames: true
    };

    public constructor(
        table: DataTable = new DataTable(),
        options: Partial<CSVDataStore.optionsType>
    ) {
        super();
        this.options = merge(options, CSVDataParser.defaultOptions);
        this.table = table;
        addEvent(this, 'afterParse', (e: DataStore.ParseEventObject): void => {
            this.columns = e.columns;
            this.headers = e.headers;
        });
    }

    private table: DataTable;
    private columns?: DataValueType[][];
    private headers?: string[];
    private options: CSVDataParser.Options;
    private guessedItemDelimiter?: string;
    private guessedDecimalPoint?: string;
    private decimalRegex?: RegExp;


    public parse(csv: string): void {
        const parser = this,
            {
                beforeParse,
                lineDelimiter,
                firstRowAsNames,
                itemDelimiter
            } = parser.options;
        let lines,
            rowIt = 0,
            {
                startRow,
                endRow
            } = parser.options,
            i: number,
            colsCount: number;

        this.columns = [];

        // todo parse should have a payload
        fireEvent(parser, 'parse', {}, function (): void {

            if (csv && beforeParse) {
                csv = beforeParse(csv);
            }

            if (csv) {
                lines = csv
                    .replace(/\r\n/g, '\n') // Unix
                    .replace(/\r/g, '\n') // Mac
                    .split(lineDelimiter);

                if (!startRow || startRow < 0) {
                    startRow = 0;
                }

                if (!endRow || endRow >= lines.length) {
                    endRow = lines.length - 1;
                }

                if (!itemDelimiter) {
                    parser.guessedItemDelimiter = parser.guessDelimiter(lines);
                }

                var offset = 0;

                for (rowIt = startRow; rowIt <= endRow; rowIt++) {
                    if (lines[rowIt][0] === '#') {
                        offset++;
                    } else {
                        parser.parseCSVRow(lines[rowIt], rowIt - startRow - offset);
                    }
                }
            }

            if (firstRowAsNames && parser.columns) {
                colsCount = parser.columns.length;

                for (i = 0; i < colsCount; i++) {
                    if (!parser.headers) {
                        parser.headers = [];
                    }
                    parser.headers[i] = '' + parser.columns[i][0];
                }
            }

            fireEvent(parser, 'afterParse', { columns: parser.columns, headers: parser.headers });
        });
    }

    private parseCSVRow(
        columnStr: string,
        rowNumber: number
    ): void {
        const parser = this,
            columns = parser.columns || [],
            { startColumn, endColumn } = parser.options,
            itemDelimiter = parser.options.itemDelimiter || parser.guessedItemDelimiter;
        let i = 0,
            c = '',
            cl = '',
            cn = '',
            token = '',
            actualColumn = 0,
            column = 0;

        /**
         * @private
         */
        function read(j: number): void {
            c = columnStr[j];
            cl = columnStr[j - 1];
            cn = columnStr[j + 1];
        }

        /**
         * @private
         */
        function push(): void {
            if (startColumn > actualColumn || actualColumn > endColumn) {
                // Skip this column, but increment the column count (#7272)
                ++actualColumn;
                token = '';
                return;
            }

            if (columns.length < column + 1) {
                columns.push([]);
            }


            columns[column][rowNumber] = token;

            token = '';
            ++column;
            ++actualColumn;
        }

        if (!columnStr.trim().length) {
            return;
        }

        if (columnStr.trim()[0] === '#') {
            return;
        }

        for (; i < columnStr.length; i++) {
            read(i);

            // Quoted string
            if (c === '#') {
                // The rest of the row is a comment
                push();
                return;
            }

            if (c === '"') {
                read(++i);

                while (i < columnStr.length) {
                    if (c === '"' && cl !== '"' && cn !== '"') {
                        break;
                    }

                    if (c !== '"' || (c === '"' && cl !== '"')) {
                        token += c;
                    }

                    read(++i);
                }

            } else if (c === itemDelimiter) {
                push();

                // Actual column data
            } else {
                token += c;
            }
        }

        push();

    }

    private guessDelimiter(lines: Array<string>): string {

        const { decimalPoint } = this.options;
        var points = 0,
            commas = 0,
            guessed: string;
        const potDelimiters: Record<string, number> = {
            ',': 0,
            ';': 0,
            '\t': 0
        };

        // TODO make this not a [].some
        lines.some(function (
            columnStr: string,
            i: number
        ): (boolean | undefined) {
            var inStr = false,
                c,
                cn,
                cl,
                token = '';


            // We should be able to detect dateformats within 13 rows
            if (i > 13) {
                return true;
            }

            for (var j = 0; j < columnStr.length; j++) {
                c = columnStr[j];
                cn = columnStr[j + 1];
                cl = columnStr[j - 1];

                if (c === '#') {
                    // Skip the rest of the line - it's a comment
                    return;
                }

                if (c === '"') {
                    if (inStr) {
                        if (cl !== '"' && cn !== '"') {
                            while (cn === ' ' && j < columnStr.length) {
                                cn = columnStr[++j];
                            }

                            // After parsing a string, the next non-blank
                            // should be a delimiter if the CSV is properly
                            // formed.

                            if (typeof potDelimiters[cn] !== 'undefined') {
                                potDelimiters[cn]++;
                            }

                            inStr = false;
                        }
                    } else {
                        inStr = true;
                    }
                } else if (typeof potDelimiters[c] !== 'undefined') {

                    token = token.trim();

                    if (!isNaN(Date.parse(token))) {
                        potDelimiters[c]++;
                    } else if (
                        isNaN(Number(token)) ||
                        !isFinite(Number(token))
                    ) {
                        potDelimiters[c]++;
                    }

                    token = '';

                } else {
                    token += c;
                }

                if (c === ',') {
                    commas++;
                }

                if (c === '.') {
                    points++;
                }
            }
        } as any);

        // Count the potential delimiters.
        // This could be improved by checking if the number of delimiters
        // equals the number of columns - 1

        if (potDelimiters[';'] > potDelimiters[',']) {
            guessed = ';';
        } else if (potDelimiters[','] > potDelimiters[';']) {
            guessed = ',';
        } else {
            // No good guess could be made..
            guessed = ',';
        }

        // Try to deduce the decimal point if it's not explicitly set.
        // If both commas or points is > 0 there is likely an issue
        if (!decimalPoint) {
            if (points > commas) {
                this.guessedDecimalPoint = '.';
            } else {
                this.guessedDecimalPoint = ',';
            }

            // Apply a new decimal regex based on the presumed decimal sep.
            this.decimalRegex = new RegExp(
                '^(-?[0-9]+)' +
                decimalPoint +
                '([0-9]+)$'
            );
        }

        return guessed;
    }

    // Todo: handle exisiting datatable
    public getTable(): DataTable {
        return this.columns ?
            this.columnArrayToDataTable(this.columns, this.headers) :
            new DataTable();
    }
}

namespace CSVDataParser {
    export interface Options {
        decimalPoint: string;
        itemDelimiter?: string;
        lineDelimiter: string;
        firstRowAsNames: boolean;
        startRow: number;
        endRow: number;
        startColumn: number;
        endColumn: number;
        beforeParse?: DataBeforeParseCallbackFunction;
        decimalRegex?: RegExp;
    }
    export interface DataBeforeParseCallbackFunction {
        (csv: string): string;
    }
}

export default CSVDataParser;

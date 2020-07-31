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

import DataStore from './DataStore.js';
import DataTable from './DataTable.js';
import DataParser from './DataParser.js';
import ajaxModule from '../Mixins/Ajax.js';

const { ajax } = ajaxModule;
/* eslint-disable valid-jsdoc, require-jsdoc */

/**
 * @private
 */

class CSVDataStore extends DataStore {


    /* *
    *
    *  Constructors
    *
    * */

    public constructor(
        dataSet: DataTable = new DataTable(),
        options: Highcharts.DataOptions = {}
    ) {
        super(dataSet);

        if (options.csv) {
            this.csv = options.csv;
        }
        if (options.csvURL) {
            this.csvURL = options.csvURL;
        }

        this.enablePolling = options.enablePolling || false;
        this.dataRefreshRate = options.dataRefreshRate || 1;

        this.decimalPoint = options.decimalPoint || '.';
        this.itemDelimiter = options.itemDelimiter;
        this.lineDelimiter = options.lineDelimiter || '\n';
        this.firstRowAsNames = options.firstRowAsNames || true;

        this.startRow = options.startRow || 0;
        this.endRow = options.endRow || Number.MAX_VALUE;
        this.startColumn = options.startColumn || 0;
        this.endColumn = options.endColumn || Number.MAX_VALUE;

        this.dataParser = new DataParser();
    }

    /* *
    *
    *  Properties
    *
    * */
    public csv?: string;
    public csvURL?: string;
    public enablePolling: boolean;
    public dataRefreshRate: number;
    public decimalPoint: string;
    public itemDelimiter?: string;
    public lineDelimiter: string;
    public firstRowAsNames: boolean;
    public startRow: number;
    public endRow: number;
    public startColumn: number;
    public endColumn: number;
    public beforeParse?: Highcharts.DataBeforeParseCallbackFunction;
    public decimalRegex?: RegExp;

    private dataParser: DataParser;
    private columns?: Array<Array<Highcharts.DataValueType>>;

    /**
    * Parse a CSV input string
    * @todo simplify
    *
    * @function Highcharts.Data#parseCSV
    * @return {Array<Array<Highcharts.DataValueType>>}
    */
    public parseCSV(): DataTable {
        const store = this;
        var csv = this.csv,
            startRow = (
                typeof this.startRow !== 'undefined' && this.startRow ?
                    this.startRow :
                    0
            ),
            endRow = this.endRow || Number.MAX_VALUE,
            lines,
            rowIt = 0;

        this.columns = [];


        if (csv && this.beforeParse) {
            csv = this.beforeParse(csv);
        }

        if (csv) {
            lines = csv
                .replace(/\r\n/g, '\n') // Unix
                .replace(/\r/g, '\n') // Mac
                .split(this.lineDelimiter);

            if (!startRow || startRow < 0) {
                startRow = 0;
            }

            if (!endRow || endRow >= lines.length) {
                endRow = lines.length - 1;
            }

            if (!this.itemDelimiter) {
                this.itemDelimiter = this.guessDelimiter(lines);
            }

            var offset = 0;

            for (rowIt = startRow; rowIt <= endRow; rowIt++) {
                if (lines[rowIt][0] === '#') {
                    offset++;
                } else {
                    store.parseCSVRow(lines[rowIt], rowIt - startRow - offset);
                }
            }
        }

        const headers: string[] = [];

        if (this.firstRowAsNames) {
            this.columns.forEach(function name(col): void {
                headers.push('' + col[0]);
            });
        }

        return this.dataParser.columnArrayToDataTable(this.columns, headers);
    }

    private parseCSVRow(
        columnStr: string,
        rowNumber: number
    ): void {
        const store = this,
            columns = store.columns || [];
        var i = 0,
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
            if (store.startColumn > actualColumn || actualColumn > store.endColumn) {
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

            } else if (c === this.itemDelimiter) {
                push();

                // Actual column data
            } else {
                token += c;
            }
        }

        push();

    }

    private guessDelimiter(lines: Array<string>): string {
        var points = 0,
            commas = 0,
            guessed: string;
        const potDelimiters: Highcharts.Dictionary<number> = {
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
        if (!this.decimalPoint) {
            if (points > commas) {
                this.decimalPoint = '.';
            } else {
                this.decimalPoint = ',';
            }

            // Apply a new decimal regex based on the presumed decimal sep.
            this.decimalRegex = new RegExp(
                '^(-?[0-9]+)' +
                this.decimalPoint +
                '([0-9]+)$'
            );
        }

        return guessed;
    }

    // TODO
    private fetchCSV(): void {
        ajax({
            url: this.csvURL,
            dataType: 'text',
            data: this.csv,
            success: function (csv: string): void {
            },
            error: function (xhr, text): void {
            }
        });
    }
    // TODO: handle csv from URL
    public load(): void {
        if (this.csv) {
            this.rows = this.parseCSV();
        } else if (this.csvURL) {
            this.fetchCSV();
        }
    }

    public save(): void {

    }
}

export default CSVDataStore;

/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';
import type DataTableRow from '../DataTableRow';

import DataJSON from '../DataJSON.js';
import DataParser from './DataParser.js';
import DataTable from '../DataTable.js';
import DataConverter from '../DataConverter.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */

/**
 * Handles parsing and transforming CSV to a DataTable
 */
class CSVParser extends DataParser<DataParser.EventObject> {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options
     */
    protected static readonly defaultOptions: CSVParser.ClassJSONOptions = {
        ...DataParser.defaultOptions,
        lineDelimiter: '\n'
    };

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Creates a CSVDataParser instance from ClassJSON.
     *
     * @param {CSVParser.ClassJSON} json
     * Class JSON to convert to the parser instance.
     *
     * @return {CSVParser}
     * An instance of CSVDataParser.
     */
    public static fromJSON(json: CSVParser.ClassJSON): CSVParser {
        return new CSVParser(json.options);
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the CSV parser.
     *
     * @param {CSVParser.OptionsType} [options]
     * Options for the CSV parser.
     *
     * @param {DataConverter} converter
     * Parser data converter.
     */
    public constructor(
        options?: CSVParser.OptionsType,
        converter?: DataConverter
    ) {
        super();

        this.options = merge(CSVParser.defaultOptions, options);
        this.converter = converter || new DataConverter();
    }

    /* *
     *
     *  Properties
     *
     * */
    private columns: Array<Array<DataTableRow.CellType>> = [];
    private headers: Array<string> = [];
    private dataTypes: Array<Array<string>> = [];
    private guessedItemDelimiter?: string;
    private guessedDecimalPoint?: string;
    private decimalRegex?: RegExp;
    private options: CSVParser.ClassJSONOptions;
    public converter: DataConverter;


    /**
     * Initiates parsing of CSV
     *
     * @param {CSVParser.OptionsType}[options]
     * Options for the parser
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVDataParser#parse
     * @emits CSVDataParser#afterParse
     */
    public parse(
        options: CSVParser.OptionsType,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        const parser = this,
            dataTypes = parser.dataTypes,
            converter = parser.converter,
            parserOptions = merge(true, this.options, options),
            {
                beforeParse,
                lineDelimiter,
                firstRowAsNames,
                itemDelimiter
            } = parserOptions;

        let lines,
            rowIt = 0,
            {
                csv,
                startRow,
                endRow
            } = parserOptions,
            column,
            i: number,
            colsCount: number;

        parser.columns = [];

        parser.emit<DataParser.EventObject>({
            type: 'parse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.headers
        });

        if (csv && beforeParse) {
            csv = beforeParse(csv);
        }

        if (csv) {
            lines = csv
                .replace(/\r\n/g, '\n') // Unix
                .replace(/\r/g, '\n') // Mac
                .split(lineDelimiter || '\n');

            if (!startRow || startRow < 0) {
                startRow = 0;
            }

            if (!endRow || endRow >= lines.length) {
                endRow = lines.length - 1;
            }

            if (!itemDelimiter) {
                parser.guessedItemDelimiter = parser.guessDelimiter(lines);
            }

            // If the first row contain names, add them to the
            // headers array and skip the row.
            if (firstRowAsNames) {
                const headers = lines[0]
                    .split(itemDelimiter || parser.guessedItemDelimiter || ',');

                // Remove ""s from the headers
                for (let i = 0; i < headers.length; i++) {
                    headers[i] = headers[i].replace(/^["']|["']$/g, '');
                }

                parser.headers = headers;

                startRow++;
            }

            var offset = 0;

            for (rowIt = startRow; rowIt <= endRow; rowIt++) {
                if (lines[rowIt][0] === '#') {
                    offset++;
                } else {
                    parser.parseCSVRow(lines[rowIt], rowIt - startRow - offset);
                }
            }

            if (dataTypes.length &&
                dataTypes[0].length &&
                dataTypes[0][1] === 'date' && // format is a string date
                !parser.converter.getDateFormat()
            ) {
                parser.converter.deduceDateFormat(
                    parser.columns[0] as Array<string>, null, true);
            }

            // Guess types.
            for (let i = 0, iEnd = parser.columns.length; i < iEnd; ++i) {
                column = parser.columns[i];

                for (let j = 0, jEnd = column.length; j < jEnd; ++j) {
                    if (column[j] && typeof column[j] === 'string') {
                        parser.columns[i][j] = converter.asGuessedType(column[j] as string);
                    }
                }
            }
        }

        parser.emit<DataParser.EventObject>({
            type: 'afterParse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.headers
        });
    }

    /**
     * Internal method that parses a single CSV row
     */
    private parseCSVRow(
        columnStr: string,
        rowNumber: number
    ): void {
        const parser = this,
            converter = this.converter,
            columns = parser.columns || [],
            dataTypes = parser.dataTypes,
            { startColumn, endColumn } = parser.options,
            itemDelimiter = parser.options.itemDelimiter || parser.guessedItemDelimiter;

        let { decimalPoint } = parser.options;
        if (!decimalPoint || decimalPoint === itemDelimiter) {
            decimalPoint = parser.guessedDecimalPoint || '.';
        }

        let i = 0,
            c = '',
            cl = '',
            cn = '',
            token: (number|string) = '',
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
        function pushType(type: string): void {
            if (dataTypes.length < column + 1) {
                dataTypes.push([type]);
            }
            if (dataTypes[column][dataTypes[column].length - 1] !== type) {
                dataTypes[column].push(type);
            }
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

            // Save the type of the token.
            if (typeof token === 'string') {
                if (!isNaN(parseFloat(token)) && isFinite(token as any)) {
                    token = parseFloat(token) as any;
                    pushType('number');
                } else if (!isNaN(Date.parse(token))) {
                    token = token.replace(/\//g, '-');
                    pushType('date');
                } else {
                    pushType('string');
                }
            } else {
                pushType('number');
            }

            if (columns.length < column + 1) {
                columns.push([]);
            }

            // Try to apply the decimal point, and check if the token then is a
            // number. If not, reapply the initial value
            if (
                typeof token !== 'number' &&
                converter.guessType(token) !== 'number' &&
                decimalPoint
            ) {
                const initialValue = token;
                token = token.replace(decimalPoint, '.');
                if (converter.guessType(token) !== 'number') {
                    token = initialValue;
                }
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

            if (c === '#') {
                // If there are hexvalues remaining (#13283)
                if (!/^#[0-F]{3,3}|[0-F]{6,6}/i.test(columnStr.substr(i))) {
                    // The rest of the row is a comment
                    push();
                    return;
                }
            }

            // Quoted string
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

    /**
     * Internal method that guesses the delimiter from the first
     * 13 lines of the CSV
     * @param {Array<string>} lines
     * The CSV, split into lines
     */
    private guessDelimiter(lines: Array<string>): string {

        const { decimalPoint } = this.options;
        var points = 0,
            commas = 0,
            guessed: string;
        const potDelimiters: Record<string, number> = {
                ',': 0,
                ';': 0,
                '\t': 0
            },
            linesCount = lines.length;

        for (let i = 0; i < linesCount; i++) {
            var inStr = false,
                c,
                cn,
                cl,
                token = '';

            // We should be able to detect dateformats within 13 rows
            if (i > 13) {
                break;
            }

            const columnStr = lines[i];
            for (var j = 0; j < columnStr.length; j++) {
                c = columnStr[j];
                cn = columnStr[j + 1];
                cl = columnStr[j - 1];

                if (c === '#') {
                    // Skip the rest of the line - it's a comment
                    break;
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
        }

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
        if (points > commas) {
            this.guessedDecimalPoint = '.';
        } else {
            this.guessedDecimalPoint = ',';
        }

        if (!decimalPoint) {
            // Apply a new decimal regex based on the presumed decimal sep.
            this.decimalRegex = new RegExp(
                '^(-?[0-9]+)' +
                this.guessedDecimalPoint +
                '([0-9]+)$'
            );
        }

        return guessed;
    }
    /**
     * Handles converting the parsed data to a DataTable
     *
     * @returns {DataTable}
     * A DataTable from the parsed CSV
     */
    public getTable(): DataTable {
        return DataParser.getTableFromColumns(this.columns, this.headers);
    }

    /**
     * Converts the parser instance to ClassJSON.
     *
     * @returns {CSVParser.ClassJSON}
     * ClassJSON from the parser instance.
     */
    public toJSON(): CSVParser.ClassJSON {
        const parser = this,
            {
                options
            } = parser,
            json: CSVParser.ClassJSON = {
                $class: 'CSVDataParser',
                options
            };

        return json;
    }
}

namespace CSVParser {

    /**
     * ClassJSON for CSVDataParser
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        options: ClassJSONOptions;
    }

    /**
     * Interface for the BeforeParse callback function
     *
     */
    export interface DataBeforeParseCallbackFunction {
        (csv: string): string;
    }

    /**
     * All available options for the parser
     */
    export type OptionsType = Partial<ClassJSONOptions & ParserOptions>;

    /**
     * Options for the CSV parser that are compatible with ClassJSON
     */
    export interface ClassJSONOptions extends DataParser.Options {
        csv?: string;
        decimalPoint?: string;
        itemDelimiter?: string;
        lineDelimiter: string;
    }

    /**
     * Options that are not compatible with ClassJSON
     */
    export interface ParserOptions {
        beforeParse?: DataBeforeParseCallbackFunction;
        decimalRegex?: RegExp;
    }
}

/* *
 *
 *  Register
 *
 * */

DataJSON.addClass(CSVParser);

/* *
 *
 *  Export
 *
 * */

export default CSVParser;

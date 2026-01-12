/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Torstein Hønsi
 *  - Christer Vasseng
 *  - Gøran Slettemark
 *  - Sophie Bremer
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
import type CSVConverterOptions from './CSVConverterOptions';

import DataConverter from './DataConverter.js';
import DataTable from '../DataTable.js';
import DataConverterUtils from './DataConverterUtils.js';
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
class CSVConverter extends DataConverter {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options
     */
    protected static readonly defaultOptions: CSVConverterOptions = {
        ...DataConverter.defaultOptions,
        lineDelimiter: '\n',
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the CSV parser.
     *
     * @param {Partial<CSVConverterOptions>} [options]
     * Options for the CSV parser.
     */
    public constructor(options?: Partial<CSVConverterOptions>) {
        const mergedOptions = merge(CSVConverter.defaultOptions, options);

        super(mergedOptions);
        this.options = mergedOptions;
    }

    /* *
     *
     *  Properties
     *
     * */

    private headers: string[] = [];
    private dataTypes: string[][] = [];
    private guessedItemDelimiter?: string;
    private guessedDecimalPoint?: string;

    /**
     * Options for the DataConverter.
     */
    public readonly options: CSVConverterOptions;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Parses the CSV string into a DataTable column collection.
     * Handles line and item delimiters, optional header row, and
     * applies pre-processing if a beforeParse callback is provided.
     *
     * @param {Partial<CSVConverterOptions>} [options]
     * Options for the parser.
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     * @return {DataTable.ColumnCollection}
     * The parsed column collection.
     *
     * @emits CSVDataParser#parse
     * @emits CSVDataParser#afterParse
     */
    public parse(
        options: Partial<CSVConverterOptions>,
        eventDetail?: DataEvent.Detail
    ): DataTable.ColumnCollection {
        const converter = this,
            dataTypes = converter.dataTypes,
            parserOptions = merge(this.options, options),
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
            column;

        const columnsArray: DataTable.BasicColumn[] = [];

        converter.emit({
            type: 'parse',
            columns: columnsArray,
            detail: eventDetail,
            headers: converter.headers
        });

        if (csv && beforeParse) {
            csv = beforeParse(csv);
        }

        if (csv) {
            lines = csv
                .replace(/\r\n|\r/g, '\n') // Windows | Mac
                .split(lineDelimiter || '\n');

            if (!startRow || startRow < 0) {
                startRow = 0;
            }

            if (!endRow || endRow >= lines.length) {
                endRow = lines.length - 1;
            }

            if (!itemDelimiter) {
                converter.guessedItemDelimiter =
                    converter.guessDelimiter(lines);
            }

            // If the first row contain names, add them to the
            // headers array and skip the row.
            if (firstRowAsNames) {
                const headers = lines[0].split(
                    itemDelimiter || converter.guessedItemDelimiter || ','
                );

                // Remove ""s from the headers
                for (let i = 0; i < headers.length; i++) {
                    headers[i] = headers[i].trim().replace(/^["']|["']$/g, '');
                }

                converter.headers = headers;

                startRow++;
            }

            let offset = 0;

            for (rowIt = startRow; rowIt <= endRow; rowIt++) {
                if (lines[rowIt][0] === '#') {
                    offset++;
                } else {
                    converter.parseCSVRow(
                        columnsArray,
                        lines[rowIt],
                        rowIt - startRow - offset
                    );
                }
            }

            if (
                dataTypes.length &&
                dataTypes[0].length &&
                dataTypes[0][1] === 'date' && // Format is a string date
                !converter.options.dateFormat
            ) {
                converter.deduceDateFormat(
                    columnsArray[0] as string[], null, true
                );
            }

            // Guess types.
            for (let i = 0, iEnd = columnsArray.length; i < iEnd; ++i) {
                column = columnsArray[i];

                for (let j = 0, jEnd = column.length; j < jEnd; ++j) {
                    if (column[j] && typeof column[j] === 'string') {
                        let cellValue = converter.convertByType(
                            column[j] as string
                        );
                        if (cellValue instanceof Date) {
                            cellValue = cellValue.getTime();
                        }
                        columnsArray[i][j] = cellValue;
                    }
                }
            }
        }

        // Normalize columns to same length to avoid truncation.
        columnsArray.forEach((col): void => {
            col.length = Math.max(...columnsArray.map((c): number => c.length));
        });

        converter.emit({
            type: 'afterParse',
            columns: columnsArray,
            detail: eventDetail,
            headers: converter.headers
        });

        return DataConverterUtils.getColumnsCollection(
            columnsArray, converter.headers
        );
    }

    /**
     * Parses a single CSV row string into columns, handling delimiters,
     * quoted values, data type inference, and column range selection.
     */
    private parseCSVRow(
        columns: DataTable.BasicColumn[],
        columnStr: string,
        rowNumber: number
    ): void {
        const converter = this,
            dataTypes = converter.dataTypes,
            { startColumn, endColumn } = converter.options,
            itemDelimiter = (
                converter.options.itemDelimiter ||
                converter.guessedItemDelimiter
            );


        let { decimalPoint } = converter.options;

        if (!decimalPoint || decimalPoint === itemDelimiter) {
            decimalPoint = converter.guessedDecimalPoint || '.';
        }

        let i = 0,
            c = '',
            token: number | string = '',
            actualColumn = 0,
            column = 0;

        const read = (j: number): void => {
            c = columnStr[j];
        };

        const pushType = (type: string): void => {
            if (dataTypes.length < column + 1) {
                dataTypes.push([type]);
            }
            if (dataTypes[column][dataTypes[column].length - 1] !== type) {
                dataTypes[column].push(type);
            }
        };

        const push = (): void => {
            if (startColumn > actualColumn || actualColumn > endColumn) {
                // Skip this column, but increment the column count (#7272)
                ++actualColumn;
                token = '';
                return;
            }

            // Save the type of the token.
            if (typeof token === 'string') {
                const parsedNumber = parseFloat(token);
                if (!isNaN(parsedNumber) && isFinite(Number(token))) {
                    token = parsedNumber;
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
                DataConverterUtils.guessType(token, converter) !== 'number' &&
                decimalPoint
            ) {
                const initialValue = token;
                token = token.replace(decimalPoint, '.');
                if (
                    DataConverterUtils.guessType(token, converter) !== 'number'
                ) {
                    token = initialValue;
                }
            }

            columns[column][rowNumber] = token;

            token = '';
            ++column;
            ++actualColumn;
        };

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
                if (
                    !/^#[A-F\d]{3,3}|[A-F\d]{6,6}/i.test(
                        columnStr.substring(i)
                    )
                ) {
                    // The rest of the row is a comment
                    push();
                    return;
                }
            }

            // Quoted string
            if (c === '"') {
                read(++i);

                while (i < columnStr.length) {
                    if (c === '"') {
                        break;
                    }

                    token += c;

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
     * @param {string[]} lines
     * The CSV, split into lines
     */
    private guessDelimiter(lines: string[]): string {
        let points = 0,
            commas = 0,
            guessed: string;
        const potDelimiters: Record<string, number> = {
                ',': 0,
                ';': 0,
                '\t': 0
            },
            linesCount = lines.length;

        for (let i = 0; i < linesCount; i++) {
            let inStr = false,
                c,
                cn,
                cl,
                token = '';

            // We should be able to detect dateformats within 13 rows
            if (i > 13) {
                break;
            }

            const columnStr = lines[i];
            for (let j = 0; j < columnStr.length; j++) {
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

        return guessed;
    }

}

/* *
 *
 *  Registry
 *
 * */

declare module './DataConverterType' {
    interface DataConverterTypes {
        CSV: typeof CSVConverter;
    }
}

DataConverter.registerType('CSV', CSVConverter);

/* *
 *
 *  Default Export
 *
 * */

export default CSVConverter;

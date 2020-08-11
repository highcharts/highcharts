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
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
var fireEvent = U.fireEvent, merge = U.merge, addEvent = U.addEvent;
/* eslint-disable valid-jsdoc, require-jsdoc */
/**
 * @private
 */
var CSVDataParser = /** @class */ (function () {
    function CSVDataParser(table) {
        var _this = this;
        if (table === void 0) { table = new DataTable(); }
        this.table = table;
        this.options = CSVDataParser.defaultOptions;
        addEvent(this, 'afterParse', function (e) {
            _this.columns = e.columns;
            _this.headers = e.headers;
        });
    }
    CSVDataParser.prototype.parse = function (options) {
        this.options = merge(CSVDataParser.defaultOptions, options);
        var parser = this, _a = parser.options, beforeParse = _a.beforeParse, lineDelimiter = _a.lineDelimiter, firstRowAsNames = _a.firstRowAsNames, itemDelimiter = _a.itemDelimiter;
        var lines, rowIt = 0, _b = parser.options, csv = _b.csv, startRow = _b.startRow, endRow = _b.endRow, i, colsCount;
        this.columns = [];
        // todo parse should have a payload
        fireEvent(parser, 'parse', {}, function () {
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
                    }
                    else {
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
    };
    CSVDataParser.prototype.parseCSVRow = function (columnStr, rowNumber) {
        var parser = this, columns = parser.columns || [], _a = parser.options, startColumn = _a.startColumn, endColumn = _a.endColumn, itemDelimiter = parser.options.itemDelimiter || parser.guessedItemDelimiter;
        var i = 0, c = '', cl = '', cn = '', token = '', actualColumn = 0, column = 0;
        /**
         * @private
         */
        function read(j) {
            c = columnStr[j];
            cl = columnStr[j - 1];
            cn = columnStr[j + 1];
        }
        /**
         * @private
         */
        function push() {
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
            }
            else if (c === itemDelimiter) {
                push();
                // Actual column data
            }
            else {
                token += c;
            }
        }
        push();
    };
    CSVDataParser.prototype.guessDelimiter = function (lines) {
        var decimalPoint = this.options.decimalPoint;
        var points = 0, commas = 0, guessed;
        var potDelimiters = {
            ',': 0,
            ';': 0,
            '\t': 0
        }, linesCount = lines.length;
        for (var i = 0; i < linesCount; i++) {
            var inStr = false, c, cn, cl, token = '';
            // We should be able to detect dateformats within 13 rows
            if (i > 13) {
                break;
            }
            var columnStr = lines[i];
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
                    }
                    else {
                        inStr = true;
                    }
                }
                else if (typeof potDelimiters[c] !== 'undefined') {
                    token = token.trim();
                    if (!isNaN(Date.parse(token))) {
                        potDelimiters[c]++;
                    }
                    else if (isNaN(Number(token)) ||
                        !isFinite(Number(token))) {
                        potDelimiters[c]++;
                    }
                    token = '';
                }
                else {
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
        }
        else if (potDelimiters[','] > potDelimiters[';']) {
            guessed = ',';
        }
        else {
            // No good guess could be made..
            guessed = ',';
        }
        // Try to deduce the decimal point if it's not explicitly set.
        // If both commas or points is > 0 there is likely an issue
        if (!decimalPoint) {
            if (points > commas) {
                this.guessedDecimalPoint = '.';
            }
            else {
                this.guessedDecimalPoint = ',';
            }
            // Apply a new decimal regex based on the presumed decimal sep.
            this.decimalRegex = new RegExp('^(-?[0-9]+)' +
                decimalPoint +
                '([0-9]+)$');
        }
        return guessed;
    };
    // Todo: handle exisiting datatable
    CSVDataParser.prototype.getTable = function () {
        return DataTable.fromColumns(this.columns, this.headers);
    };
    /*
     * Default options
     */
    CSVDataParser.defaultOptions = {
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE,
        decimalPoint: '.',
        lineDelimiter: '\n',
        firstRowAsNames: true
    };
    return CSVDataParser;
}());
export default CSVDataParser;

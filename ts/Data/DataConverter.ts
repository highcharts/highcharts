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
import DataTable from './DataTable.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Class to convert between common value types.
 */
class DataConverter {
    /* *
     *
     *  Functions
     *
     * */

    /**
     * Converts a value to a boolean.
     *
     * @param {DataConverter.Type} value
     * Value to convert.
     *
     * @return {boolean}
     * Converted value as a boolean.
     */
    public asBoolean(value: DataConverter.Type): boolean {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            return value !== '' && value !== '0' && value !== 'false';
        }
        return this.asNumber(value) !== 0;
    }

    /**
     * Converts a value to a DataTable.
     *
     * @param {DataConverter.Type} value
     * Value to convert.
     *
     * @return {DataTable}
     * Converted value as a DataTable.
     */
    public asDataTable(value: DataConverter.Type): DataTable {
        if (value instanceof DataTable) {
            return value;
        }
        if (typeof value === 'string') {
            try {
                return DataTable.fromJSON(JSON.parse(value));
            } catch (error) {
                return new DataTable();
            }
        }

        return DataTable.fromJSON({
            $class: 'DataTable',
            rows: [{
                $class: 'DataTableRow',
                cells: [JSON.parse((value || '').toString())]
            }]
        });
    }

    /**
     * Converts a value to a Date.
     *
     * @param {DataConverter.Type} value
     * Value to convert.
     *
     * @return {globalThis.Date}
     * Converted value as a Date.
     */
    public asDate(value: DataConverter.Type): Date {
        if (typeof value === 'string') {
            return new Date(value);
        }
        return new Date(this.asNumber(value));
    }

    /**
     * Converts a value to a number.
     *
     * @param {DataConverter.Type} value
     * Value to convert.
     *
     * @return {number}
     * Converted value as a number.
     */
    public asNumber(value: DataConverter.Type): number {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        }
        if (typeof value === 'string') {
            return parseFloat(`0${value}`);
        }
        if (value instanceof DataTable) {
            return value.getRowCount();
        }
        if (value instanceof Date) {
            return value.getDate();
        }
        return 0;
    }

    /**
     * Converts a value to a string.
     *
     * @param {DataConverter.Type} value
     * Value to convert.
     *
     * @return {string}
     * Converted value as a string.
     */
    public asString(value: DataConverter.Type): string {
        return `${value}`;
    }

    /**
     * Guesses the potential type of a string value
     * (for parsing CSV etc)
     *
     * @param {string} value
     * The string to examine
     * @return {string}
     * `string`, `Date` or `number`
     */
    public guessType(value: string): ('string' | 'Date' | 'number') {
        if (!isNaN(Number(value))) {
            return 'number';
        }
        if (!isNaN(Date.parse(value.toString()))) {
            return 'Date';
        }
        return 'string';
    }

    /**
     * Casts a string value to it's guessed type
     * @param {string} value
     * The string to examine
     *
     * @return {number|Date|string}
     * The converted value
     */
    public asGuessedType(value: string): (number | Date | string) {
        const typeMap: Record<('string' | 'Date' | 'number'), Function> = {
            'number': this.asNumber,
            'Date': this.asDate,
            'string': this.asString
        };

        return typeMap[this.guessType(value)](value);
    }

}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Additionally provided types to describe supported value types.
 */
namespace DataConverter {

    /**
     * Contains supported types to convert values from and to.
     */
    export type Type = (
        boolean|null|number|string|Date|DataTable|undefined
    );
}

/* *
 *
 *  Export
 *
 * */

export default DataConverter;

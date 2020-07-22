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

import DataTable from './DataTable.js';

/** eslint-disable valid-jsdoc */

class DataConverter {

    /* *
     *
     *  Functions
     *
     * */

    public asBoolean(value: DataConverter.Types): boolean {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            return value !== '' && value !== '0' && value !== 'false';
        }
        return this.asNumber(value) !== 0;
    }

    public asDataTable(value: DataConverter.Types): DataTable {
        if (value instanceof DataTable) {
            return value;
        }
        if (typeof value === 'string') {
            try {
                return DataTable.parse(JSON.parse(value));
            } catch (error) {
                return new DataTable();
            }
        }
        return new DataTable();
    }

    public asDate(value: DataConverter.Types): Date {
        if (typeof value === 'string') {
            return new Date(value);
        }
        return new Date(this.asNumber(value));
    }

    public asNumber(value: DataConverter.Types): number {
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

    public asString(value: DataConverter.Types): string {
        return `${value}`;
    }

}

namespace DataConverter {
    export type Types = (boolean|null|number|string|Date|DataTable|undefined);
}

export default DataConverter;

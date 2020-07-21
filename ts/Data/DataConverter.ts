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

    public toBoolean(value: DataConverter.Types): boolean {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            return value !== '' && value !== '0' && value !== 'false';
        }
        value = this.toNumber(value);
        return value !== 0 && !isNaN(value);
    }

    public toDataTable(value: DataConverter.Types): DataTable {
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

    public toDate(value: DataConverter.Types): Date {
        return new Date(this.toNumber(value));
    }

    public toNumber(value: DataConverter.Types): number {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        }
        if (typeof value === 'string') {
            return parseFloat(value);
        }
        if (value instanceof DataTable) {
            return value.absoluteLength;
        }
        if (value instanceof Date) {
            return value.getDate();
        }
        return NaN;
    }

    public toString(value: DataConverter.Types): string {
        return `${value}`;
    }

}

namespace DataConverter {
    export type Types = (boolean|null|number|string|Date|DataTable|undefined);
}

export default DataConverter;

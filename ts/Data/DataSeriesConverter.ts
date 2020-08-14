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
* Class to convert DataTable to Highcharts series data.
*/
class DataSeriesConverter {
    /* *
    *
    *  Constructors
    *
    * */
    public constructor(table: DataTable = new DataTable(), options: DataSeriesConverter.Options) {
        this.table = table;
        this.options = options;
    }
    /* *
    *
    *  Properties
    *
    * */
    public table: DataTable;
    public options: DataSeriesConverter.Options;
    /* *
    *
    *  Functions
    *
    * */
    getSeriesData(rowIndex: number): Array<Highcharts.PointOptionsObject> {
        const table = this.table,
            row = table.getRow(rowIndex),
            dataOptions = [],
            seriesTypeData = this.getSeriesTypeData(this.options.type || 'line');

        let column;

        if (row) {
            for (let i = 0, iEnd = row.getColumnCount(); i < iEnd; i++) {

                column = row.getColumn(i);

                if (typeof column === 'number') {
                    dataOptions.push(
                        seriesTypeData(column)
                    );
                }
            }
        }
        return dataOptions;
    }

    getSeriesTypeData(type: string): Function {
        let fcName: Function;

        switch (type) {
        case 'line':
            fcName = this.getLinePoint;
            break;
        case 'pie':
            fcName = this.getPiePoint;
            break;
        case 'range':
            fcName = this.getRangePoint;
            break;
        default:
            fcName = this.getLinePoint;
            break;
        }

        return fcName;
    }

    getLinePoint(column: number): Highcharts.PointOptionsObject {
        return {
            y: column
        };
    }

    getPiePoint(column: number): Highcharts.PointOptionsObject {
        return {
            y: column
        };
    }

    getRangePoint(column: number): Highcharts.PointOptionsObject {
        return {
            y: column
        };
    }

    getAllSeriesData(): Array<Highcharts.SeriesOptions> {
        const table = this.table,
            seriesOptions = [];
        for (let i = 0, iEnd = table.getRowCount(); i < iEnd; i++) {
            seriesOptions.push({
                data: this.getSeriesData(i)
            });
        }
        return seriesOptions;
    }
}
/* *
 *
 *  Namespace
 *
 * */
namespace DataSeriesConverter {
    export interface Options {
        type?: string;
    }
}
/* *
 *
 *  Export
 *
 * */
export default DataSeriesConverter;

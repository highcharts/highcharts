/* *
 *
 *  Data module
 *
 *  (c) 2012-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const { series: { prototype: { pointClass: Point } } } = SeriesRegistry;

/* *
 *
 *  Class
 *
 * */

/**
 * Creates a new SeriesBuilder. A SeriesBuilder consists of a number
 * of ColumnReaders that reads columns and give them a name.
 * Ex: A series builder can be constructed to read column 3 as 'x' and
 * column 7 and 8 as 'y1' and 'y2'.
 * The output would then be points/rows of the form {x: 11, y1: 22, y2: 33}
 *
 * The name of the builder is taken from the second column. In the above
 * example it would be the column with index 7.
 *
 * @private
 * @class
 * @name SeriesBuilder
 */
class SeriesBuilder {

    /* *
     *
     *  Properties
     *
     * */

    public readers: Array<Highcharts.SeriesBuilderReaderObject> = [];
    public pointIsArray: boolean = true;
    public name?: string = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Populates readers with column indexes. A reader can be added without
     * a specific index and for those readers the index is taken sequentially
     * from the free columns (this is handled by the ColumnCursor instance).
     *
     * @function SeriesBuilder#populateColumns
     *
     * @param {Array<number>} freeIndexes
     *
     * @returns {boolean}
     */
    public populateColumns(freeIndexes: Array<number>): boolean {
        let enoughColumns = true;

        // Loop each reader and give it an index if its missing.
        // The freeIndexes.shift() will return undefined if there
        // are no more columns.
        this.readers.forEach(function (
            reader: Highcharts.SeriesBuilderReaderObject
        ): void {
            if (typeof reader.columnIndex === 'undefined') {
                reader.columnIndex = freeIndexes.shift();
            }
        });

        // Now, all readers should have columns mapped. If not
        // then return false to signal that this series should
        // not be added.
        this.readers.forEach(function (
            reader: Highcharts.SeriesBuilderReaderObject
        ): void {
            if (typeof reader.columnIndex === 'undefined') {
                enoughColumns = false;
            }
        });

        return enoughColumns;
    }

    /**
     * Reads a row from the dataset and returns a point or array depending
     * on the names of the readers.
     *
     * @function SeriesBuilder#read<T>
     *
     * @param {Array<Array<T>>} columns
     *
     * @param {number} rowIndex
     *
     * @returns {Array<T>|Highcharts.Dictionary<T>}
     */
    public read <T>(
        columns: Array<Array<T>>,
        rowIndex: number
    ): (Array<T>|Record<string, T>) {
        const point = this.pointIsArray ? [] as Array<T> : {} as Record<string, T>;

        let columnIndexes;

        // Loop each reader and ask it to read its value.
        // Then, build an array or point based on the readers names.
        this.readers.forEach(function (
            reader: Highcharts.SeriesBuilderReaderObject
        ): void {
            const value = columns[reader.columnIndex as any][rowIndex];

            if (point instanceof Array) {
                point.push(value);
            } else if (reader.configName.indexOf('.') > 0) {
                // Handle nested property names
                Point.prototype.setNestedProperty(
                    point, value, reader.configName
                );
            } else {
                point[reader.configName] = value;
            }
        });

        // The name comes from the first column (excluding the x column)
        if (typeof this.name === 'undefined' && this.readers.length >= 2) {
            columnIndexes = this.getReferencedColumnIndexes();
            if (columnIndexes.length >= 2) {
                // remove the first one (x col)
                columnIndexes.shift();

                // Sort the remaining
                columnIndexes.sort(function (a: number, b: number): number {
                    return a - b;
                });

                // Now use the lowest index as name column
                this.name = (columns[columnIndexes.shift() as any] as any).name;
            }
        }

        return point;
    }

    /**
     * Creates and adds ColumnReader from the given columnIndex and configName.
     * ColumnIndex can be undefined and in that case the reader will be given
     * an index when columns are populated.
     *
     * @function SeriesBuilder#addColumnReader
     *
     * @param {number} columnIndex
     *
     * @param {string} configName
     */
    public addColumnReader(
        columnIndex: (number|undefined),
        configName: string
    ): void {
        this.readers.push({
            columnIndex: columnIndex,
            configName: configName
        });

        if (!(
            configName === 'x' ||
            configName === 'y' ||
            typeof configName === 'undefined'
        )) {
            this.pointIsArray = false;
        }
    }

    /**
     * Returns an array of column indexes that the builder will use when
     * reading data.
     *
     * @function SeriesBuilder#getReferencedColumnIndexes
     *
     * @returns {Array<number>}
     */
    public getReferencedColumnIndexes(): Array<number> {
        const referencedColumnIndexes = [];

        let i,
            columnReader;

        for (i = 0; i < this.readers.length; i = i + 1) {
            columnReader = this.readers[i];
            if (typeof columnReader.columnIndex !== 'undefined') {
                referencedColumnIndexes.push(columnReader.columnIndex);
            }
        }

        return referencedColumnIndexes;
    }

    /**
     * Returns true if the builder has a reader for the given configName.
     *
     * @function SeriesBuider#hasReader
     *
     * @param {string} configName
     *
     * @returns {boolean|undefined}
     */
    public hasReader(configName: string): (boolean|undefined) {
        let i,
            columnReader;

        for (i = 0; i < this.readers.length; i = i + 1) {
            columnReader = this.readers[i];
            if (columnReader.configName === configName) {
                return true;
            }
        }
        // Else return undefined
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default SeriesBuilder;

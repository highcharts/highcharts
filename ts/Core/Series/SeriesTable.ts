/* *
 *
 *  (c) 2010-2022 Highsoft AS
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

import type Point from './Point';
import type {
    PointOptions,
    PointShortOptions
} from './PointOptions';
import type Series from './Series';
import type {
    SeriesTypePlotOptions,
    SeriesTypeOptions
} from './SeriesType';

import ChainModifier from '../../Data/Modifiers/ChainModifier.js';
import DataTable from '../../Data/DataTable.js';
import RangeModifier from '../../Data/Modifiers/RangeModifier.js';
import SortModifier from '../../Data/Modifiers/SortModifier.js';
import U from '../Utilities.js';
const {
    addEvent,
    arrayMax,
    arrayMin,
    fireEvent,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module './SeriesLike' {
    interface SeriesLike {
        table?: DataTable;
    }
}

declare module './SeriesOptions' {
    interface SeriesOptions {
        table?: DataTable.ColumnCollection;
    }
}

/* *
 *
 *  Variables
 *
 * */

const composedMembers: Array<object> = [];

/* *
 *
 *  Functions
 *
 * */

export function compose(
    SeriesClass: typeof Series
): void {
    const PointClass = SeriesClass.prototype.pointClass;

    if (composedMembers.indexOf(PointClass) === -1) {
        composedMembers.push(PointClass);

        const pointProto = PointClass.prototype;

        wrap(pointProto, 'update', wrapPointUpdate);
    }

    if (composedMembers.indexOf(SeriesClass) === -1) {
        composedMembers.push(SeriesClass);

        addEvent(SeriesClass, 'setOptions', onSeriesSetOptions);

        const seriesProto = SeriesClass.prototype;

        // @todo replace wraps with events or integrate into core series
        wrap(seriesProto, 'drawPoints', wrapSeriesDrawPoints);
        wrap(seriesProto, 'generatePoints', wrapSeriesGeneratePoints);
        wrap(seriesProto, 'getProcessedData', wrapSeriesGetProcessedData);
        wrap(seriesProto, 'getExtremes', wrapSeriesGetExtremes);
    }

}

function onSeriesSetOptions(
    this: Series,
    e: {
        plotOptions: SeriesTypePlotOptions,
        userOptions: SeriesTypeOptions
    }
): void {
    const options = e.userOptions;

    let table = this.table;

    if (options.table) {
        const optionsTable = options.table;

        if (table) {
            table.setColumns(optionsTable, void 0);
        } else {
            table = this.table = new DataTable(optionsTable, options.id);
            table.setModifier(new ChainModifier({}));
        }
    }

    if (table) {
        const {
            dataSorting,
            keys,
            legendType
        } = options;

        if (keys) {
            const columns = table.getColumnNames();

            let i = 0;

            for (const key of keys) {
                if (columns.indexOf(key) === -1) {
                    table.setColumnAlias(key, columns[i]);
                }
                ++i;
            }
        }

        if (dataSorting && dataSorting.enabled) {
            const modifier = table.getModifier();

            if (
                modifier instanceof ChainModifier &&
                !modifier.modifiers.length
            ) {
                modifier.add(new SortModifier({
                    direction: 'asc',
                    orderByColumn: dataSorting.sortKey
                }));
            }
        }

        if (legendType === 'point') {
            this.generatePoints();
        }
    }
}

function wrapPointUpdate(
    this: Point,
    proceed: (Point['update']),
    options: DataTable.RowObject
): ReturnType<Point['update']> {

    if (this.series.table) {
        const target = this.series.table;

        target.setRow(options, this.index);
    }

    return (proceed as any)();
}

function wrapSeriesDrawPoints(
    this: Series,
    proceed: Series['drawPoints']
): ReturnType<Series['drawPoints']> {

    // if (this.table) {
    //     return;
    // }

    return proceed();
}

function wrapSeriesGeneratePoints(
    this: Series,
    proceed: Series['generatePoints']
): ReturnType<Series['generatePoints']> {

    if (!this.table) {
        return proceed();
    }

    const PointClass = this.pointClass,
        source = this.table.modified,
        rowCount = source.getRowCount(),
        points = this.points = this.data = this.points || [],
        data = source.getRowObjects() || [];

    let point: (Point|undefined);

    for (let i = 0; i < rowCount; ++i) {
        point = points[i];

        if (point) {
            point.x = source.getCellAsNumber('x', i, true);
            point.y = source.getCellAsNumber('y', i);
        } else {
            point = points[i] = new PointClass();
            point.init(this, data[i], i);
        }
    }

    fireEvent(this, 'afterGeneratePoints');
}

function wrapSeriesGetExtremes(
    this: Series,
    proceed: Series['getExtremes']
): ReturnType<Series['getExtremes']> {

    if (!this.table) {
        return proceed();
    }

    const xAxis = this.xAxis,
        source = this.table.modified,
        activeYData = source.getColumnAsNumbers('y') || [];

    if (xAxis) {
        xAxis.getSeriesExtremes();
    }

    return {
        activeYData: activeYData as Array<number>,
        dataMax: arrayMax(activeYData),
        dataMin: arrayMin(activeYData)
    };
}

function wrapSeriesGetProcessedData(
    this: Series,
    proceed: Series['getProcessedData']
): ReturnType<Series['getProcessedData']> {

    if (this.table) {
        const source = this.table.modified,
            series: AnyRecord = this,
            rowCount = source.getRowCount(),
            dataKeys = this.parallelArrays;

        let first = true;

        for (const key of dataKeys) {
            if (first && !source.hasColumns([key])) {
                const data = series[`${key}Data`] = series[`${key}Data`] || [],
                    dataLength = data.length;

                if (dataLength > rowCount) {
                    data.splice(rowCount);
                } else {
                    for (let i = dataLength; i < rowCount; ++i) {
                        data.push(this.autoIncrement(data[i]));
                    }
                }
            } else {
                series[`${key}Data`] = (
                    source.getColumnAsNumbers(key, true) ||
                    series[`${key}Data`] ||
                    []
                );
            }
            first = false;
        }
    }

    return proceed();
}

/* *
 *
 *  Default Export
 *
 * */

const SeriesTable = {
    compose
};

export default SeriesTable;

/* *
 *
 *  API Options
 *
 * */

/**
 * Table columns to activate table-mode for the series.
 *
 * @type      {Highcharts.Dictionary<Array<(number|string)>>}
 * @apioption series.line.table
 */

''; // keeps doclets above in JS file

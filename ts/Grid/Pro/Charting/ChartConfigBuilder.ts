/* *
 *
 *  Grid Charting config builder
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Markus Barstad
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { AnyRecord } from '../../../Shared/Types';
import type { CellType as DataTableCellType } from '../../../Data/DataTable';
import type { ChartColumn } from './ChartRecommender';
import type { ChartingChartType } from './ChartingOptions';

import { getColumnRoles } from './ChartRecommender.js';


/* *
 *
 *  Functions
 *
 * */

/**
 * Returns the Highcharts series type that draws a chart type.
 *
 * @param type
 * The chart type.
 *
 * @return
 * The Highcharts series type.
 */
export function getSeriesType(type: ChartingChartType): string {
    return type === 'stackedColumn' ? 'column' : type;
}

/**
 * Converts a cell value to a chartable number.
 *
 * @param value
 * The cell value.
 *
 * @param datetime
 * Whether the value is a date, so that date strings are parsed.
 *
 * @return
 * The number, or `null` when the value is not a number.
 */
function toNumber(
    value: DataTableCellType,
    datetime?: boolean
): number | null {
    if (typeof value === 'number') {
        return isFinite(value) ? value : null;
    }

    if (datetime && typeof value === 'string') {
        const time = Date.parse(value);
        return isNaN(time) ? null : time;
    }

    return null;
}

/**
 * Converts a cell value to a category name.
 *
 * @param value
 * The cell value.
 *
 * @param index
 * The row index, used to name rows without a value.
 *
 * @return
 * The category name.
 */
function toCategory(value: DataTableCellType, index: number): string {
    return value === null || value === void 0 || value === '' ?
        `#${index + 1}` :
        String(value);
}

/**
 * Returns the Highcharts format of a point value, using the `cells.format` of
 * the column it comes from, so that the tooltip shows the value as the Grid
 * does.
 *
 * @param column
 * The column the value comes from.
 *
 * @param key
 * The point property holding the value, such as `y`.
 *
 * @return
 * The format string.
 */
function valueFormat(column: ChartColumn, key: string): string {
    return column.format ?
        column.format.replace(/\{value(?=[:}])/g, '{point.' + key) :
        '{point.' + key + '}';
}

/**
 * Returns the `tooltip` option of a series charting a numeric column, or no
 * option when the column has no format. Options are left out rather than set
 * to `undefined`, which would replace the Highcharts defaults when merged.
 *
 * @param measure
 * The numeric column.
 *
 * @return
 * The series options to spread in.
 */
function seriesTooltip(measure: ChartColumn): AnyRecord {
    return measure.format ? {
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                '{series.name}: <b>' + valueFormat(measure, 'y') + '</b><br/>'
        }
    } : {};
}

/**
 * Builds the series and axes of a cartesian chart.
 *
 * @param type
 * The Highcharts series type.
 *
 * @param measures
 * The numeric columns.
 *
 * @param dimension
 * The column placing the points along the x-axis, if any.
 *
 * @return
 * The `series` and `xAxis` options.
 */
function buildCartesian(
    type: string,
    measures: Array<ChartColumn>,
    dimension?: ChartColumn
): AnyRecord {
    if (dimension?.dataType === 'datetime') {
        const times = dimension.values.map(
            (value): number | null => toNumber(value, true)
        );

        return {
            xAxis: { type: 'datetime', title: { text: dimension.name } },
            series: measures.map((measure): AnyRecord => ({
                type,
                name: measure.name,
                ...seriesTooltip(measure),
                data: times
                    .map((time, i): Array<number | null> => [
                        time,
                        toNumber(measure.values[i])
                    ])
                    .filter((point): boolean => point[0] !== null)
                    // Time series read left to right, whatever the Grid sort.
                    .sort((a, b): number => (a[0] || 0) - (b[0] || 0))
            }))
        };
    }

    return {
        xAxis: dimension ? {
            categories: dimension.values.map(toCategory),
            title: { text: dimension.name }
        } : {},
        series: measures.map((measure): AnyRecord => ({
            type,
            name: measure.name,
            ...seriesTooltip(measure),
            data: measure.values.map(
                (value): number | null => toNumber(value)
            )
        }))
    };
}

/**
 * Builds the series and axes of a scatter or bubble chart, where the first
 * numeric column gives the x values, and for bubbles the third the size.
 *
 * @param type
 * The chart type.
 *
 * @param measures
 * The numeric columns.
 *
 * @return
 * The `series`, `xAxis` and `yAxis` options.
 */
function buildXY(
    type: ChartingChartType,
    measures: Array<ChartColumn>
): AnyRecord {
    const [x, y, z] = measures;
    const axes = type === 'bubble' ? [x, y, z] : [x, y];
    const keys = ['x', 'y', 'z'];
    const pointFormat = axes.map((column, i): string =>
        column.name + ': <b>' + valueFormat(column, keys[i]) + '</b><br/>'
    ).join('');

    return {
        xAxis: { title: { text: x.name } },
        yAxis: { title: { text: y.name } },
        series: [{
            type,
            name: type === 'bubble' ? z.name : y.name,
            tooltip: { pointFormat },
            data: x.values.map((value, i): Array<number | null> => {
                const point = [toNumber(value), toNumber(y.values[i])];

                if (type === 'bubble') {
                    point.push(toNumber(z.values[i]));
                }

                return point;
            })
        }]
    };
}

/**
 * Builds the series of a pie chart from the first numeric column, named by
 * the dimension column.
 *
 * @param measure
 * The numeric column.
 *
 * @param dimension
 * The column naming the slices, if any.
 *
 * @return
 * The `series` options.
 */
function buildPie(
    measure: ChartColumn,
    dimension?: ChartColumn
): AnyRecord {
    return {
        series: [{
            type: 'pie',
            name: measure.name,
            ...seriesTooltip(measure),
            data: measure.values.map((value, i): AnyRecord => ({
                name: toCategory(dimension?.values[i], i),
                y: toNumber(value)
            }))
        }]
    };
}

/**
 * Generates Highcharts options that chart the columns as the given type.
 *
 * @param columns
 * The columns to chart.
 *
 * @param type
 * The chart type.
 *
 * @return
 * The chart options, or `undefined` when the columns hold no numbers.
 */
export function buildChartOptions(
    columns: Array<ChartColumn>,
    type: ChartingChartType
): AnyRecord | undefined {
    const { dimension, measures } = getColumnRoles(columns);
    const seriesType = getSeriesType(type);

    if (!measures.length) {
        return;
    }

    let config: AnyRecord;
    if (type === 'pie') {
        config = buildPie(measures[0], dimension);
    } else if (
        !dimension &&
        measures.length >= (type === 'bubble' ? 3 : 2) &&
        (type === 'scatter' || type === 'bubble')
    ) {
        config = buildXY(type, measures);
    } else {
        config = buildCartesian(seriesType, measures, dimension);
    }

    const series: Array<AnyRecord> = config.series;
    const singleMeasure = type === 'pie' || series.length === 1;

    const options: AnyRecord = {
        chart: { type: seriesType },
        title: {
            text: measures.map((m): string => m.name).join(', ') +
                (dimension && type !== 'pie' ? ' / ' + dimension.name : '')
        },
        legend: { enabled: !singleMeasure },
        yAxis: { title: { text: singleMeasure ? series[0].name : null } },
        ...config
    };

    if (type === 'stackedColumn') {
        options.plotOptions = { series: { stacking: 'normal' } };
    }

    if (dimension?.format && type !== 'pie') {
        options.tooltip = {
            headerFormat: '<span style="font-size: 0.8em">' +
                valueFormat(dimension, 'key') + '</span><br/>'
        };
    }

    return options;
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    buildChartOptions,
    getSeriesType
} as const;

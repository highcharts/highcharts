/* eslint-disable brace-style */
/* eslint-disable no-console */
/* eslint-disable valid-jsdoc */
/* *
 *
 *  Imports
 *
 * */

import type Chart from '../../Core/Chart/Chart';
import type DataPlotOptions from './DataPlotOptions';
import type DataPointOptions from './DataPointOptions';
import type DataPromise from '../DataPromise';
import type DataSeriesOptions from './DataSeriesOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type Time from '../../Core/Time';

import CS from '../../Core/Series/Series.js';
import DataPoint from './DataPoint.js';
import DataTable from '../DataTable.js';
import D from '../../Core/DefaultOptions.js';
const { defaultTime } = D;
import LegendSymbol from '../../Core/Legend/LegendSymbol.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import SortModifier from '../Modifiers/SortModifier.js';
import U from '../../Core/Utilities.js';
const {
    cleanRecursively,
    extend,
    fireEvent,
    merge,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

class DataSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly defaultOptions: DataPlotOptions = {
        dataLabels: {
            enabled: false
        }
    };

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Converts the DataTable instance to common series options.
     *
     * @private
     *
     * @param {DataTable} table
     * Table to convert.
     *
     * @param {Array<string>} [keys]
     * Data keys to extract from table rows.
     *
     * @return {Highcharts.SeriesOptions}
     * Common series options.
     */
    public static getSeriesOptionsFromTable(
        table: DataTable,
        keys?: Array<string>
    ): DataSeriesOptions {
        const rows = table.getRowObjects(),
            data: Array<DataPointOptions> = [];

        let pointStart: (number|undefined);

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            if (i === 0) {
                pointStart = (
                    parseInt(rows[i][keys && keys[0] || 'x'] as string, 10) ||
                    void 0
                );
            }
            data.push(DataPoint.getPointOptionsFromTableRow(rows[i]) || {});
        }

        return {
            data,
            id: table.id,
            keys,
            pointStart,
            type: 'data'
        };
    }

    /**
     * Converts series options to a DataTable instance.
     *
     * @private
     *
     * @param {Highcharts.SeriesOptions} seriesOptions
     * Series options to convert.
     *
     * @return {DataTable}
     * DataTable instance.
     */
    public static getTableFromSeriesOptions(
        seriesOptions: DataSeriesOptions
    ): DataTable {
        const table = new DataTable(void 0, seriesOptions.id),
            data = (seriesOptions.data || []);

        let keys = (seriesOptions.keys || []),
            x = (seriesOptions.pointStart || 0);

        if (
            !keys.length &&
            seriesOptions.type
        ) {
            const seriesClass = SeriesRegistry.seriesTypes[seriesOptions.type];
            keys = (
                seriesClass &&
                seriesClass.prototype.pointArrayMap ||
                []
            );
        }

        if (!keys.length) {
            keys = ['y'];
        }

        for (let i = 0, iEnd = data.length; i < iEnd; ++i) {
            table.setRow(
                DataPoint.getTableRowFromPointOptions(data[i], keys, x)
            );
            x = DataSeries.increment(x, seriesOptions);
        }

        return table;
    }

    // eslint-disable-next-line valid-jsdoc
    /** @private */
    public static increment(
        value: number,
        options: DataPlotOptions = { },
        time: Time = defaultTime
    ): number {
        const intervalUnit = options.pointIntervalUnit;

        let interval = pick(options.pointInterval, 1);

        // Added code for pointInterval strings
        if (intervalUnit) {
            const date = new time.Date(value);

            switch (intervalUnit) {
                case 'day':
                    time.set(
                        'Date',
                        date,
                        time.get('Date', date) + interval
                    );
                    break;
                case 'month':
                    time.set(
                        'Month',
                        date,
                        time.get('Month', date) + interval
                    );
                    break;
                case 'year':
                    time.set(
                        'FullYear',
                        date,
                        time.get('FullYear', date) + interval
                    );
                    break;
                default:
            }

            interval = date.getTime() - value;

        }

        return value + interval;
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        chart: Chart,
        options: DeepPartial<DataSeriesOptions> = {}
    ) {
        console.log('DataSeries.constructor');

        this.chart = chart;
        this.data = [];
        this.linkedSeries = [];
        this.options = this.setOptions(options);
        this.points = [];
        this.state = '';
        this.table = new DataTable();
        this.tableListeners = [];
        this.userOptions = options;
        this.visible = true;
        this.setData(options.data || []);
    }

    /* *
     *
     *  Properties
     *
     * */

    public chart: Chart;

    public readonly data: Array<(this['pointClass']['prototype']|null)>;

    public group?: SVGElement;

    public index?: number;

    public isDirty?: boolean;

    public isDirtyData?: boolean;

    public linkedSeries: Array<DataSeries>;

    public opacity?: number;

    public options: DataSeriesOptions;

    public points: Array<(this['pointClass']['prototype']|null)>;

    public state: StatesOptionsKey;

    public table: DataTable;

    private tableListeners: Array<Function>;

    public userOptions: DeepPartial<DataSeriesOptions>;

    public visible: boolean;

    /* *
     *
     *  Functions
     *
     * */

    public destroy(): void {
        console.log('DataSeries.destroy');

        this.destroyTableListeners();
    }

    public destroyTableListeners(): void {
        console.log('DataSeries.destroyTableListeners');

        const series = this,
            tableListeners = series.tableListeners.slice();

        series.tableListeners.length = 0;

        for (let i = 0, iEnd = tableListeners.length; i < iEnd; ++i) {
            tableListeners[i]();
        }
    }

    /* public findPoint(
        tableRow: DataTableRow,
        startIndex: number = 0
    ): (this['pointClass']['prototype']|undefined) {
        if (tableRow.isNull()) {
            return;
        }

        const series = this,
            data = series.data,
            id = tableRow.id,
            x = tableRow.getCellAsNumber('x');

        let point: typeof series.data[0],
            pointTableRow: (DataTableRow);

        for (let i = startIndex, iEnd = data.length; i < iEnd; ++i) {
            point = data[i];
            if (point) {
                pointTableRow = point.tableRow;
                if (pointTableRow === tableRow) {
                    return point;
                }
                if (pointTableRow.id === id) {
                    return point;
                }
                if (pointTableRow.getCellAsNumber('x') === x) {
                    return point;
                }
            }
        }
    } */

    public hasData(): boolean {
        console.log('DataSeries.hasData');

        return (this.table.getRowCount() > 0);
    }

    /** @deprecated */
    public init(
        chart: Chart,
        options: DataSeriesOptions
    ): void {
        console.log('DataSeries.init');

        const series = this;

        fireEvent(series, 'init');

        series.chart = chart;

        series.setOptions(options);
        series.bindAxes();

        chart.series.push(series as any);

        series.setData(options.data || []);

        fireEvent(series, 'afterInit');
    }

    public plotGroup(
        parent: SVGElement
    ): SVGElement {
        console.log('DataSeries.plotGroup');

        const series = this,
            {
                chart,
                options
            } = series,
            {
                zIndex
            } = options,
            attributes: SVGAttributes = {
                translateX: chart.plotLeft,
                translateY: chart.plotTop,
                scaleX: 1,
                scaleY: 1,
                visibility: series.visible ? 'visible' : 'hidden',
                zIndex
            };

        // Avoid setting undefined opacity, or in styled mode
        if (
            typeof this.opacity !== 'undefined' &&
            !this.chart.styledMode &&
            this.state !== 'inactive' // #13719
        ) {
            attributes.opacity = this.opacity;
        }

        return parent.renderer
            .g()
            .addClass('highcharts-data-series')
            .attr(attributes)
            .add(parent);
    }

    public redraw(): void {
        console.log('DataSeries.redraw');

        const series = this;

        series.translate();
        series.render();
        if (
            series.isDirty ||
            series.isDirtyData
        ) { // #3868, #3945
            delete (series as any).kdTree;
        }
    }

    /**
     * Render series as points.
     */
    public render(
        parent?: SVGElement
    ): void {
        console.log('DataSeries.render');

        const series = this,
            chart = series.chart,
            points = series.points,
            renderer = chart.renderer;

        let group = series.group;

        if (parent) {
            group = series.plotGroup(parent);
        } else if (!group) {
            series.group = group = series.plotGroup(
                chart.seriesGroup || renderer.boxWrapper
            );
        }

        for (
            let i = 0,
                iEnd = points.length,
                point: (DataPoint|null);
            i < iEnd;
            ++i
        ) {
            point = points[i];
            if (point) {
                point.render(group);
            }
        }
    }

    /** @deprecated */
    public setData(
        data: Array<(DataPointOptions|PointShortOptions|undefined)>
    ): void {
        console.log('DataSeries.setData');

        const series = this;

        series.setTable(DataSeries.getTableFromSeriesOptions({
            data: data as any,
            keys: series.pointArrayMap,
            type: 'data'
        }));
    }

    /** @private */
    private setOptions(
        options: DeepPartial<DataSeriesOptions>
    ): DataSeriesOptions {
        console.log('DataSeries.setOptions');

        const series = this,
            chart = series.chart;

        fireEvent(series, 'setOptions', { userOptions: options });

        series.options = merge(
            DataSeries.defaultOptions,
            (
                chart &&
                chart.options.plotOptions &&
                chart.options.plotOptions.series
            ),
            (
                chart &&
                chart.userOptions &&
                chart.userOptions.plotOptions &&
                chart.userOptions.plotOptions[series.type]
            ),
            options
        ) as DataSeriesOptions;
        series.userOptions = merge(options);

        fireEvent(series, 'afterSetOptions', { options: series.options });

        return series.options;
    }

    /**
     * Add or update table.
     */
    public setTable(
        table: DataTable
    ): void {
        console.log('DataSeries.setTable');

        type PointType = typeof PointClass['prototype'];

        const series = this,
            dataSorting = series.options.dataSorting,
            pointsToKeep: Array<PointType> = [],
            seriesData = series.data,
            seriesDataLength = seriesData.length,
            tableIds = table.getColumnAsNumbers('id', true) || [],
            tableIdsLength = tableIds.length,
            PointClass = series.pointClass;

        if (series.table === table) {
            return;
        }

        if (dataSorting && dataSorting.enabled) {
            table = (new SortModifier({
                orderByColumn: series.pointArrayMap[0],
                orderInColumn: 'x'
            })).modifyTable(table);
        }

        series.destroyTableListeners();

        series.table = table;
        series.tableListeners.push(
            table.on('afterSetRows', function (
                this: DataTable,
                e: DataTable.Event
            ): void {
                if (e.type === 'afterSetRows') {
                    const {
                        rowIndex,
                        rows
                    } = e;

                    let currentIndex = rowIndex,
                        point: DataPoint;

                    for (const row of rows || []) {
                        point = new PointClass(series, rows, currentIndex++);

                        if (currentIndex >= seriesData.length) {
                            seriesData[currentIndex] = point;
                        } else {
                            seriesData.splice(currentIndex, 0, point);
                        }
                    }
                }
            }),
            table.on('afterDeleteRows', function (
                this: DataTable,
                e: DataTable.Event
            ): void {
                if (e.type === 'afterDeleteRows') {
                    seriesData.splice(e.rowIndex, e.rowCount);
                }
            })
        );

        for (
            let i = 0,
                iEnd = tableIdsLength,
                point: (PointType|null),
                pointTableRow: DataTable.RowObject,
                id: number;
            i < iEnd;
            ++i
        ) {
            point = seriesData[i];
            id = tableIds[i];

            if (!table.autoId) {
                for (
                    let j = 0,
                        jEnd = seriesData.length;

                    j < jEnd;

                    ++j
                ) {
                    point = seriesData[j];
                    if (
                        point &&
                        point.tableRow.id === id
                    ) {
                        break;
                    }
                }
                if (!point) {
                    point = seriesData[i];
                }
            }

            if (isNaN(id)) {
                if (point) {
                    point.destroy();
                    point = null;
                }
                seriesData[i] = null;
            } else if (point) {
                pointTableRow = point.tableRow;
                if (pointTableRow.id !== id) {
                    point.setTableRow(
                        table.getRowObject(
                            table.getRowIndexBy('id', id) || i
                        ) ||
                        {}
                    );
                }
            } else {
                point = new PointClass(
                    series,
                    table.getRowObject(table.getRowIndexBy('id', id) || i),
                    i
                );
                seriesData[i] = point;
            }
            if (point) {
                pointsToKeep.push(point);
            }
        }

        if (seriesDataLength > tableIdsLength) {
            for (
                let i = 0,
                    iEnd = seriesDataLength,
                    point: (PointType|null);
                i < iEnd;
                ++i
            ) {
                point = seriesData[i];
                if (point) {
                    if (!pointsToKeep.indexOf(point)) {
                        point.destroy();
                    } else {
                        point.index = i;
                    }
                }
            }
        }
    }

    public translate(): void {
        console.log('DataSeries.translate');

        const series = this;

        series.points = series.data.slice();
    }

    public update(
        options: DataSeriesOptions,
        redraw?: boolean
    ): void {
        console.log('DataSeries.update');

        const series = this;

        options = cleanRecursively(options, series.options);

        fireEvent(series, 'update', { options });

        series.options = merge(
            series.options,
            {
                animation: false,
                index: pick(series.options.index, series.index)
            },
            options
        );

        series.setData(options.data || []);

        fireEvent(series, 'afterUpdate');

        if (pick(redraw, true)) {
            series.chart.redraw();
        }
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface DataSeries {
    axisTypes: Array<string>;
    bindAxes: typeof CS.prototype.bindAxes;
    drawLegendSymbol: typeof LegendSymbol.drawRectangle;
    insert: typeof CS.prototype.insert;
    is: typeof CS.prototype.is;
    parallelArrays: Array<string>;
    pointArrayMap: Array<string>;
    pointClass: typeof DataPoint;
    type: string;
    updateParallelArrays: typeof CS.prototype.updateParallelArrays;
}
extend(DataSeries.prototype, {
    axisTypes: [],
    bindAxes: CS.prototype.bindAxes,
    drawLegendSymbol: LegendSymbol.drawRectangle,
    insert: CS.prototype.insert,
    is: CS.prototype.is,
    parallelArrays: [],
    pointArrayMap: ['y'],
    pointClass: DataPoint,
    type: 'data',
    updateParallelArrays: CS.prototype.updateParallelArrays
});

/* *
 *
 *  Registry
 *
 * */

SeriesRegistry.registerSeriesType('data', DataSeries as any);

/* *
 *
 *  Default Export
 *
 * */

export default DataSeries;

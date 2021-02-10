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
import type DataSeriesOptions from './DataSeriesOptions';
import type DataTableRow from '../DataTableRow';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type SeriesLike from '../../Core/Series/SeriesLike';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import CS from '../../Core/Series/Series.js';
import DataPoint from './DataPoint.js';
import DataTable from '../DataTable.js';
import LegendSymbolMixin from '../../Mixins/LegendSymbol.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
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

    public static readonly getSeriesOptionsFromTable = CS.getSeriesOptionsFromTable;

    public static readonly getTableFromSeriesOptions = CS.getTableFromSeriesOptions;

    public static readonly increment = CS.increment;

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        chart: Chart,
        options: DeepPartial<DataSeriesOptions> = {}
    ) { console.log('DataSeries.constructor');
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
        this.destroyTableListeners();
    }

    public destroyTableListeners(): void {
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
        return (this.table.getRowCount() > 0);
    }

    /** @deprecated */
    public init(chart: Chart, options: DataSeriesOptions): void { console.log('DataSeries.init');
        const series = this;

        fireEvent(series, 'init');

        series.chart = chart;

        series.setOptions(options);
        series.bindAxes();

        chart.series.push(series as any);

        series.setData(options.data || []);

        fireEvent(series, 'afterInit');
    }

    public plotGroup(parent: SVGElement): SVGElement { console.log('DataSeries.plotGroup');
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
                visibility: series.visible,
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
    public render(parent?: SVGElement): void {
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
    public setData(data: Array<DataPointOptions|PointShortOptions|undefined>): void { console.log('DataSeries.setData');
        const series = this;
        if (series.table.getRowCount() > 0) {
            // @todo find point/rows to update
        } else {
            series.setTable(DataSeries.getTableFromSeriesOptions({
                data: data as any,
                keys: series.pointArrayMap
            }));
        }
    }

    /** @private */
    private setOptions(options: DeepPartial<DataSeriesOptions>): DataSeriesOptions {
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
    public setTable(table: DataTable): void { console.log('DataSeries.setTable');
        const series = this,
            seriesData = series.data,
            seriesDataLength = seriesData.length,
            tableRows = table.getAllRows(),
            tableRowsLength = tableRows.length,
            SeriesPoint = series.pointClass;

        if (series.table === table) {
            return;
        }

        series.destroyTableListeners();

        series.table = table;

        for (
            let i = 0,
                iEnd = tableRowsLength,
                point: (this['pointClass']['prototype']|null),
                tableRow: DataTableRow;

            i < iEnd;

            ++i
        ) {
            point = seriesData[i];
            tableRow = tableRows[i];
            if (tableRow.isNull()) {
                if (point) {
                    point.destroy();
                }
                seriesData[i] = null;
            } else if (
                point &&
                point.tableRow !== tableRow
            ) {
                point.setTableRow(tableRow);
            } else {
                seriesData[i] = new SeriesPoint(series, tableRow, i);
            }
        }

        if (seriesDataLength > tableRowsLength) {
            for (
                let i = tableRowsLength,
                    iEnd = seriesDataLength,
                    point: (this['pointClass']['prototype']|null);

                i < iEnd;

                ++i
            ) {
                point = seriesData[i];
                if (point) {
                    point.destroy();
                }
            }

            seriesData.length = tableRowsLength;
        }

        series.tableListeners.push(
            table.on('afterInsertRow', function (
                this: DataTable,
                e: DataTable.EventObject
            ): void {
                if (e.type === 'afterInsertRow') {
                    const {
                        index,
                        row
                    } = e;
                    seriesData.splice(index, 0, new DataPoint(series, row, index));
                }
            }),
            table.on('afterDeleteRow', function (
                this: DataTable,
                e: DataTable.EventObject
            ): void {
                if (e.type === 'afterUpdateRow') {
                    const index = e.index;
                    seriesData.splice(index, 1);
                }
            })
        );

        // series.tableListener =  ---> point listener?
    }

    public translate(): void { console.log('DataSeries.translate');
        const series = this;

        series.points = series.data.slice();
    }

    public update(options: DataSeriesOptions, redraw?: boolean): void {
        const series = this;

        options = cleanRecursively(options, series.options);

        fireEvent(series, 'update', { options });

        series.options = merge(series.options, options);

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
    drawLegendSymbol: typeof LegendSymbolMixin.drawRectangle;
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
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
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

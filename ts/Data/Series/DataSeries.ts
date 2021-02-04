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
        this.options = merge(
            (
                chart &&
                chart.options.plotOptions &&
                chart.options.plotOptions.series
            ),
            DataSeries.defaultOptions,
            options
        );
        this.points = [];
        this.table = (
            options.data ?
                DataSeries.getTableFromSeriesOptions(this.options) :
                new DataTable()
        );
        this.userOptions = options;
        this.visible = true;
    }

    /* *
     *
     *  Properties
     *
     * */

    public chart: Chart;

    public readonly data: Array<(this['pointClass']['prototype']|null)>;

    public group?: SVGElement;

    public linkedSeries: Array<DataSeries>;

    public options: DataPlotOptions;

    public points: Array<(this['pointClass']['prototype']|null)>;

    public table: DataTable;

    private tableListener?: Function;

    public userOptions: DeepPartial<DataSeriesOptions>;

    public readonly visible: boolean;

    public xAxis?: Chart['xAxis'][0];

    public yAxis?: Chart['yAxis'][0];

    /* *
     *
     *  Functions
     *
     * */

    public destroy(): void {
        const series = this;

        if (series.tableListener) {
            series.tableListener();
            series.tableListener = void 0;
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

        fireEvent(series, 'setOptions', { userOptions: options });

        series.options = merge(
            series.options,
            (
                chart.options.plotOptions &&
                chart.options.plotOptions.series
            ),
            (
                chart.userOptions.plotOptions &&
                chart.userOptions.plotOptions[series.type]
            ),
            options
        );
        series.userOptions = merge(series.userOptions, options);

        fireEvent(series, 'afterSetOptions', { options: series.options });

        const table = DataSeries.getTableFromSeriesOptions(series.options);

        if (table) {
            series.setTable(table);
        }

        series.bindAxes();

        chart.series.push(series as any);

        fireEvent(series, 'afterInit');
    }

    public plotGroup(parent: SVGElement): SVGElement { console.log('DataSeries.plotGroup');
        const series = this,
            {
                chart,
                options,
                visible: visibility,
                xAxis,
                yAxis
            } = series,
            {
                zIndex
            } = options;

        return parent.renderer
            .g()
            .addClass('highcharts-data-series')
            .attr({
                translateX: xAxis ? xAxis.left : chart.plotLeft,
                translateY: yAxis ? yAxis.top : chart.plotTop,
                scaleX: 1,
                scaleY: 1,
                visibility,
                zIndex
            })
            .add(parent);
    }

    public redraw(): void {
        const series = this;
        series.translate();
        series.render();
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
    public setData(data: Array<DataPointOptions>): void { console.log('DataSeries.setData');
        const series = this;
        series.setTable(DataSeries.getTableFromSeriesOptions({
            data,
            keys: series.pointArrayMap
        }));
    }

    /**
     * Add or update points of table rows.
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

        if (series.tableListener) {
            series.tableListener();
        }

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
            } else if (point) {
                point.setTableRow(tableRow);
            } else {
                seriesData[i] = new SeriesPoint(series, tableRow);
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
    bindAxes: typeof CS.prototype.bindAxes;
    drawLegendSymbol: typeof LegendSymbolMixin.drawRectangle;
    pointArrayMap: Array<string>;
    pointClass: typeof DataPoint;
    type: string;
}
extend(DataSeries.prototype, {
    bindAxes: CS.prototype.bindAxes,
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
    pointArrayMap: ['y'],
    pointClass: DataPoint,
    type: 'data'
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

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
const { extend, fireEvent, merge } = U;

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
        this.options = merge(DataSeries.defaultOptions, options);
        this.points = [];
        this.table = DataSeries.getTableFromSeriesOptions(this.options);
        this.userOptions = options;
        this.visible = true;

        this.setTable(this.table);
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

    public readonly table: DataTable;

    public userOptions: DeepPartial<DataSeriesOptions>;

    public readonly visible: boolean;

    public xAxis?: Chart['xAxis'][0];

    public yAxis?: Chart['yAxis'][0];

    /* *
     *
     *  Functions
     *
     * */

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

    /** @deprecated */
    public init(chart: Chart, options: DataSeriesOptions): void { console.log('DataSeries.init');
        const series = this;

        fireEvent(this, 'init');

        series.chart = chart;
        series.options = merge(series.options, options);
        series.userOptions = merge(series.userOptions, options);

        series.bindAxes();
        chart.series.push(this as any);

        fireEvent(this, 'afterInit');
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
            } = options,
            plotBox: SVGAttributes = {
                translateX: xAxis ? xAxis.left : chart.plotLeft,
                translateY: yAxis ? yAxis.top : chart.plotTop,
                scaleX: 1,
                scaleY: 1,
                visibility,
                zIndex
            };

        return parent.renderer
            .g()
            .attr(plotBox)
            .add(parent);
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
            seriesTable = series.table,
            tableRows = table.getAllRows(),
            tableRowsLength = tableRows.length,
            SeriesPoint = series.pointClass;

        if (table.id !== seriesTable.id) {
            seriesTable.clear();
            seriesTable.id = table.id;
        }

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

        seriesData.length = tableRowsLength;
    }

    public translate(): void { console.log('DataSeries.translate');
        const series = this;

        series.points = series.data.slice();
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
}
extend(DataSeries.prototype, {
    bindAxes: CS.prototype.bindAxes,
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
    pointArrayMap: ['y'],
    pointClass: DataPoint
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

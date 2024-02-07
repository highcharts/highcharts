/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Gøran Slettemark
 *  - Wojciech Chmiel
 *  - Sebastian Bochan
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */


import type Board from '../../Board';
import type Cell from '../../Layout/Cell';
import type {
    AxisOptions,
    Chart,
    Options as ChartOptions,
    Highcharts as H,
    Point,
    Series,
    SeriesOptions
} from '../HighchartsTypes';
import type { ConstructorType, Options } from './HighchartsComponentOptions';
import type MathModifierOptions from '../../../Data/Modifiers/MathModifierOptions';
import type SidebarPopup from '../../EditMode/SidebarPopup';

import Component from '../../Components/Component.js';
import DataConnector from '../../../Data/Connectors/DataConnector.js';
import DataConverter from '../../../Data/Converters/DataConverter.js';
import DataTable from '../../../Data/DataTable.js';
import Globals from '../../Globals.js';
import HighchartsSyncHandlers from './HighchartsSyncHandlers.js';
import HighchartsComponentDefaults from './HighchartsComponentDefaults.js';
import U from '../../../Core/Utilities.js';
const {
    addEvent,
    createElement,
    diffObjects,
    isString,
    merge,
    splat,
    isObject
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 *
 * Class that represents a Highcharts component.
 *
 */
class HighchartsComponent extends Component {

    /* *
     *
     *  Static properties
     *
     * */

    /** @private */
    public static charter: H;

    /** @private */
    public static syncHandlers = HighchartsSyncHandlers;

    /**
     * Default options of the Highcharts component.
     */
    public static defaultOptions = merge(
        Component.defaultOptions,
        HighchartsComponentDefaults
    );

    /* *
     *
     *  Static functions
     *
     * */

    /**
     * Creates component from JSON.
     *
     * @param json
     * Set of component options, used for creating the Highcharts component.
     *
     * @returns
     * Highcharts component based on config from JSON.
     *
     * @private
     */
    public static fromJSON(
        json: HighchartsComponent.ClassJSON,
        cell: Cell
    ): HighchartsComponent {
        const options = json.options;
        const chartOptions = JSON.parse(json.options.chartOptions || '{}');
        // const store = json.store ? DataJSON.fromJSON(json.store) : void 0;

        const component = new HighchartsComponent(
            cell,
            merge<Options>(
                options as any,
                {
                    chartOptions,
                    // Highcharts, // TODO: Find a solution
                    // store: store instanceof DataConnector ? store : void 0,

                    // Get from static registry:
                    syncHandlers: HighchartsComponent.syncHandlers
                }
            )
        );

        component.emit({
            type: 'fromJSON',
            json
        });

        return component;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * A full set of chart options used by the chart.
     * [Highcharts API](https://api.highcharts.com/highcharts/)
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/highcharts-components/highcharts/  | Chart options}
     *
     */
    public chartOptions: Partial<ChartOptions>;

    /**
     * Reference to the chart.
     */
    public chart?: Chart;

    /**
     * HTML element where the chart is created.
     */
    public chartContainer: HTMLElement;

    /**
     * Highcharts component's options.
     */
    public options: Options;

    /**
     * Type of constructor used for creating proper chart like: chart, stock,
     * gantt or map.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/highcharts-components/chart-constructor-maps/ | Map constructor}
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/highcharts-components/chart-constructor-gantt/ | Gantt constructor}
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/highcharts-components/chart-and-stock-constructors/ | Chart and Stock constructors}
     *
     */
    public chartConstructor: ConstructorType;

    /**
     * Reference to sync component that allows to sync i.e tooltips.
     *
     * @private
     */
    public sync: Component['sync'];

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Creates a Highcharts component in the cell.
     *
     * @param options
     * The options for the component.
     */

    constructor(
        cell: Cell,
        options: Partial<Options>,
        board?: Board
    ) {
        options = merge(
            HighchartsComponent.defaultOptions,
            options
        );

        super(cell, options, board);
        this.options = options as Options;

        this.chartConstructor = this.options.chartConstructor || 'chart';
        this.type = 'Highcharts';

        this.chartContainer = createElement(
            'figure',
            void 0,
            void 0,
            this.contentElement,
            true
        );

        this.setOptions();
        this.sync = new HighchartsComponent.Sync(
            this,
            this.syncHandlers
        );

        this.chartOptions = merge((
            this.options.chartOptions ||
            { chart: {} } as Partial<ChartOptions>
        ), {
            tooltip: {} // Temporary fix for #18876
        });

        if (this.connector) {
            // reload the store when polling
            this.connector.on('afterLoad', (e: DataConnector.Event): void => {
                if (e.table && this.connector) {
                    this.connector.table.setColumns(e.table.getColumns());
                }
            });
        }

        this.innerResizeTimeouts = [];
    }

    public onTableChanged(): void {
        this.updateSeries();
    }
    /* *
     *
     *  Functions
     *
     * */

    /** @private */
    public async load(): Promise<this> {
        this.emit({ type: 'load' });

        await super.load();

        this.emit({ type: 'afterLoad' });

        return this;
    }

    public render(): this {
        const hcComponent = this;

        super.render();
        hcComponent.chart = hcComponent.getChart();
        hcComponent.updateSeries();

        if (!hcComponent.cell.container.style.height) {
            // If the cell height is specified, clear dimensions to make
            // the container to adjust to the chart height.
            hcComponent.contentElement.style.height = '100%';
            super.resize(null, null);
        }

        this.sync.start();
        hcComponent.emit({ type: 'afterRender' });
        hcComponent.setupConnectorUpdate();

        return this;
    }

    public resize(
        width?: number | string | null,
        height?: number | string | null
    ): this {
        super.resize(width, height);

        while (this.innerResizeTimeouts.length) {
            const timeoutID = this.innerResizeTimeouts.pop();
            if (timeoutID) {
                clearTimeout(timeoutID);
            }
        }

        this.innerResizeTimeouts.push(setTimeout((): void => {
            if (this.chart) {
                this.chart.setSize(
                    null,
                    this.contentElement.clientHeight,
                    false
                );
            }
        }, 33));

        return this;
    }

    /**
     * Adds call update value in store, when chart's point is updated.
     *
     * @private
     * */
    private setupConnectorUpdate(): void {
        const { connector: store, chart } = this;

        if (store && chart && this.options.allowConnectorUpdate) {
            chart.series.forEach((series): void => {
                series.points.forEach((point): void => {
                    addEvent(point, 'drag', (): void => {
                        this.onChartUpdate(point, store);
                    });
                });
            });
        }
    }

    /**
     * Internal method for handling option updates.
     *
     * @internal
     */
    private setOptions(): void {
        if (this.options.chartClassName) {
            this.chartContainer.classList.add(this.options.chartClassName);
        }

        if (this.options.chartID) {
            this.chartContainer.id = this.options.chartID;
        }
    }

    /**
     * Update the store, when the point is being dragged.
     * @param  {Point} point Dragged point.
     * @param  {Component.ConnectorTypes} store Connector to update.
     */
    private onChartUpdate(
        point: Point,
        store: Component.ConnectorTypes
    ): void {
        const table = store.table,
            columnName = point.series.name,
            rowNumber = point.index,
            converter = new DataConverter(),
            valueToSet = converter.asNumber(point.y);

        table.setCell(columnName, rowNumber, valueToSet);
    }
    /**
     * Handles updating via options.
     * @param options
     * The options to apply.
     *
     */
    public async update(
        options: Partial<Options>,
        shouldRerender: boolean = true
    ): Promise<void> {
        await super.update(options, false);
        this.setOptions();
        this.filterAndAssignSyncOptions(HighchartsSyncHandlers);

        if (this.chart) {
            this.chart.update(merge(this.options.chartOptions) || {});
        }
        this.emit({ type: 'afterUpdate' });

        shouldRerender && this.render();
    }

    /**
     * Updates chart's series when the data table is changed.
     *
     * @private
     */
    public updateSeries(): void {

        // Heuristically create series from the connector dataTable
        if (this.chart && this.connector) {
            this.presentationTable = this.presentationModifier ?
                this.connector.table.modified.clone() :
                this.connector.table;

            const { id: storeTableID } = this.connector.table;
            const { chart } = this;

            if (this.presentationModifier) {
                this.presentationTable = this.presentationModifier
                    .modifyTable(this.presentationTable).modified;
            }

            const table = this.presentationTable,
                modifierOptions = table.getModifier()?.options;

            // Names/aliases that should be mapped to xAxis values
            const columnNames = table.modified.getColumnNames();
            const columnAssignment = this.options.columnAssignment ||
                this.getDefaultColumnAssignment(columnNames);
            const xKeyMap: Record<string, string> = {};

            this.emit({ type: 'afterPresentationModifier', table: table });

            // Remove series names that match the xKeys
            const seriesNames = table.modified.getColumnNames()
                .filter((name): boolean => {
                    const isVisible = this.activeGroup ?
                        this.activeGroup
                            .getSharedState()
                            .getColumnVisibility(name) !== false :
                        true;

                    if (!isVisible || !columnAssignment[name]) {
                        return false;
                    }

                    if (columnAssignment[name] === 'x') {
                        xKeyMap[name] = name;
                        return false;
                    }

                    return true;
                });

            // create empty series for mapping custom props of data
            Object.keys(columnAssignment).forEach(
                function (key):void {
                    if (isObject(columnAssignment[key])) {
                        seriesNames.push(key);
                    }
                }
            );

            // Create the series or get the already added series
            const seriesList = seriesNames.map((seriesName, index): Series => {
                let i = 0;

                while (i < chart.series.length) {
                    const series = chart.series[i];
                    const seriesFromConnector = series.options.id === `${storeTableID}-series-${index}`;
                    const existingSeries =
                        seriesNames.indexOf(series.name) !== -1;
                    i++;

                    if (existingSeries && seriesFromConnector) {
                        return series;
                    }

                    if (
                        !existingSeries &&
                        seriesFromConnector
                    ) {
                        series.destroy();
                    }
                }

                // Disable dragging on series, which were created out of a
                // columns which are created by MathModifier.
                const shouldBeDraggable = !(
                    modifierOptions?.type === 'Math' &&
                    (modifierOptions as MathModifierOptions)
                        .columnFormulas?.some(
                            (formula): boolean => formula.column === seriesName
                        )
                );

                const seriesOptions = {
                    name: seriesName,
                    id: `${storeTableID}-series-${index}`,
                    dragDrop: {
                        draggableY: shouldBeDraggable
                    }
                };

                const relatedSeries =
                    chart.series.find(
                        (series):boolean => series.name === seriesName
                    );

                if (relatedSeries) {
                    relatedSeries.update(seriesOptions, false);
                    return relatedSeries;
                }

                return chart.addSeries(seriesOptions, false);
            });

            // Insert the data
            seriesList.forEach((series): void => {
                const xKey = Object.keys(xKeyMap)[0],
                    isSeriesColumnMap =
                        isObject(columnAssignment[series.name]),
                    pointColumnMapValues:Array<string> = [];

                if (isSeriesColumnMap) {
                    const pointColumns =
                        columnAssignment[series.name] as Record<string, string>;

                    Object.keys(pointColumns).forEach((key):void => {
                        pointColumnMapValues.push(pointColumns[key]);
                    });
                }

                const columnKeys = isSeriesColumnMap ?
                    [xKey].concat(pointColumnMapValues) : [xKey, series.name];

                const seriesTable = new DataTable({
                    columns: table.modified.getColumns(columnKeys)
                });

                if (!isSeriesColumnMap) {
                    seriesTable.renameColumn(series.name, 'y');
                }

                if (xKey) {
                    seriesTable.renameColumn(xKey, 'x');
                }
                const seriesData = seriesTable.getRowObjects().reduce((
                    arr: (number | {})[],
                    row: Record<string, any>
                ): (number | {})[] => {
                    if (isSeriesColumnMap) {
                        arr.push(
                            [row.x].concat(
                                pointColumnMapValues.map(
                                    function (value: string):number|undefined {
                                        return row[value];
                                    }
                                )
                            )
                        );
                    } else {
                        arr.push([row.x, row.y]);
                    }
                    return arr;
                }, []);

                series.setData(seriesData);
            });
        }
    }

    /**
     * Destroy chart and create a new one.
     *
     * @returns
     * The chart.
     *
     * @private
     *
     */
    private getChart(): Chart|undefined {
        return this.chart || this.createChart();
    }

    /**
     * Creates default mapping when columnAssignment is not declared.
     * @param  { Array<string>} columnNames all columns returned from dataTable.
     *
     * @returns
     * The record of mapping
     *
     * @private
     *
     */
    private getDefaultColumnAssignment(
        columnNames: Array<string> = []
    ): Record<string, string | null> {
        const defaultColumnAssignment:Record<string, string> = {};

        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            defaultColumnAssignment[columnNames[i]] = 'y';
            if (i === 0) {
                const firstColumnValues =
                    this.presentationTable?.getColumn(columnNames[i], true);

                if (firstColumnValues && isString(firstColumnValues[0])) {
                    defaultColumnAssignment[columnNames[i]] = 'x';
                }
            }
        }

        return defaultColumnAssignment;
    }

    /**
     * Creates chart.
     *
     * @returns
     * The chart.
     *
     * @private
     *
     */
    private createChart(): Chart|undefined {
        const charter = HighchartsComponent.charter || Globals.win.Highcharts;

        if (!this.chartConstructor) {
            this.chartConstructor = 'chart';
        }

        const Factory = charter[this.chartConstructor];
        if (Factory) {
            try {
                if (this.chartConstructor === 'chart') {
                    return charter.Chart.chart(
                        this.chartContainer,
                        this.chartOptions
                    );
                }
                return new Factory(this.chartContainer, this.chartOptions);
            } catch {
                throw new Error(
                    'The Highcharts component is misconfigured: `' +
                    this.cell.id + '`'
                );
            }
        }

        if (typeof charter.chart !== 'function') {
            throw new Error('Chart constructor not found');
        }

        return this.chart;
    }

    /**
     * Registers events from the chart options to the callback register.
     *
     * @private
     */
    private registerChartEvents(): void {
        if (this.chart && this.chart.options) {
            const options = this.chart.options;
            const allEvents = [
                'chart',
                'series',
                'yAxis',
                'xAxis',
                'colorAxis',
                'annotations',
                'navigation'
            ].map((optionKey: string): Record<string, any> => {
                let seriesOrAxisOptions = (options as any)[optionKey] || {};

                if (
                    !Array.isArray(seriesOrAxisOptions) &&
                    seriesOrAxisOptions.events
                ) {
                    seriesOrAxisOptions = [seriesOrAxisOptions];
                }

                if (
                    seriesOrAxisOptions &&
                    typeof seriesOrAxisOptions === 'object' &&
                    Array.isArray(seriesOrAxisOptions)
                ) {
                    return seriesOrAxisOptions.reduce(
                        (
                            acc: Record<string, any>,
                            seriesOrAxis: SeriesOptions | AxisOptions,
                            i: number
                        ): Record<string, {}> => {
                            if (seriesOrAxis && seriesOrAxis.events) {
                                acc[seriesOrAxis.id || `${optionKey}-${i}`] = seriesOrAxis.events;
                            }
                            return acc;
                        }, {}) || {};
                }

                return {};
            });


            allEvents.forEach((options): void => {
                Object.keys(options).forEach((key): void => {
                    const events = options[key];
                    Object.keys(events).forEach((callbackKey): void => {
                        this.callbackRegistry.addCallback(`${key}-${callbackKey}`, {
                            type: 'seriesEvent',
                            func: events[callbackKey]
                        });
                    });
                });
            });
        }
    }
    public setConnector(connector: DataConnector | undefined): this {
        const chart = this.chart;
        if (
            this.connector &&
            chart &&
            chart.series &&
            this.connector.table.id !== connector?.table.id
        ) {
            const storeTableID = this.connector.table.id;
            for (let i = chart.series.length - 1; i >= 0; i--) {
                const series = chart.series[i];

                if (series.options.id?.indexOf(storeTableID) !== -1) {
                    series.remove(false);
                }
            }
        }
        super.setConnector(connector);


        return this;
    }

    public getOptionsOnDrop(sidebar: SidebarPopup): Partial<Options> {
        const connectorsIds =
            sidebar.editMode.board.dataPool.getConnectorIds();

        let options: Partial<Options> = {
            cell: '',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    animation: false,
                    type: 'column',
                    zooming: {}
                }
            }
        };

        if (connectorsIds.length) {
            options = {
                ...options,
                connector: {
                    id: connectorsIds[0]
                }
            };
        }

        return options;
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @returns
     * Class JSON of this Component instance.
     *
     * @private
     */
    public toJSON(): HighchartsComponent.ClassJSON {
        const chartOptions = JSON.stringify(this.options.chartOptions),
            chartConstructor = this.options.chartConstructor || 'chart';

        this.registerChartEvents();

        const base = super.toJSON();

        const json: HighchartsComponent.ClassJSON = {
            ...base,
            type: 'Highcharts',
            options: {
                ...base.options,
                chartOptions,
                chartConstructor,
                // TODO: may need to handle callback functions
                // Maybe have a sync.toJSON()
                type: 'Highcharts',
                sync: {}
            }
        };

        this.emit({ type: 'toJSON', json });
        return json;
    }

    /**
     * Get the HighchartsComponent component's options.
     * @returns
     * The JSON of HighchartsComponent component's options.
     *
     * @internal
     *
     */
    public getOptions(): Partial<Options> {
        return {
            ...diffObjects(this.options, HighchartsComponent.defaultOptions),
            type: 'Highcharts'
        };
    }

    public getEditableOptions(): Options {
        const component = this;
        const componentOptions = component.options;
        const chart = component.chart;
        const chartOptions = chart && chart.options;
        const chartType = chartOptions && chartOptions.chart?.type || 'line';

        return merge(componentOptions, {
            chartOptions
        }, {
            chartOptions: {
                yAxis: splat(chart && chart.yAxis[0].options),
                xAxis: splat(chart && chart.xAxis[0].options),
                plotOptions: {
                    series: ((chartOptions && chartOptions.plotOptions) ||
                        {})[chartType]
                }
            }
        });
    }


    public getEditableOptionValue(
        propertyPath?: string[]
    ): number | boolean | undefined | string {
        const component = this;
        if (!propertyPath) {
            return;
        }

        if (propertyPath.length === 1 && propertyPath[0] === 'chartOptions') {
            return JSON.stringify(component.options.chartOptions, null, 2);
        }

        return super.getEditableOptionValue.call(this, propertyPath);
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

/** @private */
namespace HighchartsComponent {

    /* *
    *
    *  Declarations
    *
    * */

    /** @private */
    export type ComponentType = HighchartsComponent;

    /** @private */
    export type ChartComponentEvents =
        JSONEvent |
        Component.EventTypes;

    /** @private */
    export type JSONEvent = Component.Event<'toJSON' | 'fromJSON', {
        json: ClassJSON;
    }>;

    /** @private */
    export interface OptionsJSON extends Component.ComponentOptionsJSON {
        chartOptions?: string;
        chartClassName?: string;
        chartID?: string;
        chartConstructor: ConstructorType;
        type: 'Highcharts'
    }
    /** @private */
    export interface ClassJSON extends Component.JSON {
        options: OptionsJSON;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default HighchartsComponent;

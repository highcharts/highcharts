/* *
 *
 *  (c) 2009-2023 Highsoft AS
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

import type AxisOptions from '../../Core/Axis/AxisOptions';
import type Chart from '../../Core/Chart/Chart';
import type ChartOptions from '../../Core/Options';
import type Series from '../../Core/Series/Series';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import type Point from '../../Core/Series/Point';

import Component from '../../Dashboards/Components/Component.js';
import DataConnector from '../../Data/Connectors/DataConnector.js';
import DataConverter from '../../Data/Converters/DataConverter.js';
import DataTable from '../../Data/DataTable.js';
import G from '../../Core/Globals.js';
import HighchartsSyncHandlers from './HighchartsSyncHandlers.js';
import U from '../../Core/Utilities.js';

const {
    addEvent,
    createElement,
    merge,
    splat,
    isArray,
    uniqueKey
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/GlobalsLike' {
    interface GlobalsLike {
        chart: typeof Chart.chart;
        ganttChart: typeof Chart.chart;
        mapChart: typeof Chart.chart;
        stockChart: typeof Chart.chart;
    }
}

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

    /** @internal */
    public static charter?: typeof G;

    /** @internal */
    public static syncHandlers = HighchartsSyncHandlers;

    /**
     * Default options of the Highcharts component.
     */
    public static defaultOptions = merge(
        Component.defaultOptions,
        {
            /**
             * Whether to allow the component to edit the store to which it is
             * attached.
             * @default true
             */
            allowConnectorUpdate: true,
            chartClassName: 'chart-container',
            chartID: 'chart-' + uniqueKey(),
            chartOptions: {
                series: []
            },
            chartConstructor: '',
            editableOptions:
            (Component.defaultOptions.editableOptions || []).concat([
                {
                    name: 'chartOptions',
                    type: 'nested',
                    detailedOptions: [{
                        name: 'chart',
                        options: [{
                            name: 'title',
                            propertyPath: ['chartOptions', 'title', 'text'],
                            type: 'input'
                        }, {
                            name: 'subtitle',
                            propertyPath: ['chartOptions', 'subtitle', 'text'],
                            type: 'input'
                        }, {
                            name: 'type',
                            propertyPath: ['chartOptions', 'chart', 'type'],
                            type: 'select',
                            items: [{
                                name: 'column',
                                iconURL: 'series-types/icon-column.svg'
                            }, {
                                name: 'line',
                                iconURL: 'series-types/icon-line.svg'
                            }, {
                                name: 'scatter',
                                iconURL: 'series-types/icon-scatter.svg'
                            }, {
                                name: 'pie',
                                iconURL: 'series-types/icon-pie.svg'
                            }]
                        }]
                    }, {
                        name: 'xAxis',
                        options: [{
                            name: 'title',
                            propertyPath:
                                ['chartOptions', 'xAxis', 'title', 'text'],
                            type: 'input'
                        }, {
                            name: 'type',
                            propertyPath: ['chartOptions', 'xAxis', 'type'],
                            type: 'select',
                            items: [{
                                name: 'linear'
                            }, {
                                name: 'datetime'
                            }, {
                                name: 'logarithmic'
                            }]
                        }]
                    }, {
                        name: 'yAxis',
                        options: [{
                            name: 'title',
                            propertyPath:
                                ['chartOptions', 'yAxis', 'title', 'text'],
                            type: 'input'
                        }, {
                            name: 'type',
                            propertyPath: ['chartOptions', 'yAxis', 'type'],
                            type: 'select',
                            items: [{
                                name: 'linear'
                            }, {
                                name: 'datetime'
                            }, {
                                name: 'logarithmic'
                            }]
                        }]
                    }, {
                        name: 'legend',
                        allowEnabled: true,
                        propertyPath: ['chartOptions', 'legend', 'enabled'],
                        options: [{
                            name: 'align',
                            propertyPath: ['chartOptions', 'legend', 'align'],
                            type: 'select',
                            items: [{
                                name: 'left'
                            }, {
                                name: 'center'
                            }, {
                                name: 'right'
                            }]
                        }]
                    }, {
                        name: 'tooltip',
                        allowEnabled: true,
                        propertyPath: ['chartOptions', 'tooltip', 'enabled'],
                        options: [{
                            title: 'split',
                            propertyPath: ['chartOptions', 'tooltip', 'split'],
                            type: 'toggle'
                        }]
                    }, {
                        name: 'dataLabels',
                        propertyPath: [
                            'chartOptions',
                            'plotOptions',
                            'series',
                            'dataLabels',
                            'enabled'
                        ],
                        allowEnabled: true,
                        options: [{
                            name: 'align',
                            propertyPath: [
                                'chartOptions',
                                'plotOptions',
                                'series',
                                'dataLabels',
                                'align'
                            ],
                            type: 'select',
                            items: [{
                                name: 'left'
                            }, {
                                name: 'center'
                            }, {
                                name: 'right'
                            }]
                        }]
                    }, {
                        name: 'credits',
                        allowEnabled: true,
                        propertyPath: ['chartOptions', 'credits', 'enabled'],
                        options: [{
                            name: 'name',
                            propertyPath: [
                                'chartOptions',
                                'credits',
                                'text'
                            ],
                            type: 'input'
                        }, {
                            name: 'url',
                            propertyPath: [
                                'chartOptions',
                                'credits',
                                'href'
                            ],
                            type: 'input'
                        }]
                    }]
                }, {
                    name: 'chartConfig',
                    propertyPath: ['chartOptions'],
                    type: 'textarea'
                }, {
                    name: 'chartClassName',
                    propertyPath: ['chartClassName'],
                    type: 'input'
                }, {
                    name: 'chartID',
                    propertyPath: ['chartID'],
                    type: 'input'
                }
            ]),
            syncHandlers: HighchartsSyncHandlers,
            editableOptionsBindings: merge(
                Component.defaultOptions.editableOptionsBindings,
                {
                    skipRedraw: [
                        'chartOptions',
                        'chartConfig'
                    ]
                }),
            columnKeyMap: {}
        }
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
     * @internal
     */
    public static fromJSON(
        json: HighchartsComponent.ClassJSON
    ): HighchartsComponent {
        const options = json.options;
        const chartOptions = JSON.parse(json.options.chartOptions || '{}');
        // const store = json.store ? DataJSON.fromJSON(json.store) : void 0;

        const component = new HighchartsComponent(
            merge<HighchartsComponent.Options>(
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
     */
    public chartOptions: Partial<ChartOptions>;
    /**
     * Reference to the chart.
     */
    public chart: Chart | undefined;
    /**
     * HTML element where the chart is created.
     */
    public chartContainer: HTMLElement;
    /**
     * Highcharts component's options.
     */
    public options: HighchartsComponent.Options;
    /**
     * Type of constructor used for creating proper chart like: chart, stock,
     * gantt or map.
     */
    public chartConstructor: HighchartsComponent.ConstructorType;
    /**
     * Reference to sync component that allows to sync i.e tooltips.
     *
     * @internal
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
    constructor(options: Partial<HighchartsComponent.Options>) {
        options = merge(
            HighchartsComponent.defaultOptions,
            options
        );
        super(options);
        this.options = options as HighchartsComponent.Options;

        this.chartConstructor = this.options.chartConstructor;
        this.type = 'Highcharts';

        this.chartContainer = createElement(
            'figure',
            void 0,
            void 0,
            void 0,
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
            this.on('tableChanged', (): void => this.updateSeries());

            // reload the store when polling
            this.connector.on('afterLoad', (e: DataConnector.Event): void => {
                if (e.table && this.connector) {
                    this.connector.table.setColumns(e.table.getColumns());
                }
            });
        }

        this.innerResizeTimeouts = [];

        // Add the component instance to the registry
        Component.addInstance(this);

    }

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    public load(): this {
        this.emit({ type: 'load' });
        super.load();
        this.parentElement.appendChild(this.element);
        this.contentElement.appendChild(this.chartContainer);
        this.hasLoaded = true;

        this.emit({ type: 'afterLoad' });

        return this;
    }

    public render(): this {
        const hcComponent = this;

        hcComponent.emit({ type: 'beforeRender' });
        super.render();
        hcComponent.chart = hcComponent.initChart();
        hcComponent.updateSeries();

        this.sync.start();
        hcComponent.emit({ type: 'afterRender' });
        hcComponent.setupConnectorUpdate();

        addEvent(hcComponent.chart, 'afterUpdate', function ():void {
            const options = this.userOptions;

            if (hcComponent.hasLoaded) {
                hcComponent.updateComponentOptions({
                    chartOptions: options
                }, false);
            }
        });
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
     * @internal
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

        this.syncHandlers = this.handleSyncOptions(HighchartsSyncHandlers);
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
            rowNumber = point.x,
            converter = new DataConverter(),
            valueToSet = converter.asNumber(point.y);

        table.setCell(columnName, rowNumber, valueToSet);
    }
    /**
     * Handles updating via options.
     * @param options
     * The options to apply.
     *
     * @param redraw
     * The flag triggers the main redraw operation.
     *
     * @internal
     */
    private updateComponentOptions(
        options: Partial<HighchartsComponent.Options>,
        redraw = true
    ): void {
        super.update(options, redraw);
    }

    /**
     * Handles updating via options.
     * @param options
     * The options to apply.
     *
     * @returns
     * The component for chaining
     */
    public update(
        options: Partial<HighchartsComponent.Options>
    ): this {
        this.updateComponentOptions(options, false);
        this.setOptions();

        if (this.chart) {
            this.chart.update(merge(this.options.chartOptions) || {});
        }
        this.emit({ type: 'afterUpdate' });
        return this;
    }

    /**
     * Updates chart's series when the data table is changed.
     *
     * @internal
     */
    private updateSeries(): void {
        // Heuristically create series from the store dataTable
        if (this.chart && this.connector) {
            this.presentationTable = this.presentationModifier ?
                this.connector.table.modified.clone() :
                this.connector.table;

            const { id: storeTableID } = this.connector.table;
            const { chart } = this;

            // Names/aliases that should be mapped to xAxis values
            const columnKeyMap = this.options.columnKeyMap || {};
            const xKeyMap: Record<string, string> = {};

            if (this.presentationModifier) {
                this.presentationTable = this.presentationModifier
                    .modifyTable(this.presentationTable).modified;
            }

            const table = this.presentationTable;

            this.emit({ type: 'afterPresentationModifier', table: table });

            // Remove series names that match the xKeys
            const seriesNames = table.modified.getColumnNames()
                .filter((name): boolean => {
                    const isVisible = this.activeGroup ?
                        this.activeGroup
                            .getSharedState()
                            .getColumnVisibility(name) !== false :
                        true;

                    if (!isVisible && !columnKeyMap[name]) {
                        return false;
                    }

                    if (columnKeyMap[name] === null) {
                        return false;
                    }

                    if (columnKeyMap[name] === 'x') {
                        xKeyMap[name] = name;
                        return false;
                    }

                    return true;
                });

            // Create the series or get the already added series
            const seriesList = seriesNames.map((seriesName, index): Series => {
                let i = 0;
                while (i < chart.series.length) {
                    const series = chart.series[i];
                    const seriesFromConnector = series.options.id === `${storeTableID}-series-${index}`;
                    const existingSeries =
                        seriesNames.indexOf(series.name) !== -1;
                    i++;

                    if (
                        existingSeries &&
                        seriesFromConnector
                    ) {
                        return series;
                    }

                    if (
                        !existingSeries &&
                        seriesFromConnector
                    ) {
                        series.destroy();
                    }
                }

                return chart.addSeries({
                    name: seriesName,
                    id: `${storeTableID}-series-${index}`
                }, false);
            });

            // Insert the data
            seriesList.forEach((series): void => {
                const xKey = Object.keys(xKeyMap)[0];
                const seriesTable = new DataTable({
                    columns: table.modified.getColumns([xKey, series.name])
                });

                seriesTable.renameColumn(series.name, 'y');

                if (xKey) {
                    seriesTable.renameColumn(xKey, 'x');
                }
                const seriesData = seriesTable.getRowObjects().reduce((
                    arr: (number | {})[],
                    row
                ): (number | {})[] => {
                    arr.push([row.x, row.y]);
                    return arr;
                }, []);

                series.setData(seriesData);
            });

            /* chart.redraw(); */
        }
    }

    /**
     * Destroy chart and create a new one.
     *
     * @returns
     * The chart.
     *
     * @internal
     *
     */
    private initChart(): Chart {
        if (this.chart) {
            this.chart.destroy();
        }
        return this.constructChart();
    }

    /**
     * Creates chart.
     *
     * @returns
     * The chart.
     *
     * @internal
     *
     */
    private constructChart(): Chart {
        const charter = (HighchartsComponent.charter || G);
        if (this.chartConstructor !== 'chart') {
            const factory = charter[this.chartConstructor] || G.chart;
            if (factory) {
                return factory(this.chartContainer, this.chartOptions);
            }
        }

        if (typeof charter.chart !== 'function') {
            throw new Error('Chart constructor not found');
        }

        this.chart = charter.chart(this.chartContainer, this.chartOptions);

        return this.chart;
    }

    /**
     * Registers events from the chart options to the callback register.
     *
     * @internal
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
    /**
     * Converts the class instance to a class JSON.
     *
     * @returns
     * Class JSON of this Component instance.
     *
     * @internal
     */
    public toJSON(): HighchartsComponent.ClassJSON {
        const chartOptions = JSON.stringify(this.options.chartOptions),
            chartConstructor = this.options.chartConstructor;

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


    public getEditableOptions(): HighchartsComponent.Options {
        const component = this;
        const componentOptions = component.options;
        const chart = component.chart;
        const chartOptions = chart && chart.options;
        const chartType = chartOptions && chartOptions.chart.type || 'line';

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

namespace HighchartsComponent {

    /* *
    *
    *  Declarations
    *
    * */

    /** @internal */
    export type ComponentType = HighchartsComponent;

    /** @internal */
    export type ConstructorType = (
        'chart' | 'stockChart' | 'mapChart' | 'ganttChart'
    );

    /** @internal */
    export type ChartComponentEvents =
        JSONEvent |
        Component.EventTypes;

    /** @internal */
    export type JSONEvent = Component.Event<'toJSON' | 'fromJSON', {
        json: ClassJSON;
    }>;
    export interface Options extends Component.ComponentOptions, EditableOptions {

        /**
         * Whether to allow the component to edit the store to which it is
         * attached.
         */
        allowConnectorUpdate?: boolean,
        /**
         * The string that declares constructor that is called for creating
         * a chart.
         *
         * Example: `chart`, `stockChart`, `mapChart` or `ganttChart`.
         *
         */
        chartConstructor: ConstructorType;
        /**
         * Type of the component.
         */
        type: 'Highcharts';
    }
    /** @internal */
    export interface EditableOptions extends Component.EditableOptions {
        /**
         * A full set of chart options used by the chart.
         * [Highcharts API](https://api.highcharts.com/highcharts/)
         */
        chartOptions: Partial<ChartOptions>;
        /**
         * The name of class that is applied to the chart's container.
         */
        chartClassName?: string;
        /**
         * The id that is applied to the chart's container.
         */
        chartID?: string;
        /**
         * Names / aliases that should be mapped to xAxis values.
         * ```
         * Example
         * columnKeyMap: {
         *      'Food': 'x',
         *      'Vitamin A': 'y'
         * }
         * ```
         */
        columnKeyMap?: Record<string, string | null>;
    }
    /** @internal */
    export interface OptionsJSON extends Component.ComponentOptionsJSON {
        chartOptions?: string;
        chartClassName?: string;
        chartID?: string;
        chartConstructor: ConstructorType;
        type: 'Highcharts'
    }
    /** @internal */
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

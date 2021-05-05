import type Series from '../../Core/Series/Series';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import Chart from '../../Core/Chart/Chart.js';
import Component from './Component.js';
import DataStore from '../../Data/Stores/DataStore.js';
import DataJSON from '../../Data/DataJSON.js';
import DataTable from '../../Data/DataTable.js';
import Highcharts from '../../masters/highcharts.src.js';
import {
    ChartSyncHandler,
    ChartSyncEmitter,
    defaults as defaultHandlers
} from './ChartSyncHandlers.js';

import U from '../../Core/Utilities.js';
const {
    createElement,
    merge,
    uniqueKey
} = U;

/* *
 *
 *  Class
 *
 * */
class ChartComponent extends Component<ChartComponent.ChartComponentEvents> {

    /* *
     *
     *  Static properties
     *
     * */

    public static syncHandlers = defaultHandlers;

    public static defaultOptions = merge(
        Component.defaultOptions,
        {
            chartClassName: 'chart-container',
            chartID: 'chart-' + uniqueKey(),
            chartOptions: {
                series: []
            },
            Highcharts,
            chartConstructor: '',
            syncEvents: [],
            syncHandlers: ChartComponent.syncHandlers,
            editableOptions: [
                ...Component.defaultOptions.editableOptions,
                'chartOptions',
                'chartClassName',
                'chartID'
            ],
            tableAxisMap: {}
        });

    public static fromJSON(json: ChartComponent.ClassJSON): ChartComponent {
        const options = json.options;
        const chartOptions = JSON.parse(json.options.chartOptions || '');
        const store = json.store ? DataJSON.fromJSON(json.store) : void 0;

        const component = new ChartComponent(
            merge(
                options,
                {
                    chartOptions,
                    Highcharts, // TODO: Find a solution
                    store: store instanceof DataStore ? store : void 0,
                    syncHandlers: ChartComponent.syncHandlers // Get from static registry
                }
            )
        );

        component.emit({
            type: 'fromJSOM',
            json,
            component
        });

        return component;
    }

    /* *
     *
     *  Properties
     *
     * */

    public chartOptions: Highcharts.Options;
    public chart: Chart;
    public chartContainer: HTMLElement;
    public options: ChartComponent.ComponentOptions;
    public charter: typeof Highcharts;
    public chartConstructor: ChartComponent.constructorType;
    public syncEvents: ChartComponent.syncEventsType[];
    public syncHandlers: Record<string, ChartComponent.syncHandlersType>;

    private syncHandlerRegistry: Record<string, ChartSyncHandler>
    /* *
     *
     *  Constructor
     *
     * */

    constructor(options: Partial<ChartComponent.ComponentOptions>) {
        options = merge(
            ChartComponent.defaultOptions,
            options
        );
        super(options);
        this.options = options as ChartComponent.ComponentOptions;

        this.charter = this.options.Highcharts;
        this.chartConstructor = this.options.chartConstructor;
        this.type = 'chart';

        this.chartContainer = createElement(
            'figure',
            void 0,
            void 0,
            void 0,
            true
        );

        // Todo: this.setOptions?
        if (this.options.chartClassName) {
            this.chartContainer.classList.add(this.options.chartClassName);
        }
        if (this.options.chartID) {
            this.chartContainer.id = this.options.chartID;
        }

        this.syncEvents = this.options.syncEvents;
        this.syncHandlers = this.options.syncHandlers;
        this.syncHandlerRegistry = {};
        this.chartOptions = this.options.chartOptions || { chart: {} };
        this.chart = this.constructChart();

        if (this.store) {
            // TODO: this may be implemented on the table now
            this.on('tableChanged', (e): void => {
                if (!e.detail || (e.detail && e.detail.sender !== this.id)) {
                    this.updateSeries();
                }
            });

            // reload the store when polling
            this.store.on('afterLoad', (e): void => {
                if (e.table && this.store) {
                    this.store.table.setColumns(e.table.getColumns());
                }
            });
        }


        this.innerResizeTimeouts = [];

        // Add the component instance to the registry
        Component.addInstance(this);
    }

    /* *
     *
     *  Class methods
     *
     * */

    public load(): this {
        const component = this;
        this.emit({
            type: 'load',
            component
        });
        super.load();
        this.parentElement.appendChild(this.element);
        this.contentElement.appendChild(this.chartContainer);
        this.initChart();
        this.hasLoaded = true;

        this.emit({ type: 'afterLoad' });

        return this;
    }

    public render(): this {
        super.render();
        this.emit({ type: 'afterRender' });
        return this;
    }

    public redraw(): this {
        super.redraw();
        this.initChart();
        return this.render();
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
                    this.chart.options.chart.animation
                );
            }
        }, 33));

        return this;
    }

    public update(options: Partial<ChartComponent.ComponentOptions>): this {
        super.update(options);
        if (this.chart) {
            this.chart.update(this.options.chartOptions || {});
        }
        this.emit({ type: 'afterUpdate' });
        return this;
    }

    private updateSeries(): void {
        // Heuristically create series from the store datatable
        if (this.store && this.store.table) {
            const { table } = this.store;

            // Names/aliases that should be mapped to xAxis values
            const xKeys = Object.keys(this.options.tableAxisMap || {});
            const seriesNames = table.getColumnNames(true);
            const xKeyMap: Record<string, string> = {};

            // Remove series names that match the xKeys
            seriesNames.forEach((name, index): void => {
                for (let i = 0; i < xKeys.length; i++) {
                    const key = xKeys[i];
                    if (key.toLowerCase() === name.toLowerCase()) {
                        xKeyMap[name] = key;
                        seriesNames.splice(index, 1);
                        break; // We only need the first match
                    }
                }
            });

            // Create the series or get the already added series
            const seriesList = seriesNames.map((seriesName, index): Series => {
                let i = 0;
                while (i < this.chart.series.length) {
                    const series = this.chart.series[i];
                    if (series.name === seriesName) {
                        return series;
                    }
                    i++;
                }

                return this.chart.addSeries({
                    name: seriesName,
                    id: `${table.id}-series-${index}`
                }, false);
            }
            );

            // Insert the data
            seriesList.forEach((series): void => {
                const xKey = Object.keys(xKeyMap)[0];
                const seriesTable = new DataTable(
                    table.getColumns([xKey, series.name])
                );

                seriesTable.renameColumn(series.name, 'y');

                if (xKey) {
                    seriesTable.renameColumn(xKey, 'x');
                }

                series.setData(seriesTable, false);
            });
        }

        this.chart.redraw();
    }

    public registerSyncHandler(handler: ChartSyncHandler): void {
        const { id } = handler;
        this.syncHandlerRegistry[id] = handler;
    }

    public getSyncHandler(handlerID: string): ChartSyncHandler | undefined {
        return this.syncHandlerRegistry[handlerID];
    }

    private initChart(): void {
        this.chart = this.constructChart();
        this.updateSeries();
        this.setupSync();
    }

    private setupSync(): void {
        Object.keys(this.syncHandlers).forEach((id: string): void => {
            if (this.syncEvents.indexOf(id as ChartComponent.syncEventsType) > -1) {
                const { emitter, handler } = this.syncHandlers[id];
                if (handler instanceof ChartSyncHandler) {
                    // Avoid registering the same handler multiple times
                    // i.e. panning and selection uses the same handler
                    const existingHandler = this.getSyncHandler(handler.id);
                    if (!existingHandler) {
                        this.registerSyncHandler(handler);
                        handler.createHandler(this)();
                    }
                } else if (typeof handler === 'function') {
                    handler(this);
                }

                // Probably should register this also
                if (emitter instanceof ChartSyncEmitter) {
                    emitter.createEmitter(this)();
                } else if (emitter instanceof Function) {
                    emitter(this);
                }
            }
        });

    }

    private constructChart(): Chart {
        const constructorMap = {
            '': 'chart',
            stock: 'stockChart',
            map: 'mapChart',
            gantt: 'ganttChart'
        };

        if (this.chartConstructor !== 'chart') {
            const constructor = constructorMap[this.chartConstructor];
            if ((this.charter as any)[constructor]) {
                this.chart = new (this.charter as any)[constructor](this.chartContainer, this.chartOptions);
                if (this.chart instanceof Chart) {
                    return this.chart;
                }
            }
        }

        if (typeof this.charter.chart !== 'function') {
            throw new Error('Chart constructor not found');
        }

        this.chart = this.charter.chart(this.chartContainer, this.chartOptions);

        return this.chart;
    }

    /**
     * Registers events from the chart options to the callback register
     */
    private registerChartEvents(): void {
        if (this.chart.options) {
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

                if (!Array.isArray(seriesOrAxisOptions) && seriesOrAxisOptions.events) {
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
                            seriesOrAxis: SeriesOptions | Highcharts.AxisOptions,
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

    public toJSON(): ChartComponent.ClassJSON {
        const chartOptions = JSON.stringify(this.options.chartOptions),
            Highcharts = this.options.Highcharts,
            chartConstructor = this.options.chartConstructor;

        this.registerChartEvents();

        const base = super.toJSON();

        const json = {
            ...base,
            options: {
                ...base.options,
                chartOptions,
                Highcharts: Highcharts.product,
                chartConstructor,
                syncEvents: this.syncEvents
            }
        };

        this.emit({
            type: 'toJSON',
            component: this,
            json
        });
        return json;
    }
}

/* *
 *
 *  Namespace
 *
 * */
namespace ChartComponent {

    export type ComponentType = ChartComponent;
    export type constructorType = 'chart' | 'stock' | 'map' | 'gantt';

    export type syncEventsType = 'visibility'| 'selection' | 'tooltip' | 'panning';
    export type syncHandlersType = { emitter: Function | ChartSyncEmitter; handler: Function | ChartSyncHandler };

    export type ChartComponentEvents =
        JSONEvent |
        Component.EventTypes;

    export interface JSONEvent extends Component.Event {
        readonly type: 'toJSON' | 'fromJSOM';
        json?: ChartComponent.ClassJSON;
    }
    export interface ComponentOptions extends Component.ComponentOptions, EditableOptions {
        Highcharts: typeof Highcharts;
        chartConstructor: ChartComponent.constructorType;
        syncEvents: syncEventsType[];
        syncHandlers: Record<syncEventsType, syncHandlersType>;
    }

    export interface EditableOptions extends Component.EditableOptions {
        chartOptions?: Highcharts.Options;
        chartClassName?: string;
        chartID?: string;
        tableAxisMap?: Record<string, string>;
    }

    export interface ComponentJSONOptions extends Component.ComponentJSONOptions {
        chartOptions?: string;
        chartClassName?: string;
        chartID?: string;
        Highcharts: string; // reference?
        chartConstructor: ChartComponent.constructorType;
        syncEvents: syncEventsType[];
    }


    export interface ClassJSON extends Component.ClassJSON {
        options: ChartComponent.ComponentJSONOptions;
    }
}

/* *
 *
 *  Default export
 *
 * */
export default ChartComponent;

import type Series from '../../Core/Series/Series.js';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import type Options from '../../Core/Options.js';
import type AxisOptions from '../../Core/Axis/AxisOptions.js';
import SyncEmitter from './Sync/Emitter.js';
import SyncHandler from './Sync/Handler.js';

import Chart from '../../Core/Chart/Chart.js';
import Component from './Component.js';
import DataStore from '../../Data/Stores/DataStore.js';
import DataJSON from '../../Data/DataJSON.js';
import DataTable from '../../Data/DataTable.js';
import Highcharts from '../../masters/highcharts.src.js';
import defaultHandlers from './Sync/ChartSyncHandlers.js';

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
            json
        });

        return component;
    }

    /* *
     *
     *  Properties
     *
     * */

    public chartOptions: Options;
    public chart: Chart | undefined;
    public chartContainer: HTMLElement;
    public options: ChartComponent.ComponentOptions;
    public charter: typeof Highcharts;
    public chartConstructor: ChartComponent.constructorType;
    public syncEvents: ChartComponent.syncEventsType[];
    public syncHandlers: Record<string, ChartComponent.syncHandlersType>;

    /**
     * Registry for the synchandlers used within the component
     */
    private registeredSyncHandlers: SyncHandler['id'][]

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
        this.registeredSyncHandlers = [];
        this.chartOptions = this.options.chartOptions || { chart: {} };

        if (this.store) {
            this.on('tableChanged', (): void => this.updateSeries());

            // reload the store when polling
            this.store.on('afterLoad', (e: DataStore.Event): void => {
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
        this.emit({ type: 'load' });
        super.load();
        this.parentElement.appendChild(this.element);
        this.contentElement.appendChild(this.chartContainer);
        this.hasLoaded = true;

        this.emit({ type: 'afterLoad' });

        return this;
    }

    public render(): this {
        this.emit({ type: 'beforeRender' });
        super.render();
        this.chart = this.initChart();
        this.updateSeries();
        this.setupSync();
        this.emit({ type: 'afterRender' });
        return this;
    }

    public redraw(): this {
        super.redraw();
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
                    false
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
        if (this.chart && this.store) {
            this.presentationTable = this.presentationModifier ?
                this.store.table.modified.clone() :
                this.store.table;

            const { id: storeTableID } = this.store.table;
            const { chart } = this;

            // Names/aliases that should be mapped to xAxis values
            const tableAxisMap = this.options.tableAxisMap || {};
            const xKeyMap: Record<string, string> = {};

            if (this.presentationModifier) {
                this.presentationTable = this.presentationModifier.modifyTable(this.presentationTable).modified;
            }

            const table = this.presentationTable;

            this.emit({ type: 'afterPresentationModifier', table: table });

            // Remove series names that match the xKeys
            const seriesNames = table.modified.getColumnNames()
                .filter((name): boolean => {
                    const isVisible = this.activeGroup ?
                        this.activeGroup.getSharedState().getColumnVisibility(name) !== false :
                        true;

                    if (!isVisible && !tableAxisMap[name]) {
                        return false;
                    }

                    if (tableAxisMap[name] === null) {
                        return false;
                    }

                    if (tableAxisMap[name] === 'x') {
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
                    const seriesFromStore = series.options.id === `${storeTableID}-series-${index}`;
                    const existingSeries = seriesNames.indexOf(series.name) !== -1;
                    i++;

                    if (
                        existingSeries &&
                        seriesFromStore
                    ) {
                        return series;
                    }

                    if (
                        !existingSeries &&
                        seriesFromStore
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
                const seriesTable = new DataTable(
                    table.modified.getColumns([xKey, series.name])
                );

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

    public registerSyncHandler(handler: SyncHandler): void {
        const { id } = handler;
        this.registeredSyncHandlers.push(id);
    }

    public isRegisteredHandler(handlerID: string): boolean {
        return this.registeredSyncHandlers.indexOf(handlerID) > -1;
    }

    private initChart(): Chart {
        if (this.chart) {
            if (this.chart.series.length) {
                return this.chart;
            }
            this.chart.destroy();
        }
        return this.constructChart();
    }

    private setupSync(): void {
        Object.keys(this.syncHandlers).forEach((id: string): void => {
            if (this.syncEvents.indexOf(id as ChartComponent.syncEventsType) > -1) {
                const { emitter, handler } = this.syncHandlers[id];
                if (handler instanceof SyncHandler) {
                    // Avoid registering the same handler multiple times
                    // i.e. panning and selection uses the same handler
                    if (!this.isRegisteredHandler(handler.id)) {
                        this.registerSyncHandler(handler);
                        handler.createHandler(this)();
                    }
                } else if (typeof handler === 'function') {
                    handler(this);
                }

                // Probably should register this also
                if (emitter instanceof SyncEmitter) {
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

        this.chart = this.charter.chart(this.chartContainer, this.chartOptions) as Chart;

        return this.chart;
    }

    /**
     * Registers events from the chart options to the callback register
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

        this.emit({ type: 'toJSON', json });
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
    export type syncHandlersType = { emitter: Function | SyncEmitter; handler: Function | SyncHandler };

    export type ChartComponentEvents =
        JSONEvent |
        Component.EventTypes;

    export type JSONEvent = Component.Event<'toJSON' | 'fromJSOM', {
        json: ChartComponent.ClassJSON;
    }>;

    export interface ComponentOptions extends Component.ComponentOptions, EditableOptions {
        Highcharts: typeof Highcharts;
        chartConstructor: ChartComponent.constructorType;
        syncEvents: syncEventsType[];
        syncHandlers: Record<syncEventsType, syncHandlersType>;
    }

    export interface EditableOptions extends Component.EditableOptions {
        chartOptions?: Options;
        chartClassName?: string;
        chartID?: string;
        tableAxisMap?: Record<string, string | null>;
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

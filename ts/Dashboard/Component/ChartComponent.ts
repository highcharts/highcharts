import Chart from '../../Core/Chart/Chart.js';
import Component from './Component.js';
import DataSeriesConverter from '../../Data/DataSeriesConverter.js';
import DataStore from '../../Data/Stores/DataStore.js';
import DataJSON from '../../Data/DataJSON.js';
import DataParser from '../../Data/Parsers/DataParser.js';

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
    uniqueKey,
    getStyle
} = U;

/* *
 *
 *  Class
 *
 * */
class ChartComponent extends Component<ChartComponent.Event> {

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
            ]
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
    public editableOptions: Array<keyof ChartComponent.EditableOptions>;

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
        this.editableOptions = this.options.editableOptions;

        this.chartContainer = createElement(
            'figure',
            void 0,
            void 0,
            this.element,
            true
        );
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
        // Extend via event.
        this.on('resize', (e: Component.ResizeEvent): void => {
            if (this.chart) {
                this.chart.setSize(
                    Number(getStyle(this.element, 'width')),
                    Number(getStyle(this.element, 'height'))
                );
            }
        });


        const table = this.store?.table;
        if (table) {
            this.on('tableChanged', (e: any): void => {
                if (e.detail?.sender !== this.id) {
                    this.updateSeries();
                }
            });
        }
    }

    /* *
     *
     *  Class methods
     *
     * */

    public load(): this {
        this.emit({ type: 'load' });
        super.load();
        this.initChart();
        this.parentElement.appendChild(this.element);
        this.element.appendChild(this.chartContainer);
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

    public update(options: Partial<ChartComponent.ComponentOptions>): this {
        super.update(options);
        if (this.chart) {
            this.chart.update(this.options?.chartOptions || {});
        }
        this.emit({ type: 'afterUpdate' });
        return this;
    }

    private updateSeries(): void {
        const series = new DataSeriesConverter(this.store?.table, {})
            .getAllSeriesData();

        if (this.chart) {
            this.chart.update({ series }, true);
        }
    }

    public registerSyncHandler(handler: ChartSyncHandler): void {
        const { id } = handler;
        this.syncHandlerRegistry[id] = handler;
    }

    public getSyncHandler(handlerID: string): ChartSyncHandler | undefined {
        return this.syncHandlerRegistry[handlerID];
    }

    private initChart(): void {
        // @todo: This should be replaced when series understand dataTable
        const seriesFromStore: any = [];
        if (this.store?.table) {
            const data = DataParser.getColumnsFromTable(this.store?.table, false).slice(1);
            const keys = this.store.table.getColumnNames();
            data.forEach((datum, i): void => {
                let id, name;
                if (keys && keys[i]) {
                    id = keys[i];
                    name = id;
                }
                seriesFromStore.push({ id, name, data: datum });
            });

        }

        if (
            !this.chartOptions.series ||
            this.chartOptions.series.length < seriesFromStore.length
        ) {
            this.chartOptions.series = [
                ...seriesFromStore,
                ...(this.options.chartOptions?.series || [])
            ];
        }

        this.chart = this.constructChart();

        const { width, height } = this.dimensions;
        this.chart.setSize(width, height);

        this.setupSync();
    }

    private setupSync(): void {
        if (this.store?.table.getPresentationState()) {
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

        this.charter.chart(this.chartContainer, this.chartOptions);

        return this.chart;
    }

    public toJSON(): ChartComponent.ClassJSON {
        const chartOptions = JSON.stringify(this.options.chartOptions),
            Highcharts = this.options.Highcharts,
            chartConstructor = this.options.chartConstructor;

        const base = super.toJSON();
        return {
            ...base,
            options: {
                ...base.options,
                chartOptions,
                Highcharts: Highcharts.product,
                chartConstructor,
                syncEvents: this.syncEvents
            }
        };
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

    export interface Event extends Component.Event {
    }
    export interface UpdateEvent extends Component.UpdateEvent {
        options?: ComponentOptions;
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

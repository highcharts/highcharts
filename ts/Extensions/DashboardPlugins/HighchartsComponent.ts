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
import type Series from '../../Core/Series/Series';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import type Options from '../../Core/Options';
import type Point from '../../Core/Series/Point';

import Component from '../../Dashboards/Component/Component.js';
import DataConverter from '../../Data/Converters/DataConverter.js';
import DataStore from '../../Data/Stores/DataStore.js';
import DataTable from '../../Data/DataTable.js';
import G from '../../Core/Globals.js';
import HighchartsSyncHandlers from './HighchartsSyncHandlers.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    createElement,
    merge,
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
 * Highcharts component for the Highcharts Dashboards.
 * @private
 * @class
 * @name Highcharts.DashboardComponent
 */
class HighchartsComponent extends Component<HighchartsComponent.ChartComponentEvents> {

    /* *
     *
     *  Static properties
     *
     * */

    public static charter?: typeof G;

    public static syncHandlers = HighchartsSyncHandlers;

    public static defaultOptions = merge(
        Component.defaultOptions,
        {
            /**
             * Whether to allow the component to edit the store to which it is
             * attached.
             * @default true
             */
            allowStoreUpdate: true,
            chartClassName: 'chart-container',
            chartID: 'chart-' + uniqueKey(),
            chartOptions: {
                series: []
            },
            chartConstructor: '',
            editableOptions:
                  Component.defaultOptions.editableOptions.concat(
                      [
                          'chartOptions',
                          'chartType'
                          // 'chartClassName',
                          // 'chartID'
                      ]
                  ),
            syncHandlers: HighchartsSyncHandlers,
            tableAxisMap: {}
        });

    public static fromJSON(
        json: HighchartsComponent.ClassJSON
    ): HighchartsComponent {
        const options = json.options;
        const chartOptions = JSON.parse(json.options.chartOptions || '');
        // const store = json.store ? DataJSON.fromJSON(json.store) : void 0;

        const component = new HighchartsComponent(
            merge(
                options,
                {
                    chartOptions,
                    // Highcharts, // TODO: Find a solution
                    // store: store instanceof DataStore ? store : void 0,

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

    public chartOptions: Partial<Options>;
    public chart: Chart | undefined;
    public chartContainer: HTMLElement;
    public options: HighchartsComponent.ComponentOptions;
    public chartConstructor: HighchartsComponent.ConstructorType;
    public sync: Component['sync'];
    /* *
     *
     *  Constructor
     *
     * */

    constructor(options: Partial<HighchartsComponent.ComponentOptions>) {
        options = merge(
            HighchartsComponent.defaultOptions,
            options
        );
        super(options);
        this.options = options as HighchartsComponent.ComponentOptions;

        this.chartConstructor = this.options.chartConstructor;
        this.type = 'Highcharts';

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

        this.syncHandlers = this.handleSyncOptions(HighchartsSyncHandlers);

        this.sync = new HighchartsComponent.Sync(
            this,
            this.syncHandlers
        );
        this.chartOptions = (
            this.options.chartOptions ||
            { chart: {} } as Partial<Options>
        );

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
        const hcComponent = this;

        hcComponent.emit({ type: 'beforeRender' });
        super.render();
        hcComponent.chart = hcComponent.initChart();
        hcComponent.updateSeries();
        hcComponent.sync.start();
        hcComponent.emit({ type: 'afterRender' });
        hcComponent.setupStoreUpdate();

        addEvent(hcComponent.chart, 'afterUpdate', function ():void {
            const options = this.options;

            hcComponent.updateComponentOptions({
                chartOptions: options
            }, false);
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

    private setupStoreUpdate(): void {
        const { store, chart } = this;

        if (store && chart && this.options.allowStoreUpdate) {
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
     * Update the store, when the point is being dragged.
     * @param  {Point} point Dragged point.
     * @param  {Component.StoreTypes} store Store to update.
     */
    private onChartUpdate(
        point: Point,
        store: Component.StoreTypes
    ): void {
        const table = store.table,
            columnName = point.series.name,
            rowNumber = point.x,
            converter = new DataConverter(),
            valueToSet = converter.asNumber(point.y);

        table.setCell(columnName, rowNumber, valueToSet);
    }
    /**
     * Handles updating via options
     * @param {Partial<Component.ComponentOptions>} options
     * The options to apply
     *
     * @param {boolean} redraw
     * The flag triggers the main redraw operation
     */
    private updateComponentOptions(
        options: Partial<HighchartsComponent.ComponentOptions>,
        redraw = true
    ): void {
        super.update(options, redraw);
    }

    public update(
        options: Partial<HighchartsComponent.ComponentOptions>
    ): this {
        this.updateComponentOptions(options);

        if (this.chart) {
            this.chart.update(this.options.chartOptions || {});
        }
        this.emit({ type: 'afterUpdate' });
        return this;
    }

    private updateSeries(): void {
        // Heuristically create series from the store dataTable
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
                    const existingSeries =
                        seriesNames.indexOf(series.name) !== -1;
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


    private initChart(): Chart {
        if (this.chart) {
            if (this.chart.series.length) {
                return this.chart;
            }
            this.chart.destroy();
        }
        return this.constructChart();
    }


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

    public toJSON(): HighchartsComponent.ClassJSON {
        const chartOptions = JSON.stringify(this.options.chartOptions),
            chartConstructor = this.options.chartConstructor;

        this.registerChartEvents();

        const base = super.toJSON();

        const json = {
            ...base,
            options: {
                ...base.options,
                chartOptions,
                chartConstructor,
                // TODO: may need to handle callback functions
                // Maybe have a sync.toJSON()
                sync: {}
            }
        };

        this.emit({ type: 'toJSON', json });
        return json;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace HighchartsComponent {

    export type ComponentType = HighchartsComponent;

    export type ConstructorType = (
        'chart' | 'stockChart' | 'mapChart' | 'ganttChart'
    );

    export type ChartComponentEvents =
        JSONEvent |
        Component.EventTypes;

    export type JSONEvent = Component.Event<'toJSON' | 'fromJSON', {
        json: ClassJSON;
    }>;

    export interface ComponentOptions extends Component.ComponentOptions, EditableOptions {
        allowStoreUpdate?: boolean,
        chartConstructor: ConstructorType;
    }

    export interface EditableOptions extends Component.EditableOptions {
        chartOptions?: Options;
        chartClassName?: string;
        chartID?: string;
        tableAxisMap?: Record<string, string | null>;
    }

    export interface ComponentJSONOptions extends Component.ComponentOptionsJSON {
        chartOptions?: string;
        chartClassName?: string;
        chartID?: string;
        chartConstructor: ConstructorType;
    }


    export interface ClassJSON extends Component.JSON {
        options: ComponentJSONOptions;
    }
}

/* *
 *
 *  Default export
 *
 * */
export default HighchartsComponent;

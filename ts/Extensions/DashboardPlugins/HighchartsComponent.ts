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
            allowConnectorUpdate: true,
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
                    'chartType',
                    'chartClassName',
                    'chartID'
                ]
            ),
            editableOptionsBindings: merge(
                Component.defaultOptions.editableOptionsBindings,
                {
                    skipRedraw: [
                        'chartOptions',
                        'chartType'
                    ],
                    keyMap: {
                        chartOptions: 'textarea',
                        chartType: 'select'
                    }
                }
            ),
            syncHandlers: HighchartsSyncHandlers,
            columnKeyMap: {}
        }
    );


    public static fromJSON(
        json: HighchartsComponent.ClassJSON
    ): HighchartsComponent {
        const options = json.options;
        const chartOptions = JSON.parse(json.options.chartOptions || '{}');
        // const store = json.store ? DataJSON.fromJSON(json.store) : void 0;

        const component = new HighchartsComponent(
            merge(
                options,
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

        this.setOptions();
        this.sync = new HighchartsComponent.Sync(
            this,
            this.syncHandlers
        );

        this.chartOptions = (
            this.options.chartOptions ||
            { chart: {} } as Partial<Options>
        );

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

        this.sync.start();
        hcComponent.emit({ type: 'afterRender' });
        hcComponent.setupConnectorUpdate();

        addEvent(hcComponent.chart, 'afterUpdate', function ():void {
            const options = this.options;

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
     * Internal method for handling option updates
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
        this.updateComponentOptions(options, false);
        this.setOptions();

        if (this.chart) {
            this.chart.update(this.options.chartOptions || {});
        }
        this.emit({ type: 'afterUpdate' });
        return this;
    }

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
        allowConnectorUpdate?: boolean,
        chartConstructor: ConstructorType;
    }

    export interface EditableOptions extends Component.EditableOptions {
        chartOptions?: Options;
        chartClassName?: string;
        chartID?: string;
        columnKeyMap?: Record<string, string | null>;
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

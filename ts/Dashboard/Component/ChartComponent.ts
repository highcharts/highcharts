import type CSSObject from '../../Core/Renderer/CSSObject';
import Chart from '../../Core/Chart/Chart.js';
import Component from './Component.js';
import DataSeriesConverter from '../../Data/DataSeriesConverter.js';
import DataStore from '../../Data/Stores/DataStore.js';
import DataJSON from '../../Data/DataJSON.js';
import DataParser from '../../Data/Parsers/DataParser.js';

import Highcharts from '../../masters/highcharts.src.js';

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
    public static defaultOptions = merge(
        Component.defaultOptions,
        {
            chartClassName: 'chart-container',
            chartID: 'chart-' + uniqueKey(),
            chartOptions: {
                series: []
            },
            Highcharts,
            chartConstructor: ''
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
                    store: store instanceof DataStore ? store : void 0
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
    public chart?: Chart;
    public chartContainer: HTMLElement;
    public options: ChartComponent.ComponentOptions;
    public charter: typeof Highcharts;
    public chartConstructor: ChartComponent.constructorType;

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
            this.element,
            true
        );
        if (this.options.chartClassName) {
            this.chartContainer.classList.add(this.options.chartClassName);
        }
        if (this.options.chartID) {
            this.chartContainer.id = this.options.chartID;
        }

        this.chartOptions = this.options.chartOptions || {};

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

    private initChart(): void {
        // @todo: This should be replaced when series understand dataTable
        const series: any = [];
        if (this.store?.table) {
            const data = DataParser.getColumnsFromTable(this.store?.table, false).slice(1);
            data.forEach((datum): void => {
                series.push({ data: datum });
            });
        }
        this.chartOptions.series = this.chartOptions.series ?
            [...series, ...this.chartOptions.series] :
            series;
        this.constructChart();

        if (this.chart) {
            const { width, height } = this.dimensions;
            this.chart.setSize(width, height);
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

        this.chart = this.charter.chart(this.chartContainer, this.chartOptions);
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
                chartConstructor
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
    export interface Event extends Component.Event {
    }
    export interface UpdateEvent extends Component.UpdateEvent {
        options?: ComponentOptions;
    }
    export interface ComponentOptions extends Component.ComponentOptions {
        chartOptions?: Highcharts.Options;
        chartClassName?: string;
        chartID?: string;
        style?: CSSObject;
        Highcharts: typeof Highcharts;
        chartConstructor: ChartComponent.constructorType;
    }


    export interface ComponentJSONOptions extends Component.ComponentJSONOptions {
        chartOptions?: string;
        chartClassName?: string;
        chartID?: string;
        style?: {};
        Highcharts: string; // reference?
        chartConstructor: ChartComponent.constructorType;
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

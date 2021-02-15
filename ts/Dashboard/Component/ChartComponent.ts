import type CSSObject from '../../Core/Renderer/CSSObject';
import type Chart from '../../Core/Chart/Chart';
import Component from './Component.js';
import DataSeriesConverter from '../../Data/DataSeriesConverter.js';

import H from '../../Core/Globals.js';
const Highcharts = H;
import U from '../../Core/Utilities.js';
const {
    createElement,
    merge,
    uniqueKey
} = U;

class ChartComponent extends Component<ChartComponent.Event> {

    public static defaultOptions = {
        ...Component.defaultOptions,
        chartClassName: 'chart-container',
        chartID: 'chart-' + uniqueKey(),
        chartOptions: {
            series: []
        },
        Highcharts,
        chartConstructor: 'chart'
    }

    public chartOptions: Highcharts.Options;
    public chart?: Chart;
    public chartContainer: HTMLElement;
    public options: ChartComponent.ComponentOptions;
    public charter: typeof H;
    public chartConstructor: ChartComponent.constructorType;

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

        this.chartContainer = createElement('figure');
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
                this.chart.setSize(e.width, e.height);
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
        const series = new DataSeriesConverter(this.store?.table, {});
        this.chartOptions.series = this.chartOptions.series ?
            [...series.getAllSeriesData(), ...this.chartOptions.series] :
            series.getAllSeriesData();
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
                this.chart = new (this.charter as any)[constructor](this.chartContainer, this.chartOptions) as Chart;
                return this.chart;
            }
        }

        if (typeof this.charter.chart !== 'function') {
            throw new Error('Chart constructor not found');
        }

        this.chart = this.charter.chart(this.chartContainer, this.chartOptions);
        return this.chart;
    }

}

export namespace ChartComponent {

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
        Highcharts: typeof H;
        chartConstructor: ChartComponent.constructorType;
    }
}

export default ChartComponent;

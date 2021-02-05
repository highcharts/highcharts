import type CSSObject from '../../Core/Renderer/CSSObject.js';
import Component from './Component.js';
import DataSeriesConverter from '../../Data/DataSeriesConverter.js';
// eslint-disable-next-line
// @ts-ignore
import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';
import 'https://code.highcharts.com/es-modules/Extensions/DraggablePoints.js';
import 'https://code.highcharts.com/es-modules/Extensions/Exporting.js';
import 'https://code.highcharts.com/es-modules/Extensions/ExportData.js';

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
        }
    }

    public chartOptions: Highcharts.Options;
    public chart: any;
    public chartContainer: HTMLElement;
    public options: ChartComponent.ComponentOptions;

    constructor(options: Partial<ChartComponent.ComponentOptions>) {
        options = merge(
            ChartComponent.defaultOptions,
            options
        );
        super(options);
        this.options = options as ChartComponent.ComponentOptions;

        this.type = 'chart';

        this.chartContainer = createElement('figure');
        if (this.options.chartClassName) {
            this.chartContainer.classList.add(this.options.chartClassName);
        }
        if (this.options.chartID) {
            this.chartContainer.id = this.options.chartID;
        }

        this.chartOptions = this.options.chartOptions;

        // Extend via event.
        this.on('resize', (e: Component.ResizeEvent): void => {
            this.chart.setSize(e.width, e.height);
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
        this.chart.update(this.options?.chartOptions || {});

        this.emit({ type: 'afterUpdate' });
        return this;
    }

    private updateSeries(): void {
        const series = new DataSeriesConverter(this.store?.table, {})
            .getAllSeriesData();

        this.chart.update({ series }, true);
    }

    private initChart(): void {
        // Handle series
        const series = new DataSeriesConverter(this.store?.table, {});
        this.chartOptions.series = [...series.getAllSeriesData(), ...this.chartOptions.series];
        this.chart = Highcharts.chart(this.chartContainer, this.chartOptions);
        const { width, height } = this.dimensions;
        this.chart.setSize(width, height);
    }

}

export namespace ChartComponent {

    export type ComponentType = ChartComponent;
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
    }
}

export default ChartComponent;

import type CSSObject from '../Core/Renderer/CSSObject.js';
import Component, { ComponentOptions } from './Component.js';
import DataSeriesConverter from '../Data/DataSeriesConverter.js';
// eslint-disable-next-line
// @ts-ignore
import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';
import 'https://code.highcharts.com/es-modules/Extensions/DraggablePoints.js';
import 'https://code.highcharts.com/es-modules/Extensions/Exporting.js';
import 'https://code.highcharts.com/es-modules/Extensions/ExportData.js';

import U from '../Core/Utilities.js';
const {
    createElement,
    merge,
    fireEvent,
    uniqueKey,
    addEvent
} = U;

export interface ChartComponentOptions extends ComponentOptions{
    chartOptions: Highcharts.Options;
    chartClassName: string;
    chartID: string;
    style: CSSObject;
}

export default class ChartComponent extends Component {

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
    private timeout?: number;

    constructor(options: ChartComponentOptions) {
        options = merge(
            ChartComponent.defaultOptions,
            options
        );
        super(options);
        this.type = 'chart';

        this.chartContainer = createElement('figure');
        this.chartContainer.classList.add(options.chartClassName);
        this.chartContainer.id = options.chartID;

        this.element.appendChild(this.chartContainer);
        this.chartOptions = options.chartOptions;
        this.initChart();

        // Extend via event.
        addEvent(this, 'resize', (e: any): void => {
            this.chart.setSize(e.width, e.height);
        });

        addEvent(this, 'update', (e: any): void => {
            this.chart.update(e?.options?.chartOptions || {});

            this.emit('afterRender');
        });

        const table = this.store?.table;
        if (table) {
            this.on('tableChanged', (e: any): void => {
                if (e.detail?.sender !== this.id) {
                    clearInterval(this.timeout);

                    this.timeout = setTimeout((): void => {
                        this.updateSeries();
                        this.timeout = void 0;
                    }, 10);
                }
            });
        }
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

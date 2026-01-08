/* *
 *
 *  Sparkline Cell Content class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { AnyRecord } from '../../../../Shared/Types';
import type SparklineRenderer from '../Renderers/SparklineRenderer';
import type TableCell from '../../../Core/Table/Body/TableCell';

import CellContentPro from '../CellContentPro.js';
import Globals from '../../../Core/Globals.js';
import U from '../../../../Core/Utilities.js';
const {
    defined,
    merge
} = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a sparkline type of cell content.
 */
class SparklineContent extends CellContentPro {

    /**
     * Highcharts namespace used by the Sparkline Renderer.
     * This is set to `undefined` by default, and should be set to the
     * Highcharts namespace before using the Sparkline Renderer.
     */
    public static H: undefined | AnyRecord;

    /**
     * The default chart options for the sparkline content.
     */
    public static defaultChartOptions: AnyRecord = {
        chart: {
            height: 40,
            margin: [5, 8, 5, 8],
            backgroundColor: 'transparent',
            skipClone: true
        },
        accessibility: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                marker: {
                    enabled: false
                },
                states: {
                    hover: {
                        enabled: false
                    },
                    inactive: {
                        enabled: false
                    }
                },
                animation: false,
                dataLabels: {
                    enabled: false
                }
            },
            pie: {
                slicedOffset: 0,
                borderRadius: 0
            }
        }
    };


    /**
     * The Highcharts chart instance.
     */
    public chart?: {
        update: (
            options: AnyRecord,
            force?: boolean,
            redraw?: boolean,
            animation?: boolean
        ) => void;
        destroy: () => void;
    };

    /**
     * The parent element for the sparkline content.
     */
    private parentElement: HTMLElement;

    /**
     * The HTML container element for the chart.
     */
    private chartContainer?: HTMLDivElement;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        cell: TableCell,
        renderer: SparklineRenderer,
        parentElement?: HTMLElement
    ) {
        super(cell, renderer);
        this.parentElement = parentElement ?? this.cell.htmlElement;
        this.add(this.parentElement);
    }


    /* *
     *
     *  Methods
     *
     * */

    protected override add(
        parentElement: HTMLElement = this.cell.htmlElement
    ): void {
        const H = SparklineContent.H;
        if (!H || !defined(this.cell.value)) {
            return;
        }

        this.parentElement = parentElement;

        this.chartContainer = document.createElement('div');
        this.parentElement.classList.add(Globals.getClassName('noPadding'));
        this.parentElement.appendChild(this.chartContainer);

        this.chart = H.Chart.chart(this.chartContainer, merge(
            SparklineContent.defaultChartOptions,
            this.getProcessedOptions()
        ));

        this.chartContainer.addEventListener('click', this.onKeyDown);
    }

    public override update(): void {
        if (this.chart) {
            const chartOptions = this.getProcessedOptions();
            this.chart.update(
                chartOptions,
                true,
                false,
                chartOptions.chart?.animation
            );
        } else {
            this.destroy();
            this.add(this.parentElement);
        }
    }

    public override destroy(): void {
        this.chartContainer?.removeEventListener('keydown', this.onKeyDown);

        this.chart?.destroy();
        this.chartContainer?.remove();

        delete this.chart;
        delete this.chartContainer;

        this.parentElement.classList.remove(
            Globals.getClassName('noPadding')
        );
    }

    private getProcessedOptions(): Partial<AnyRecord> {
        const renderer = this.renderer as SparklineRenderer;
        const { chartOptions } = renderer.options;

        let options: Partial<AnyRecord>;
        if (typeof chartOptions === 'function') {
            options = (chartOptions as Function).call(
                this.cell,
                this.cell.value
            );
        } else {
            options = merge(chartOptions) || {};
        }

        let trimmedValue = ('' + this.cell.value).trim();
        if (!trimmedValue.startsWith('[') && !trimmedValue.startsWith('{')) {
            trimmedValue = `[${trimmedValue}]`;
        }

        if (!options.series) {
            options.series = [{
                data: JSON.parse(trimmedValue)
            }];
        }

        return options;
    }

    private onKeyDown = (): void => {
        this.cell.htmlElement.focus();
    };
}


/* *
 *
 *  Default Export
 *
 * */

export default SparklineContent;

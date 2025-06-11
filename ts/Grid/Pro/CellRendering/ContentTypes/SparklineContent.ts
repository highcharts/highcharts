/* *
 *
 *  Sparkline Cell Content class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SparklineRenderer from '../Renderers/SparklineRenderer';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type * as HighchartsNamespace from '../../highcharts';

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


    public static defaultChartOptions: Globals.DeepPartial<
    HighchartsNamespace.Options
    > = {
            chart: {
                height: 40,
                animation: false,
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
                        }
                    },
                    animation: false
                }
            }
        };


    public chart?: HighchartsNamespace.Chart;
    private chartContainer?: HTMLDivElement;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(cell: TableCell, renderer: SparklineRenderer) {
        super(cell, renderer);
        this.add();
    }


    /* *
     *
     *  Methods
     *
     * */

    protected override add(): void {
        const renderer = this.renderer as SparklineRenderer;
        const { chartOptions } = renderer.options;
        const H = SparklineContent.H;
        if (!H || !defined(this.cell.value)) {
            return;
        }

        this.chartContainer = document.createElement('div');
        this.cell.htmlElement.appendChild(this.chartContainer);

        this.cell.htmlElement.classList.add(Globals.getClassName('noPadding'));

        let options: Partial<HighchartsNamespace.Options>;
        if (typeof chartOptions === 'function') {
            options = chartOptions.call(
                this.cell,
                this.cell.value
            );
        } else {
            options = merge(chartOptions) || {};
        }

        if (!options.series) {
            options.series = [{
                data: JSON.parse('' + this.cell.value)
            }];
        }

        this.chart = H.Chart.chart(this.chartContainer, merge(
            SparklineContent.defaultChartOptions,
            options
        ));

        this.chartContainer.addEventListener('click', this.onKeyDown);
    }

    public destroy(): void {
        this.chartContainer?.removeEventListener('keydown', this.onKeyDown);

        this.chart?.destroy();
        this.chartContainer?.remove();
        this.cell.htmlElement.classList.remove(
            Globals.getClassName('noPadding')
        );
    }

    private onKeyDown = (): void => {
        this.cell.htmlElement.focus();
    };
}


/* *
 *
 *  Namespace
 *
 * */

namespace SparklineContent {

    /**
     * Highcharts namespace used by the Sparkline Renderer.
     * This is set to `undefined` by default, and should be set to the
     * Highcharts namespace before using the Sparkline Renderer.
     */
    export let H: undefined | typeof HighchartsNamespace;

}


/* *
 *
 *  Default Export
 *
 * */

export default SparklineContent;

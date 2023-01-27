/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

import type CSSObject from '../../Core/Renderer/CSSObject';
import type Options from '../../Core/Options.js';
import type TextOptions from './TextOptions';
import AST from '../../Core/Renderer/HTML/AST.js';
import Chart from '../../Core/Chart/Chart.js';
import Component from './Component.js';
import F from '../../Core/FormatUtilities.js';
const {
    format
} = F;
import G from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const {
    createElement,
    css,
    defined,
    getStyle,
    isArray,
    isNumber,
    merge
} = U;

class KPIComponent extends Component {
    public static charter?: typeof G;

    public static defaultOptions = merge(
        Component.defaultOptions,
        {
            className: [
                Component.defaultOptions.className,
                `${Component.defaultOptions.className}-kpi`
            ].join(' '),
            style: {
                boxSizing: 'border-box',
                textAlign: 'center'
            },
            thresholdColors: ['#f45b5b', '#90ed7d']
        }
    );

    public static defaultChartOptions: DeepPartial<Options> = {
        chart: {
            type: 'spline',
            backgroundColor: 'transparent'
        },
        title: {
            text: void 0
        },
        xAxis: {
            visible: false
        } as DeepPartial<Options['xAxis']>,
        yAxis: {
            visible: false,
            title: {
                text: null
            }
        } as DeepPartial<Options['yAxis']>,
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        tooltip: {
            outside: true
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        }
    };

    public options: KPIComponent.ComponentOptions;

    public valueWrap: HTMLElement;
    public value: HTMLElement;
    public subtitle: HTMLElement;
    public chartContainer: HTMLElement;
    public chart?: Chart;
    public sync: Component['sync'];

    private prevValue?: number;
    private updatingSize?: boolean;

    constructor(options: Partial<KPIComponent.ComponentOptions>) {
        options = merge(
            KPIComponent.defaultOptions,
            options
        );
        super(options);

        this.options = options as KPIComponent.ComponentOptions;

        this.type = 'KPI';
        this.sync = new Component.Sync(
            this,
            this.syncHandlers
        );

        this.valueWrap = createElement('div', {
            className: `${Component.defaultOptions.className}-kpi-value-wrap`
        });
        this.value = createElement('div', {
            className: `${Component.defaultOptions.className}-kpi-value`
        });
        this.subtitle = createElement('div', {
            className: this.getSubtitleClassName()
        });
        this.chartContainer = createElement('figure', {
            className: `${Component.defaultOptions.className}-kpi-chart-container`
        });
    }

    public load(): this {
        super.load();

        this.contentElement.appendChild(this.valueWrap);
        this.valueWrap.appendChild(this.value);
        this.valueWrap.appendChild(this.subtitle);
        this.contentElement.appendChild(this.chartContainer);
        this.parentElement.appendChild(this.element);

        this.updateElements();

        return this;
    }

    public resize(
        width?: number | string | null,
        height?: number | string | null
    ): this {
        super.resize(width, height);
        if (
            !this.updatingSize &&
            this.dimensions.width &&
            this.dimensions.height
        ) {
            this.updateSize(this.dimensions.width, this.dimensions.height);
        }

        if (this.chart) {
            this.chart.reflow();
        }

        this.updatingSize = false;

        return this;
    }

    private updateTitleSize(width: number, height: number): void {
        if (this.titleElement) {
            this.titleElement.style.fontSize =
                0.1 * Math.min(width, height) + 'px';
        }
    }

    private updateSize(width: number, height: number): void {
        this.updateTitleSize(width, height);
        this.value.style.fontSize = 0.2 * Math.min(width, height) + 'px';
        this.subtitle.style.fontSize = 0.08 * Math.min(width, height) + 'px';

        this.updatingSize = true;
        super.resize(
            Number(getStyle(this.parentElement, 'width')),
            Number(getStyle(this.parentElement, 'height'))
        );
    }

    public render(): this {
        super.render();
        const charter = (KPIComponent.charter || G);

        if (this.options.chartOptions && !this.chart) {
            this.chart = charter.chart(this.chartContainer, merge(
                KPIComponent.defaultChartOptions,
                this.options.chartOptions
            ));
        } else if (
            this.chart &&
            !this.options.chartOptions &&
            'chartOptions' in this.options
        ) {
            this.chart.destroy();
            this.chart = void 0;
        }

        return this;
    }

    public redraw(): this {
        super.redraw();
        this.updateElements();
        return this;
    }

    public update(options: Partial<KPIComponent.ComponentOptions>): this {
        super.update(options);
        if (options.chartOptions && this.chart) {
            this.chart.update(options.chartOptions);
        }

        return this.redraw();
    }

    private updateElements(): void {
        const {
            style,
            subtitle,
            valueFormat,
            valueFormatter
        } = this.options;

        if (this.options.title) {
            this.setTitle(this.options.title);
            if (this.dimensions.width && this.dimensions.height) {
                this.updateTitleSize(
                    this.dimensions.width,
                    this.dimensions.height
                );
            }
        }

        let value = this.options.value;

        if (defined(value)) {
            let prevValue;
            if (isNumber(value)) {
                prevValue = value;
            }

            if (valueFormatter) {
                value = valueFormatter.call(this, value);
            } else if (valueFormat) {
                value = format(valueFormat, { value });
            } else if (isNumber(value)) {
                value = value.toLocaleString();
            }

            AST.setElementHTML(this.value, value);
            AST.setElementHTML(this.subtitle, this.getSubtitle());

            this.prevValue = prevValue;
            this.valueWrap.style.flex = '1';
        } else {
            this.valueWrap.style.flex = '0';
        }

        if (style) {
            css(this.element, style);
        }
        if (typeof subtitle === 'object') {
            if (subtitle.style) {
                css(this.subtitle, subtitle.style);
            }
            this.subtitle.className = this.getSubtitleClassName();
        }

        this.chartContainer.style.flex = this.options.chartOptions ? '1' : '0';

        if (this.chart) {
            this.chart.reflow();
        }

        this.value.style.color = this.getValueColor();
    }

    private getSubtitle(): string {
        const {
            subtitle,
            value
        } = this.options;

        if (typeof subtitle === 'string') {
            return subtitle;
        }

        if (subtitle) {
            if (isNumber(this.prevValue) && isNumber(value)) {
                const diff = value - this.prevValue;
                let prefix = '';

                if (diff > 0) {
                    prefix = '<span style="color:green">&#9650;</span> +';
                } else if (diff < 0) {
                    prefix = '<span style="color:red">&#9660;</span> ';
                } else {
                    return this.subtitle.innerHTML;
                }

                if (subtitle.type === 'diff') {
                    return prefix + diff.toLocaleString();
                }
                if (subtitle.type === 'diffpercent') {
                    return prefix + format('{v:,.2f}%', {
                        v: diff / this.prevValue * 100
                    });
                }
            }
            return subtitle.text || '';
        }
        return '';
    }

    private getSubtitleClassName(): string {
        const { subtitle } = this.options;
        return `${Component.defaultOptions.className}-kpi-subtitle` +
            ((typeof subtitle === 'object' && subtitle.className) || '');
    }

    private getValueColor(): string {
        const {
            threshold,
            thresholdColors,
            value
        } = this.options;

        if (thresholdColors && threshold && isNumber(value)) {
            if (isArray(threshold)) {
                for (let i = threshold.length - 1; i >= 0; i--) {
                    if (value >= threshold[i]) {
                        if (i + 1 < thresholdColors.length) {
                            return thresholdColors[i + 1];
                        }
                        return thresholdColors[thresholdColors.length - 1];
                    }
                }
            } else if (value >= threshold) {
                return thresholdColors[1];
            }
            return thresholdColors[0];
        }
        return '';
    }
}

namespace KPIComponent {
    export type ComponentType = KPIComponent;

    export interface ComponentOptions extends Component.ComponentOptions {
        chartOptions?: Options;
        style?: CSSObject;
        threshold?: number|Array<number>;
        thresholdColors?: Array<string>;
        value?: number|string;
        subtitle?: string|SubtitleOptions;
        valueFormat?: string;
        valueFormatter?: ValueFormatterCallbackFunction;
    }

    export interface SubtitleOptions extends TextOptions {
        type?: SubtitleType;
    }

    export type SubtitleType = 'text' | 'diff' | 'diffpercent';

    export interface ValueFormatterCallbackFunction {
        (
            this: KPIComponent,
            value: (number|string)
        ): string;
    }
}

export default KPIComponent;

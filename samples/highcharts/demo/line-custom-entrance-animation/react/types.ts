import type Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import type { YAxis } from '@highcharts/react';

export type AnimatedPlotLineOptions = NonNullable<
    Parameters<typeof YAxis>[0]['plotLines']
>[number] & {
    animation?: Partial<Highcharts.AnimationOptionsObject>;
};

export type LineSeriesInstance = Omit<Highcharts.Series, 'options'> & {
    options: Highcharts.SeriesLineOptions;
    graph: Highcharts.SVGElement;
};

export type AxisInstance = Highcharts.Axis & {
    chart: Highcharts.Chart & {
        renderer: Highcharts.SVGRenderer & {
            globalAnimation: Partial<Highcharts.AnimationOptionsObject>;
        };
    };
    axisGroup: Highcharts.SVGElement;
    labelGroup: Highcharts.SVGElement;
    horiz: boolean;
    plotLines: Array<
        Highcharts.PlotLineOrBand & {
            options: AnimatedPlotLineOptions;
            svgElem: Highcharts.SVGElement;
            label: Highcharts.SVGElement;
        }
    >;
};

export type HighchartsWithLineSeries = typeof Highcharts & {
    seriesTypes: {
        line: {
            prototype: {
                animate: (this: LineSeriesInstance, init?: boolean) => void;
            };
        };
    };
};

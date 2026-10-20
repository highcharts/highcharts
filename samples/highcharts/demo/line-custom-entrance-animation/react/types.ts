import type Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';

export type AnimatedPlotLineOptions = Highcharts.AxisPlotLinesOptions & {
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

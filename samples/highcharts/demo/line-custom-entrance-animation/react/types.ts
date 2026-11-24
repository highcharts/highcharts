import type {
    AnimationOptionsObject,
    Axis,
    PlotLineOrBand,
    Series,
    SVGElement,
    SVGRenderer,
    YAxisPlotLinesOptions
} from 'highcharts';

// Plot line options extended with the custom animation option
export type AnimatedPlotLineOptions = YAxisPlotLinesOptions & {
    animation?: AnimationOptionsObject;
};

// Internal members the entrance animations read, missing from the
// declarations
export type AxisWithGroups = Axis & {
    axisGroup: SVGElement;
    labelGroup: SVGElement;
    plotLines: Array<PlotLineOrBand>;
};

export type SeriesWithGraph = Series & {
    graph: SVGElement;
};

export type RendererWithGlobalAnimation = SVGRenderer & {
    globalAnimation?: boolean | AnimationOptionsObject;
};

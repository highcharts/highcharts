import type Chart from '../../Core/Chart/Chart.js';
import type { NavigatorOptions } from './NavigatorOptions';
import type ScrollbarOptions from '../Scrollbar/ScrollbarOptions';
import type PointerEvent from '../../Core/PointerEvent';
import type AxisOptions from '../../Core/Axis/AxisOptions';
import type { NavigatorAxisComposition } from '../../Core/Axis/NavigatorAxisComposition';
import Axis from '../../Core/Axis/Axis.js';
import Navigator from './Navigator.js';
import NavigatorComposition from './NavigatorComposition.js';
import NavigatorAxisAdditions from '../../Core/Axis/NavigatorAxisComposition.js';
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
import Scrollbar from '../Scrollbar/Scrollbar.js';
import G from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    isNumber,
    merge,
    isString,
    pick,
} = U;

type ChartMock = Partial<Chart> & {
    navigator: StandaloneNavigator,
    renderTo: HTMLElement,
    isMock: true
}

class StandaloneNavigator extends Navigator {
    public static navigator(
        renderTo: (string|globalThis.HTMLElement),
        options: DeepPartial<NavigatorOptions>
    ): StandaloneNavigator {
        // TODO: should be default options
        options = merge({}, options);

        // get container element by id
        const element = isString(renderTo) ? document.getElementById(renderTo) : renderTo;

        if (!element) {
            throw new Error('wrong renderTo argument');
        }

        const WIDTH = 400;
        const renderer = new SVGRenderer(
            element,
            WIDTH,
            300
        ) as Chart.Renderer;

        // TODO: Figure out how to use the renderer below
        // const Renderer = options.renderer || !svg ?
        //     RendererRegistry.getRendererType(optionsChart.renderer) :
        //     SVGRenderer;

        const chartMock = {
            isMock: true,
            time: G.time,
            userOptions: {

            },
            options: (G as any).merge(
                (G as any).getOptions(), {
                colors: ['red', 'green'],
                navigator: {
                    series: {
                        data: [1, 2, 3, 12, 1, 2, 1, 2, 3, 1],
                        type: 'line'
                    },
                    xAxis: {
                        crosshair: false,
                        width: WIDTH - 20
                    },
                    enabled: true
                },
                scrollbar: {
                    enabled: true
                }
            }
            ),
            renderer: renderer,
            xAxis: [{
                len: WIDTH - 20,
                options: {
                    // maxRange: 10000,
                    width: WIDTH - 20
                },
                // minRange: 0.1,
                setExtremes: function (min: number, max: number) {
                    console.log(min, max)
                }
            }],
            yAxis: [{
                options: {

                }
            }],
            series: [],
            axes: [],
            orderItems: function () { },
            initSeries: (G as any).Chart.prototype.initSeries,
            renderTo: renderer.box,
            container: renderer.box,
            pointer: {
                normalize: (e: any) => {
                    e.chartX = e.pageX;
                    e.chartY = e.pageY;
                    return e;
                }
            },
            plotLeft: 10,
            plotTop: 0,
            plotWidth: WIDTH - 20,
            plotHeight: renderer.height,
            sharedClips: [],
            spacing: [0, 0, 0, 0],
            margin: [0, 0, 0, 0],
            numberFormatter: (G as any).numberFormat

        } as unknown as ChartMock;


        return new StandaloneNavigator(chartMock);
    }

    constructor(chart: ChartMock) {
        super(chart as Chart)
    }

    public init(chartMock: ChartMock|Chart) {
        const chart = chartMock;
        const chartOptions = chart.options,
            navigatorOptions = chartOptions?.navigator || {},
            navigatorEnabled = navigatorOptions.enabled,
            scrollbarOptions = chartOptions?.scrollbar || {},
            scrollbarEnabled = scrollbarOptions.enabled,
            height = navigatorEnabled && navigatorOptions.height || 0,
            scrollbarHeight = scrollbarEnabled && scrollbarOptions.height || 0,
            scrollButtonSize =
                scrollbarOptions.buttonsEnabled && scrollbarHeight || 0;

        this.handles = [];
        this.shades = [];

        this.chart = chart as Chart;
        this.setBaseSeries();

        this.height = height;
        this.scrollbarHeight = scrollbarHeight;
        this.scrollButtonSize = scrollButtonSize;
        this.scrollbarEnabled = scrollbarEnabled;
        this.navigatorEnabled = navigatorEnabled as any;
        this.navigatorOptions = navigatorOptions;
        this.scrollbarOptions = scrollbarOptions;

        this.opposite = pick(
            navigatorOptions.opposite,
            Boolean(!navigatorEnabled && chart.inverted)
        ); // #6262

        const navigator = this,
            baseSeries = navigator.baseSeries;

        chart.isDirtyBox = true;

        // an x axis is required for scrollbar also
        navigator.xAxis = new Axis(chart as Chart, merge<DeepPartial<AxisOptions>>({
            // inherit base xAxis' break and ordinal options
            // breaks: baseXaxis.options.breaks,
            // ordinal: baseXaxis.options.ordinal
        }, navigatorOptions.xAxis, {
            id: 'navigator-x-axis',
            yAxis: 'navigator-y-axis',
            type: 'datetime',
            index: 0,
            isInternal: true,
            offset: 0,
            keepOrdinalPadding: true, // #2436
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
            zoomEnabled: false
        }, chart.inverted ? {
            offsets: [scrollButtonSize, 0, -scrollButtonSize, 0],
            width: height
        } : {
            offsets: [0, -scrollButtonSize, 0, scrollButtonSize],
            height: height
        }), 'xAxis') as NavigatorAxisComposition;

        navigator.yAxis = new Axis(chart as Chart, merge(
            navigatorOptions.yAxis,
            {
                id: 'navigator-y-axis',
                alignTicks: false,
                offset: 0,
                index: 0,
                isInternal: true,
                reversed: pick(
                    (
                        navigatorOptions.yAxis &&
                        navigatorOptions.yAxis.reversed
                    ),
                    false
                ), // #14060
                zoomEnabled: false
            }, chart.inverted ? {
                width: height
            } : {
                height: height
            }
        ), 'yAxis') as NavigatorAxisComposition;

        // If we have a base series, initialize the navigator series
        if (baseSeries || (navigatorOptions.series as any).data) {
            navigator.updateNavigatorSeries(false);

        // If not, set up an event to listen for added series
        }

        navigator.reversedExtremes = (
            chart.inverted && !navigator.xAxis.reversed
        ) || (
            !chart.inverted && navigator.xAxis.reversed
        );

        // Render items, so we can bind events to them:
        navigator.renderElements();
        // Add mouse events
        navigator.addMouseEvents();

    // in case of scrollbar only, fake an x axis to get translation
    //  else {
            // navigator.xAxis = {
            //     chart,
            //     navigatorAxis: {
            //         fake: true
            //     },
            //     translate: function (value: number, reverse?: boolean): void {
            //         const axis = chart.xAxis[0],
            //             ext = axis.getExtremes(),
            //             scrollTrackWidth = axis.len - 2 * scrollButtonSize,
            //             min = numExt(
            //                 'min',
            //                 axis.options.min as any,
            //                 ext.dataMin
            //             ),
            //             valueRange = (numExt(
            //                 'max',
            //                 axis.options.max as any,
            //                 ext.dataMax
            //             ) as any) - (min as any);

            //         return reverse ?
            //             // from pixel to value
            //             (value * valueRange / scrollTrackWidth) + (min as any) :
            //             // from value to pixel
            //             scrollTrackWidth * (value - (min as any)) / valueRange;
            //     },
            //     toPixels: function (
            //         this: NavigatorAxisComposition,
            //         value: number
            //     ): number {
            //         return this.translate(value);
            //     },
            //     toValue: function (
            //         this: NavigatorAxisComposition,
            //         value: number
            //     ): number {
            //         return this.translate(value, true);
            //     }
            // } as NavigatorAxisComposition;

            // navigator.xAxis.navigatorAxis.axis = navigator.xAxis;
            // navigator.xAxis.navigatorAxis.toFixedRange = (
            //     NavigatorAxisAdditions.prototype.toFixedRange.bind(
            //         navigator.xAxis.navigatorAxis
            //     )
            // );
        // }


        // Initialize the scrollbar
        //if ((chart.options.scrollbar as any).enabled) {}
        //TODO: Figure out options of scrollbar
        if (true) {

            const options = merge<DeepPartial<ScrollbarOptions>>(
                chart.options?.scrollbar,
                { vertical: chart.inverted }
            );
            if (!isNumber(options.margin) && navigator.navigatorEnabled) {
                options.margin = chart.inverted ? -3 : 3;
            }
            chart.scrollbar = navigator.scrollbar = new Scrollbar(
                chart.renderer!,
                options,
                chart as Chart
            );
            addEvent(navigator.scrollbar, 'changed', function (
                e: PointerEvent
            ): void {
                const range = navigator.size,
                    to = range * (this.to as any),
                    from = range * (this.from as any);

                navigator.hasDragged = (navigator.scrollbar as any).hasDragged;
                navigator.render(0, 0, from, to);

                if (this.shouldUpdateExtremes((e as any).DOMType)) {
                    setTimeout(function (): void {
                        navigator.onMouseUp(e);
                    });
                }
            });
        }

        // // Add data events
        // navigator.addBaseSeriesEvents();
        // // Add redraw events
        // navigator.addChartEvents();

        /* standalone code  */
        let nav = this as Navigator & StandaloneNavigator;
        chartMock.navigator = nav;
        nav.top = 0;
        nav.xAxis.setScale();
        nav.yAxis.setScale();
        nav.xAxis.render();
        nav.yAxis.render();
        nav.series?.forEach(s => {
            s.translate();
            s.render();
            s.redraw();
        });

        // TODO: Init some extremes, API method?
        nav.render(2, 8);
    }
}
// function compose(navigatorClass: typeof Navigator) {
//     wrap(navigatorClass, 'init', () => {
//         // the same as above
//     })

// }

export default StandaloneNavigator;

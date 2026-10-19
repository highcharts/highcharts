/**
 * Global test typings. Side-effect imports ensure the declaration files are
 * included by the compiler.
 */
/* eslint-disable node/no-unpublished-import */
import '../code/highcharts';
import 'jquery';
import 'qunit';
import '../test/controls';
import '../test/test-controller.d';
import '../test/test-template.d';
import '../test/test-utilities.d';

declare module '../code/highcharts' {
    // @todo: Add proper typing for `Highcharts.patterns`
    export const patterns: Array<PatternOptionsObject>;

    export const sonification: Sonification;
}

/**
 * Global test typings for use in samples.
 */
declare global {
    namespace Highcharts {

        type AnnotationLabelType = {
            graphic: Highcharts.SVGElement;
            options: {
                id?: string;
                point: {
                    x: number;
                    y: number;
                };
            };
        }

        interface Axis {
            axisGroup: Highcharts.SVGElement;
            gridGroup: Highcharts.SVGElement;
            plotLines: Array<Highcharts.PlotLineOrBand>;
            labelGroup: Highcharts.SVGElement;
        }
        interface Pane {
            update(options: Highcharts.PaneOptions): void;
        }
        interface Sonification {
            InstrumentPresets: string[];
            speak(
                text: string,
                options?: any,
                delay?: number
            ): void;
        }
        interface Chart {
            annotations: Array<{
                labels: Array<AnnotationLabelType>;
            }>;
            pane: Array<Pane>;
            sonification: Sonification;
            toggleSonify(): void;
        }
        interface Point {
            dataLabels: Array<Highcharts.SVGElement>;
            opacity: number;
            sonify(): void;
        }
        interface Series {
            // @todo: Add proper support. Used in black-and-white demo.
            currentDataGrouping: TimeTicksInfoObject;
            dataLabelsGroup: Highcharts.SVGElement;
            graph?: Highcharts.SVGElement;
        }
        interface SVGElement {
            text?: SVGElement;
        }

        interface SVGRenderer {
            chartIndex?: number;
            globalAnimation?: boolean|Highcharts.AnimationOptionsObject;
        }
    }
    namespace HighchartsConnectors {
        namespace Morningstar {
            class TimeSeriesConnector {
                constructor(options: any);
                load(): Promise<void>;
                getTable(): Highcharts.DataTable;
            }
        }
    }

    interface Math {
       easeOutBounce(pos: number): number;
    }
}

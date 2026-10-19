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
            sonification: Sonification;
            toggleSonify(): void;
        }

        interface Point {
            dataLabels: Array<Highcharts.SVGElement>;
            sonify(): void;
        }
        interface Series {
            // @todo: Add proper support. Used in black-and-white demo.
            currentDataGrouping: TimeTicksInfoObject;
        }
        interface SVGElement {
            text?: SVGElement;
        }

        interface SVGRenderer {
            chartIndex?: number;
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

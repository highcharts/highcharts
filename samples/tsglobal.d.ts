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

    export const sonification: SonificationGlobalObject;
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
            center: Array<number>;
            update(options: Highcharts.PaneOptions): void;
        }
        interface SonificationGlobalObject {
            InstrumentPresets: Record<string, any>;
            SonificationSpeaker: new (options?: any) => {
                cancel(): void;
                sayAtTime(time: number, message: string): void;
            };
        }

        interface Sonification {
            InstrumentPresets: Record<string, any>;
            cancel(): void;
            speak(
                text: string,
                options?: any,
                delay?: number
            ): void;
            playAdjacent(
                next: boolean,
                onEnd?: any,
                eventFilter?: any
            ): void;
            playAdjacentSeries(
                next?: boolean,
                prop?: keyof Highcharts.Point,
                onEnd?: any
            ): Highcharts.Series | null;
            getLastPlayedPoint(): Highcharts.Point | null;
            playNote(
                instrument: string | any,
                options: any,
                delayMs?: number
            ): void;
            timeline: {
                channels: Array<{
                    events: Array<{ relatedPoint: Highcharts.Point }>;
                    engine: { setMasterVolume: (volume: number) => void };
                }>;
            }
        }
        interface Chart {
            annotations: Array<{
                labels: Array<AnnotationLabelType>;
            }>;
            pane: Array<Pane>;
            sonification: Sonification;
            toggleSonify(
                reset?: boolean,
                callback?: Function
            ): void;
        }
        interface Point {
            dataLabels: Array<Highcharts.SVGElement>;
            opacity: number;
            sonify(onEnd?: Function): void;
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

import type { Options } from '../../code/highcharts.d.ts';

export interface ControlOptions {
    /** The maximum value for number controls */
    max?: number;
    /** The minimum value for number controls */
    min?: number;
    /** The option valid values for select controls */
    options?: Array<string>;
    path: string;
    step?: number;
    type?: 'number' | 'text' | 'boolean' | 'select' | 'color';
    value?: number | string | boolean;
}
export interface SampleGeneratorConfig {
    chartOptionsExtra?: Options;
    controls?: ControlOptions[];
    /**
     * The data file to use, located in samples/data
     *
     * @example 'usdeur.json'
     */
    dataFile?: string;
    /**
     * The chart factory function to use, for example `chart` in
     * `Highcharts.chart()`
     */
    factory?: 'chart' | 'stockChart' | 'mapChart' | 'ganttChart';
    /** Additional Highcharts module files */
    modules?: string[];
    /** The output directory for the generated samples */
    output?: string;
    paths?: string[];
    /**
     * Templates for chart options, merged in the given order. Defined in
     * tools/sample-generator/tpl/chart-options
     */
    templates?: (
        'categories-4' |
        'categories-12' |
        'column' |
        'datetime' |
        'linear-12'
    )[];
}

export default {
    paths: [
        'legend.enabled=true',
        'legend.align=center',
        'legend.x',
        'legend.backgroundColor=#efefef'
    ],
    output: 'highcharts/studies/sample-gen'
};

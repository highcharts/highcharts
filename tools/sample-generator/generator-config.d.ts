/* eslint-disable-next-line node/no-unpublished-import */
import type { Options } from '../../code/highcharts.d.ts';

export interface ControlOptions {
    /**
     * Whether this control's path is considered when creating an automated
     * chart title and sample name
     */
    inTitle?: boolean;
    /** The maximum value for number controls */
    max?: number;
    /** The minimum value for number controls */
    min?: number;
    /** The option valid values for select controls */
    options?: Array<string>;
    /**
     * The Highcharts option path, using dot notation
     */
    path: string;
    /** The step value for number controls */
    step?: number;
    /**
     * The control type. If not specified, the generator will try to infer it
     * from the provided value or actual value in the chart or grid.
     */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'color';
    /**
     * The value for this control. If not specified, the generator will use
     * the actual value in the chart or grid.
     */
    value?: number | string | boolean;
}
export interface SampleGeneratorConfig {
    /**
     * Additional chart options to merge in, extending the options from
     * templates
     */
    chartOptionsExtra?: Options;
    /**
     * Controls to generate for this sample
     */
    controls?: ControlOptions[];
    /**
     * A descriptive text for the controls
     */
    controlsDescription?: string;
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
    /**
     * Additional Highcharts module files
     *
     * @example ['highcharts-more', 'modules/exporting']
     */
    modules?: string[];
    /** The output directory for the generated samples */
    output?: string;
    /**
     * Shorthand paths for controls, using `path=value` notation
     */
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

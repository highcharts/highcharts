import type { Options } from '../../code/highcharts.d.ts';

export interface ControlOptions {
    /** The maximum value for number controls */
    max?: number;
    /** The minimum value for number controls */
    min?: number;
    path: string;
    type?: 'number' | 'text' | 'boolean' | 'select' | 'color';
    value?: number | string | boolean;
}
export interface SampleGeneratorConfig {
    chartOptionsExtra?: Options;
    controls?: ControlOptions[];
    /** Additional Highcharts module files */
    modules?: string[];
    /** The output directory for the generated samples */
    output?: string;
    paths?: string[];
    /** Templates for chart options, merged in the given order */
    templates?: string[];
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

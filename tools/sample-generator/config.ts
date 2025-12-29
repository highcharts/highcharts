import type { Options } from '../../ts/Core/Options.d.ts';
export interface SampleGeneratorConfig {
    chartOptionsExtra?: Options;
    paths: string[];
    /** The output directory for the generated samples */
    output?: string;
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

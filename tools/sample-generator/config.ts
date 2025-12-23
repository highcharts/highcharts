import type { Options } from '../../ts/Core/Options.d.ts';
export interface SampleGeneratorConfig {
    chartOptionsExtra: Options;
    paths: string[];
    output: string;
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

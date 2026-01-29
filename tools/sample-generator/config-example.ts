import type {
    SampleGeneratorConfig
} from './generator-config.d.ts';

export default {
    paths: [
        'legend.enabled=true',
        'legend.align=center',
        'legend.x',
        'legend.backgroundColor=#efefef'
    ],
    output: 'highcharts/studies/sample-gen'
} satisfies SampleGeneratorConfig;

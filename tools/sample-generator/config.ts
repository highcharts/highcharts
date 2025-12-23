export interface SampleGeneratorConfig {
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

import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.minColor',
        value: '#ffffff'
    }, {
        path: 'yAxis.maxColor',
        value: '#000000'
    }, {
        path: 'series[0].data[0]',
        value: 30,
        inTitle: false
    }],
    modules: ['highcharts-more', 'modules/solid-gauge'],
    templates: [],
    chartOptionsExtra: {
        chart: {
            type: 'solidgauge'
        },
        yAxis: {
            min: 0,
            max: 100
        }
    }
} satisfies SampleGeneratorConfig;
import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.plotBands[0].from',
        value: 4.5,
        min: -1,
        max: 12,
        step: 0.1
    }, {
        path: 'xAxis.plotBands[0].to',
        value: 7.5,
        min: -1,
        max: 12,
        step: 0.1
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        xAxis: {
            plotBands: [{
                color: '#00c00040'
            }]
        }
    }
} satisfies SampleGeneratorConfig;
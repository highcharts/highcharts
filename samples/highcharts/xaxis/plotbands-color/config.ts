import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.plotBands[0].color',
        value: '#00c00040'
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        xAxis: {
            plotBands: [{
                from: 2.5,
                to: 4.5
            }]
        }
    }
} satisfies SampleGeneratorConfig;
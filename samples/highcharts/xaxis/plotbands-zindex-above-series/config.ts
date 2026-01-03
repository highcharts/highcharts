import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.plotBands[0].zIndex',
        value: 5,
        min: 0,
        max: 10
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        xAxis: {
            plotBands: [{
                color: '#8888ff',
                from: 2.5,
                to: 4.5
            }]
        },
        yAxis: {
            gridLineWidth: 2
        }
    }
} satisfies SampleGeneratorConfig;
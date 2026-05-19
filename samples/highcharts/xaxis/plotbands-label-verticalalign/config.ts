import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.plotBands[0].label.verticalAlign',
        value: 'middle',
        options: ['top', 'middle', 'bottom']
    }, {
        path: 'xAxis.plotBands[0].label.y',
        value: 16,
        min: -100,
        max: 100,
        step: 1,
        inTitle: false
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        xAxis: {
            plotBands: [{
                color: '#00c00040',
                from: 2.5,
                to: 4.5,
                label: {
                    text: 'Plot band'
                }
            }]
        }
    }
} satisfies SampleGeneratorConfig;
import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

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
        step: 1
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        title: {
            text: 'X-axis plot band label vertical alignment'
        },
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
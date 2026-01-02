import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.plotBands[0].label.style.color',
        value: '#888'
    }, {
        path: 'xAxis.plotBands[0].label.style.fontSize',
        value: '0.8em',
        min: 0.5,
        max: 2,
        step: 0.1
    }, {
        path: 'xAxis.plotBands[0].label.style.fontWeight',
        value: 'bold',
        options: ['normal', 'bold', 'bolder', 'lighter']
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
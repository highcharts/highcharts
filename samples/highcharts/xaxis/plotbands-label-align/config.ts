import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.plotBands[0].label.align',
        value: 'right',
        options: ['left', 'center', 'right']
    }, {
        path: 'xAxis.plotBands[0].label.x',
        value: 0,
        min: -10,
        max: 10
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        title: {
            text: 'Demo of plot band label alignment'
        },
        xAxis: {
            plotBands: [{ // mark the weekend
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
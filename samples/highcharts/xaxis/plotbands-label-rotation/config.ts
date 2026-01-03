import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.plotBands[0].label.rotation',
        value: 90,
        min: -90,
        max: 90
    }, {
        path: 'xAxis.plotBands[0].label.textAlign',
        value: 'left',
        options: ['left', 'center', 'right']
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        title: {
            text: 'Demo of plot band label rotation'
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
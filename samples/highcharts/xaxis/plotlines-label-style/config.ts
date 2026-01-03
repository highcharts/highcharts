import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.plotLines[0].label.style.color',
        value: '#888'
    }, {
        path: 'yAxis.plotLines[0].label.style.fontSize',
        value: '0.8em',
        min: 0.5,
        max: 2,
        step: 0.1
    }, {
        path: 'yAxis.plotLines[0].label.style.fontWeight',
        value: 'bold',
        options: ['normal', 'bold', 'bolder', 'lighter']
    }],
    templates: ['linear-12', 'datetime'],
    chartOptionsExtra: {
        yAxis: {
            plotLines: [{
                value: 100,
                width: 2,
                label: {
                    text: 'Plot line label'
                }
            }]
        }
    }
} satisfies SampleGeneratorConfig;
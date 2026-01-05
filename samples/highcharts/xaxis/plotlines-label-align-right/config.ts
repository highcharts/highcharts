import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.plotLines[0].label.align',
        value: 'right'
    }, {
        path: 'yAxis.plotLines[0].label.x',
        value: -10,
        min: -10,
        max: 10,
        inTitle: false
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
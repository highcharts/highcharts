import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.plotLines[0].label.y',
        value: 16,
        min: -10,
        max: 20
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
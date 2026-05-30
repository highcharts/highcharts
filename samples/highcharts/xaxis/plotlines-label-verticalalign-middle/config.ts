import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.plotLines[0].label.verticalAlign',
        value: 'middle'
    }, {
        path: 'xAxis.plotLines[0].label.textAlign',
        value: 'center',
        inTitle: false
    }, {
        path: 'xAxis.plotLines[0].label.y',
        value: 0,
        min: -10,
        max: 10,
        inTitle: false
    }],
    templates: ['linear-12', 'datetime'],
    chartOptionsExtra: {
        xAxis: {
            plotLines: [{
                value: '2026-06-15',
                width: 2,
                label: {
                    text: 'Plot line label'
                }
            }]
        }
    }
} satisfies SampleGeneratorConfig;
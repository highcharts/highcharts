import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.plotLines[0].color',
        value: '#ff8888'
    }],
    templates: ['linear-12', 'datetime'],
    chartOptionsExtra: {
        xAxis: {
            plotLines: [{
                value: '2026-06-15',
                width: 2
            }]
        }
    }
} satisfies SampleGeneratorConfig;
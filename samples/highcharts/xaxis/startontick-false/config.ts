import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.startOnTick',
        value: false
    }],
    templates: ['linear-12', 'datetime'],
    chartOptionsExtra: {
        plotOptions: {
            series: {
                pointStart: '2026-01-10'
            }
        }
    }
} satisfies SampleGeneratorConfig;
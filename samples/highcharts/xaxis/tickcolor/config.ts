import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.tickColor',
        value: '#00c000'
    }],
    templates: ['linear-12', 'datetime'],
    chartOptionsExtra: {
        xAxis: {
            tickWidth: 3
        }
    }
} satisfies SampleGeneratorConfig;
import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.tickmarkPlacement',
        value: 'between',
        options: ['on', 'between']
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        xAxis: {
            tickWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;
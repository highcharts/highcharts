import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.tickmarkPlacement',
        value: 'on',
        options: ['on', 'between']
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        xAxis: {
            tickWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;
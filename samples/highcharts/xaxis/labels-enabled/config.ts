import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.labels.enabled',
        value: false
    }, {
        path: 'yAxis.labels.enabled',
        value: true
    }]
} satisfies SampleGeneratorConfig;
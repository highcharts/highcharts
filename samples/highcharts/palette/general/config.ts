import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'palette.light.backgroundColor',
        value: '#f0f0f0'
    }, {
        path: 'palette.light.colors[0]',
        value: '#2caffe'
    }, {
        path: 'palette.light.colors[1]',
        value: '#544fc5'
    }],
    chartOptionsExtra: {
        series: [{
            data: [1, 3, 2, 4]
        }, {
            data: [5, 3, 4, 2]
        }]
    }
} satisfies SampleGeneratorConfig;
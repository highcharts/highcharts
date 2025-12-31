import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.labels.style.color',
        value: '#2caffe'
    }, {
        path: 'xAxis.labels.style.fontWeight',
        options: ['normal', 'bold', 'bolder', 'lighter'],
        value: 'bold'
    }, {
        path: 'xAxis.labels.style.fontSize',
        value: '0.8em',
        min: 0.5,
        max: 2,
        type: 'number',
        step: 0.1
    }],
    templates: ['line']
} satisfies SampleGeneratorConfig;
import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'palette.light.backgroundColor'
    }, {
        path: 'palette.light.neutralColor'
    }, {
        path: 'palette.light.highlightColor'
    }, {
        path: 'palette.light.colors[0]',
        value: '#2caffe'
    }, {
        path: 'palette.light.colors[1]',
        value: '#544fc5'
    }],
    controlsDescription: `Text elements use different blends of the neutral
        color and background color. The chart border uses the highlight color.`,
    chartOptionsExtra: {
        chart: {
            borderWidth: 2,
            borderRadius: 7
        },
        series: [{
            data: [1, 3, 2, 4]
        }, {
            data: [5, 3, 4, 2]
        }]
    }
} satisfies SampleGeneratorConfig;
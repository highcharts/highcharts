import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'palette.colorScheme',
        options: ['light dark', 'light', 'dark'],
        value: 'light dark'
    }, {
        type: 'separator'
    }, {
        path: 'palette.light.backgroundColor'
    }, {
        path: 'palette.light.neutralColor'
    }, {
        path: 'palette.light.highlightColor'
    }, {
        type: 'separator'
    }, {
        path: 'palette.light.colors[0]',
        value: '#2caffe'
    }, {
        path: 'palette.light.colors[1]',
        value: '#544fc5'
    }, {
        type: 'separator'
    }, {
        path: 'palette.dark.backgroundColor'
    }, {
        path: 'palette.dark.neutralColor'
    }, {
        path: 'palette.dark.highlightColor'
    }, {
        type: 'separator'
    }, {
        path: 'palette.dark.colors[0]',
        value: '#2caffe'
    }, {
        path: 'palette.dark.colors[1]',
        value: '#ffff00'
    }],
    controlsDescription: `Text elements use different blends of the neutral
        color and background color`,
    chartOptionsExtra: {
        subtitle: {
            text: 'This subtitle uses the highlight color',
            style: {
                color: 'var(--highcharts-highlight-color)'
            }
        },
        series: [{
            data: [1, 3, 2, 4]
        }, {
            data: [5, 3, 4, 2]
        }]
    }
} satisfies SampleGeneratorConfig;
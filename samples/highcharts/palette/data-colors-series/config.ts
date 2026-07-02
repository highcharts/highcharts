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
        path: 'palette.colors[0]',
        value: '#2caffe'
    }, {
        path: 'palette.colors[1]',
        value: '#2e2a69'
    }, {
        path: 'palette.colors[2]',
        value: '#00e272'
    }, {
        type: 'separator'
    }, {
        path: 'palette.dark.colors[1]',
        value: '#efdf00'
    }],
    controlsDescription: 'The second color is overridden in dark mode',
    templates: ['datetime'],
    chartOptionsExtra: {
        series: [{
            data: [3, 6, 5, 6]
        }, {
            data: [2, 5, 4, 5]
        }, {
            data: [1, 3, 2, 4]
        }]
    }
} satisfies SampleGeneratorConfig;
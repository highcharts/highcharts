import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'palette.colorScheme',
        options: ['light dark', 'light', 'dark'],
        value: 'light dark'
    }, {
        path: 'palette.light.colors[0]',
        value: '#2caffe'
    }, {
        path: 'palette.light.colors[1]',
        value: '#544fc5'
    }, {
        path: 'palette.light.colors[2]',
        value: '#00e272'
    }, {
        path: 'palette.dark.colors[0]',
        value: '#2caffe'
    }, {
        path: 'palette.dark.colors[1]',
        value: '#00e272'
    }, {
        path: 'palette.dark.colors[2]',
        value: '#efdf00'
    }],

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
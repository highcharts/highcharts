import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'palette.colorScheme',
        options: ['light dark', 'light', 'dark'],
        value: 'dark'
    }],
    codePath: 'https://cdn.jsdelivr.net/npm/highcharts@v13.0.0-beta.1',
    chartOptionsExtra: {
        series: [{
            data: [1, 3, 2, 4],
            colorByPoint: true
        }]
    }
} satisfies SampleGeneratorConfig;
import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'plotOptions.column.color.linearGradient.gradientUnits',
        options: ['userSpaceOnUse', 'objectBoundingBox']
    }],
    chartOptionsExtra: {
        plotOptions: {
            column: {
                color: {
                    linearGradient: {
                        x1: 0,
                        y1: '10%',
                        x2: 0,
                        y2: '100%',
                        gradientUnits: 'objectBoundingBox'
                    },
                    stops: [
                        [0, '#2caffe'],
                        [1, 'var(--highcharts-background-color)']
                    ]
                }
            }
        }
    }
} satisfies SampleGeneratorConfig;
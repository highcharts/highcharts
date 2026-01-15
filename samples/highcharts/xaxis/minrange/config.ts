import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.minRange',
        value: 5,
        min: 0,
        max: 10
    }],
    templates: ['linear-12'],
    chartOptionsExtra: {
        chart: {
            zooming: {
                type: 'x'
            }
        },
        subtitle: {
            text: 'Zoom in to see the effect'
        }
    }
} satisfies SampleGeneratorConfig;
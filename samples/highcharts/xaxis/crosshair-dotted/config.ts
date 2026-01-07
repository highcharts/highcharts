import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.crosshair.dashStyle',
        value: 'ShortDot'
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        xAxis: {
            crosshair: {
                color: 'gray',
                width: 2
            }
        }
    }
} satisfies SampleGeneratorConfig;
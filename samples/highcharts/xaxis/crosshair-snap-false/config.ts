import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.crosshair.snap',
        value: false
    }, {
        path: 'yAxis.crosshair.snap',
        value: false
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        xAxis: {
            crosshair: {
                width: 2
            }
        }
    }
} satisfies SampleGeneratorConfig;
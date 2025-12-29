import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.crosshair.dashStyle',
        value: 'ShortDot'
    }],
    templates: ['line'],
    chartOptionsExtra: {
        xAxis: {
            crosshair: {
                color: 'gray',
                width: 2
            }
        }
    }
} satisfies SampleGeneratorConfig;
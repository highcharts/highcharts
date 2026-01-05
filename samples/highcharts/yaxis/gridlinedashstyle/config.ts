import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.gridLineDashStyle',
        value: 'Dash'
    }],
    chartOptionsExtra: {
        yAxis: {
            gridLineColor: 'gray'
        }
    }
} satisfies SampleGeneratorConfig;
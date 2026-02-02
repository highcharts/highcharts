import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

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
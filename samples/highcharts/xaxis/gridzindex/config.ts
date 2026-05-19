import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.gridZIndex',
        value: 4,
        min: 0,
        max: 10
    }],
    chartOptionsExtra: {
        chart: {
            type: 'area'
        },
        xAxis: {
            gridLineWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;
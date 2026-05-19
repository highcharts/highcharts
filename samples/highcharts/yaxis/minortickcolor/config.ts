import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.minorTickColor',
        value: '#ff0000'
    }],
    chartOptionsExtra: {
        yAxis: {
            minorTickWidth: 2,
            minorTicks: true
        }
    }
} satisfies SampleGeneratorConfig;
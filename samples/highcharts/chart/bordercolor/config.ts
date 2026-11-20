import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.borderColor',
        value: 'light-dark(#202030, #f0f0ff)'
    }],
    chartOptionsExtra: {
        chart: {
            borderRadius: 7,
            borderWidth: 2
        }
    }
} satisfies SampleGeneratorConfig;
import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.backgroundColor',
        value: 'light-dark(#f0f0ff, #202030)'
    }],
    chartOptionsExtra: {
        chart: {
            borderRadius: 7
        }
    }
} satisfies SampleGeneratorConfig;
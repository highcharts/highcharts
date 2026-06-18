import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'legend.shadow',
        value: true
    }],
    chartOptionsExtra: {
        legend: {
            backgroundColor: 'var(--highcharts-background-color)',
            floating: true,
            align: 'left',
            verticalAlign: 'top',
            borderRadius: 5,
            x: 100,
            y: 70
        }
    }
} satisfies SampleGeneratorConfig;
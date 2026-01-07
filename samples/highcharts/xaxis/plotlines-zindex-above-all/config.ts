import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.plotLines[0].zIndex',
        value: 5,
        min: 0,
        max: 10
    }],
    templates: ['linear-12', 'datetime'],
    chartOptionsExtra: {
        plotOptions: {
            series: {
                lineWidth: 5
            }
        },
        xAxis: {
            plotLines: [{
                value: '2026-06-15',
                color: '#44ee44',
                width: 5
            }]
        },
        yAxis: {
            gridLineWidth: 5
        }
    }
} satisfies SampleGeneratorConfig;
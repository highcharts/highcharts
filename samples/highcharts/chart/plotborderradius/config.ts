import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.plotBorderRadius',
        value: 5,
        max: 20
    }, {
        path: 'chart.plotBorderWidth',
        value: 1,
        max: 3,
        inTitle: false
    }, {
        path: 'chart.plotShadow',
        value: false,
        inTitle: false
    }],
    chartOptionsExtra: {
        chart: {
            plotBackgroundColor: 'light-dark(#f8f8f8, #222)'
        },
        xAxis: {
            gridLineColor: 'var(--highcharts-neutral-color-20)',
            gridLineWidth: 1
        },
        yAxis: {
            gridLineColor: 'var(--highcharts-neutral-color-20)'
        }
    }
} satisfies SampleGeneratorConfig;
import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.plotBands[0].outerRadius',
        value: '105%',
        min: 100,
        max: 120
    }, {
        path: 'yAxis.plotBands[0].thickness',
        value: '5%'
    }],
    modules: ['highcharts-more'],

    chartOptionsExtra: {

        chart: {
            type: 'gauge'
        },

        title: {
            text: 'Demo of gauge plot bands'
        },

        pane: {
            startAngle: -150,
            endAngle: 150
        },

        yAxis: {
            min: 0,
            max: 100,
            plotBands: [{
                from: 0,
                to: 60,
                color: '#89A54E'
            }]
        },

        series: [{
            data: [80]
        }]
    }
} satisfies SampleGeneratorConfig;
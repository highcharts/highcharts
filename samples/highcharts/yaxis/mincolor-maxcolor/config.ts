import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.minColor',
        value: '#ffffff'
    }, {
        path: 'yAxis.maxColor',
        value: '#000000'
    }, {
        path: 'series[0].data[0]',
        value: 30
    }],
    modules: ['highcharts-more', 'modules/solid-gauge'],
    templates: [],
    chartOptionsExtra: {
        chart: {
            type: 'solidgauge'
        },
        title: {
            text: 'Demo of <em>yAxis.minColor</em> and <em>yAxis.maxColor</em>'
        },
        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                distance: '80%',
                y: 20
            }
        }
    }
} satisfies SampleGeneratorConfig;
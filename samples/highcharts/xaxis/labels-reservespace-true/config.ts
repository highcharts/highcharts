import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.labels.reserveSpace',
        value: true
    }],
    chartOptionsExtra: {
        chart: {
            type: 'bar'
        },
        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
        },
        series: [{
            data: [5, 3, 4, 7, 2]
        }]
    }
} satisfies SampleGeneratorConfig;
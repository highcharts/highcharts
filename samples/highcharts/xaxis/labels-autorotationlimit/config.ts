import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.labels.autoRotationLimit',
        value: 40,
        min: 10,
        max: 100
    }],
    chartOptionsExtra: {
        chart: {
            type: 'column',
            width: 500
        },
        subtitle: {
            text: 'Short words means word-wrap makes sense'
        },
        xAxis: {
            type: 'category'
        },
        series: [{
            showInLegend: false,
            data: [{
                name: 'Pasta (no gluten)',
                y: 77
            }, {
                name: 'Rice (white & brown)',
                y: 50
            }, {
                name: 'Bread (white & brown)',
                y: 20
            }, {
                name: 'Eggs (chicken, duck & goose)',
                y: 48
            }, {
                name: 'Meat (cattle, fowl & fish)',
                y: 36
            }, {
                name: 'Vegetables',
                y: 15
            }, {
                name: 'Fruits',
                y: 57
            }]
        }]
    }
} satisfies SampleGeneratorConfig;
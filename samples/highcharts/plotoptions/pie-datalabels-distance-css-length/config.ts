import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'plotOptions.pie.dataLabels.distance',
        type: 'text',
        value: '3rem'
    }],
    templates: [],
    chartOptionsExtra: {
        series: [{
            type: 'pie',
            name: 'Share',
            data: [
                ['Apples', 4],
                ['Bananas', 3],
                ['Oranges', 2],
                ['Pears', 1]
            ]
        }]
    }
} satisfies SampleGeneratorConfig;

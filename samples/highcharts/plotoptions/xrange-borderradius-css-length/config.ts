import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'plotOptions.xrange.borderRadius',
        type: 'text',
        value: '1rem'
    }],
    modules: ['modules/xrange'],
    templates: [],
    chartOptionsExtra: {
        yAxis: {
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true,
            title: {
                text: ''
            }
        },
        series: [{
            type: 'xrange',
            name: 'Project',
            data: [
                { x: 0, x2: 4, y: 0 },
                { x: 3, x2: 9, y: 1 },
                { x: 7, x2: 10, y: 2 }
            ]
        }]
    }
} satisfies SampleGeneratorConfig;

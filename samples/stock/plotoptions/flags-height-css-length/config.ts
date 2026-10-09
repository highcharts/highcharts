import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'plotOptions.flags.height',
        type: 'text',
        value: '2rem'
    }],
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        navigator: {
            enabled: false
        },
        rangeSelector: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        series: [{
            name: 'Value',
            data: [3, 5, 4, 6, 8, 7, 9, 8, 10, 9],
            pointStart: Date.UTC(2025, 0, 1),
            pointInterval: 864e5
        }, {
            type: 'flags',
            name: 'Events',
            shape: 'squarepin',
            data: [{
                x: Date.UTC(2025, 0, 3),
                title: 'A'
            }, {
                x: Date.UTC(2025, 0, 6),
                title: 'B'
            }, {
                x: Date.UTC(2025, 0, 9),
                title: 'C'
            }]
        }]
    }
} satisfies SampleGeneratorConfig;

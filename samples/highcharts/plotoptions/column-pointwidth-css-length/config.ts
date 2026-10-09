import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'plotOptions.column.pointWidth',
        type: 'text',
        value: '1.5rem'
    }],
    chartOptionsExtra: {
        subtitle: {
            text: 'Oranges overrides it with <em>series.data.pointWidth</em>'
        },
        series: [{
            data: [1, 3, {
                y: 2,
                pointWidth: '4rem'
            }, 4]
        }]
    }
} satisfies SampleGeneratorConfig;

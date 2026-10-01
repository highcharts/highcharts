import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.plotBands[0].zIndex',
        value: 5,
        min: 0,
        max: 10
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        subtitle: {
            text: `<em>zIndex: 0</em> → behind the grid lines<br>
            <em>zIndex: 4</em> → in front of the line graph<br>
            <em>zIndex: 9</em> → in front of the tooltip`
        },
        xAxis: {
            plotBands: [{
                color: '#8888ff',
                from: 2.5,
                to: 4.5
            }]
        },
        yAxis: {
            gridLineWidth: 2
        }
    }
} satisfies SampleGeneratorConfig;
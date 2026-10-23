import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.plotLines[0].zIndex',
        type: 'number',
        min: 0,
        max: 10
    }],
    templates: ['linear-12', 'datetime'],
    chartOptionsExtra: {
        subtitle: {
            text: `<em>zIndex: 0</em> → behind the grid lines<br>
            <em>zIndex: 4</em> → in front of the line graph<br>
            <em>zIndex: 9</em> → in front of the tooltip`
        },
        plotOptions: {
            series: {
                lineWidth: 5
            }
        },
        xAxis: {
            plotLines: [{
                value: '2026-06-15',
                color: '#44ee44',
                width: 5
            }]
        },
        yAxis: {
            gridLineWidth: 5
        }
    }
} satisfies SampleGeneratorConfig;
import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'tooltip.showDelay',
        value: 1000,
        max: 3000,
        min: 0,
        step: 100
    }, {
        path: 'xAxis.crosshair.showDelay',
        value: 1000,
        max: 3000,
        min: 0,
        step: 100
    }, {
        path: 'yAxis.crosshair.showDelay',
        value: 1000,
        max: 3000,
        min: 0,
        step: 100
    }],
    chartOptionsExtra: {
        title: {
            text: 'Crosshair and Tooltip showDelay demo'
        },
        xAxis: {
            crosshair: {
                showDelay: 1000
            }
        },
        yAxis: {
            crosshair: {
                showDelay: 1000
            }
        },
        tooltip: {
            showDelay: 1000,
            hideDelay: 1500
        },
        series: [{
            data: [4, 3, 5, 6, 2, 3]
        }]
    }
} satisfies SampleGeneratorConfig;
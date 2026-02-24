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
    templates: ['linear-12', 'datetime'],
    chartOptionsExtra: {
        title: {
            text: 'Crosshair and Tooltip <em>showDelay</em> demo'
        }
    }
} satisfies SampleGeneratorConfig;
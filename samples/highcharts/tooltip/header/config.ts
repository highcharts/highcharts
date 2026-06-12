import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'tooltip.header.backgroundColor',
        value: '#444444'
    }, {
        path: 'tooltip.header.borderColor',
        value: '#141414'
    }, {
        path: 'tooltip.header.borderWidth',
        value: 1
    }, {
        path: 'tooltip.header.distance',
        value: 5,
        min: 0,
        max: 20
    }, {
        path: 'tooltip.header.style.color',
        value: '#ffffff'
    }],
    templates: ['linear-12', 'datetime'],
    chartOptionsExtra: {
        tooltip: {
            split: true
        },
        xAxis: {
            crosshair: true
        }
    }
} satisfies SampleGeneratorConfig;
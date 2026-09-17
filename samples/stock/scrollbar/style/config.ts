import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'scrollbar.height',
        value: 10,
        min: 6,
        max: 30
    }, {
        path: 'scrollbar.margin',
        value: 0,
        min: 0,
        max: 30
    }, {
        type: 'separator'
    }, {
        path: 'scrollbar.trackBackgroundColor',
        value: 'rgba(255, 255, 255, 0.001)'
    }, {
        path: 'scrollbar.trackBorderColor',
        value: '#cccccc'
    }, {
        path: 'scrollbar.trackBorderRadius',
        value: 5,
        min: 0,
        max: 10
    }, {
        path: 'scrollbar.trackBorderWidth',
        value: 1,
        min: 0,
        max: 5
    }, {
        type: 'separator'
    }, {
        path: 'scrollbar.barBackgroundColor',
        value: '#cccccc'
    }, {
        path: 'scrollbar.barBorderColor',
        value: '#cccccc'
    }, {
        path: 'scrollbar.barBorderRadius',
        value: 5,
        min: 0,
        max: 10
    }, {
        path: 'scrollbar.barBorderWidth',
        value: 0,
        min: 0,
        max: 5
    }, {
        type: 'separator'
    }, {
        path: 'scrollbar.buttonsEnabled',
        value: false
    }, {
        path: 'scrollbar.buttonArrowColor',
        value: '#333333'
    }, {
        path: 'scrollbar.buttonBackgroundColor',
        value: '#e6e6e6'
    }, {
        path: 'scrollbar.buttonBorderColor',
        value: '#cccccc'
    }, {
        path: 'scrollbar.buttonBorderRadius',
        value: 0,
        min: 0,
        max: 10
    }, {
        path: 'scrollbar.buttonBorderWidth',
        value: 1,
        min: 0,
        max: 5
    }, {
        type: 'separator'
    }, {
        path: 'scrollbar.rifleColor',
        value: 'none'
    }],
    dataFile: 'usdeur.json',
    factory: 'stockChart',
    templates: [],
    chartOptionsExtra: {
        rangeSelector: {
            selected: 4
        },
        series: [{
            name: 'USD to EUR'
        }]
    }
} satisfies SampleGeneratorConfig;

import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.ordinal',
        value: false
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        rangeSelector: {
            selected: 0
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: null,
                    fillColor: 'light-dark(#fff, #141414)',
                    radius: 3,
                    lineColor: null,
                    lineWidth: 2
                }
            }
        }
    }
} satisfies SampleGeneratorConfig;
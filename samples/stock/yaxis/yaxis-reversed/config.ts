import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.reversed',
        value: true
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        chart: {
            type: 'area'
        },
        plotOptions: {
            area: {
                fillOpacity: 0.3
            }
        }
    }
} satisfies SampleGeneratorConfig;
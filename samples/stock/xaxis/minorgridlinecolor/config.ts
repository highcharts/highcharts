import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.minorGridLineColor',
        value: '#00c00019'
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        yAxis: {
            minorTicks: true
        }
    }
} satisfies SampleGeneratorConfig;
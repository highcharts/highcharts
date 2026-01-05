import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.minorGridLineWidth',
        value: 1
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        yAxis: {
            minorTicks: true,
            gridLineWidth: 2,
            gridLineColor: '#808080',
            minorGridLineColor: '#80808080'
        }
    }
} satisfies SampleGeneratorConfig;
import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.minorGridLineDashStyle',
        value: 'Dash'
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        yAxis: {
            minorTicks: true,
            gridLineColor: '#808080',
            minorGridLineColor: '#80808080'
        }
    }
} satisfies SampleGeneratorConfig;
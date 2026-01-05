import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.plotBands[0].label.text',
        value: 'Comfort zone'
    }, {
        path: 'yAxis.plotBands[0].label.align',
        value: 'center'
    }, {
        path: 'yAxis.plotBands[0].label.x',
        value: 0
    }, {
        path: 'yAxis.plotBands[0].label.verticalAlign',
        value: 'middle'
    }, {
        path: 'yAxis.plotBands[0].label.y',
        value: 0
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        yAxis: {
            plotBands: [{
                from: 0.75,
                to: 0.85,
                color: '#00c00019',
                zIndex: 3
            }]
        }
    }
} satisfies SampleGeneratorConfig;
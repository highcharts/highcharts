import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.dateTimeLabelFormats.second',
        value: '%Y-%m-%d<br/>%H:%M:%S'
    }, {
        path: 'xAxis.dateTimeLabelFormats.minute',
        value: '%Y-%m-%d<br/>%H:%M'
    }, {
        path: 'xAxis.dateTimeLabelFormats.hour',
        value: '%Y-%m-%d<br/>%H:%M'
    }, {
        path: 'xAxis.dateTimeLabelFormats.day',
        value: '%Y<br/>%m-%d'
    }, {
        path: 'xAxis.dateTimeLabelFormats.week',
        value: '%Y<br/>%m-%d'
    }, {
        path: 'xAxis.dateTimeLabelFormats.month',
        value: '%Y-%m'
    }, {
        path: 'xAxis.dateTimeLabelFormats.year',
        value: '%Y'
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart'
} satisfies SampleGeneratorConfig;
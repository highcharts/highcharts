import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.zoomEnabled',
        value: false
    }, {
        path: 'yAxis.zoomEnabled',
        value: true
    }],
    templates: ['linear-12', 'datetime'],
    chartOptionsExtra: {
        chart: {
            zooming: {
                type: 'xy'
            }
        }
    }
} satisfies SampleGeneratorConfig;
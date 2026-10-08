import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'plotOptions.treegraph.marker.radius',
        type: 'text',
        value: '1.5rem'
    }],
    modules: ['modules/treemap', 'modules/treegraph'],
    templates: [],
    chartOptionsExtra: {
        series: [{
            type: 'treegraph',
            data: [
                { id: 'root' },
                { id: 'A', parent: 'root' },
                { id: 'B', parent: 'root' },
                { id: 'A1', parent: 'A' },
                { id: 'A2', parent: 'A' },
                { id: 'B1', parent: 'B' }
            ]
        }]
    }
} satisfies SampleGeneratorConfig;

import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'contour.smoothColoring',
        value: false
    }, {
        path: 'contour.lineWidth',
        value: false
    }],
    dataFile: 'contour-mountain-data.json',
    templates: [],
    factory: 'chart'
} satisfies SampleGeneratorConfig;
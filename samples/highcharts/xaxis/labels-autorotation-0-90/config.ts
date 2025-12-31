import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'chart.width',
        value: 360,
        min: 100,
        max: 1000
    }],
    templates: ['line'],
    chartOptionsExtra: {
        title: {
            text: 'Auto rotated X axis labels'
        },
        subtitle: {
            text: 'Drag slider to see the effect of auto rotation'
        },
        xAxis: {
            categories: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ],
            labels: {
                autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90]
            }
        }
    }
} satisfies SampleGeneratorConfig;
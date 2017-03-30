

Highcharts.chart('container', {

    title: {
        text: 'Gradients in styled mode'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    defs: {
        gradient0: {
            tagName: 'linearGradient',
            id: 'gradient-0',
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
            children: [{
                tagName: 'stop',
                offset: 0
            }, {
                tagName: 'stop',
                offset: 1
            }]
        },
        gradient1: {
            tagName: 'linearGradient',
            id: 'gradient-1',
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
            children: [{
                tagName: 'stop',
                offset: 0
            }, {
                tagName: 'stop',
                offset: 1
            }]
        }
    },

    series: [{
        type: 'area',
        keys: ['y', 'selected'],
        data: [
            [29.9, false],
            [71.5, false],
            [106.4, false],
            [129.2, false],
            [144.0, false],
            [176.0, false],
            [135.6, false],
            [148.5, false],
            [216.4, true],
            [194.1, false],
            [95.6, false],
            [54.4, false]
        ]
    }]
});


Highcharts.chart('container', {

    title: {
        text: 'Shadows and glow in styled mode'
    },

    subtitle: {
        text: 'Using SVG filters'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    defs: {
        glow: {
            tagName: 'filter',
            id: 'glow',
            opacity: 0.5,
            children: [{
                tagName: 'feGaussianBlur',
                result: 'coloredBlur',
                stdDeviation: 2.5
            }, {
                tagName: 'feMerge',
                children: [{
                    tagName: 'feMergeNode',
                    in: 'coloredBlur'
                }, {
                    tagName: 'feMergeNode',
                    in: 'SourceGraphic'
                }]
            }]
        }
    },

    series: [{
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
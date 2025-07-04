Highcharts.chart('container', {
    chart: {
        type: 'tilemap',
        marginTop: 15,
        height: '65%'
    },

    title: {
        text: 'Idea map'
    },

    subtitle: {
        text: 'Hover over tiles for details'
    },

    colors: [
        '#fed',
        '#ffddc0',
        '#ecb',
        '#dba',
        '#c99',
        '#b88',
        '#aa7577',
        '#9f6a66'
    ],

    accessibility: {
        point: {
            valueDescriptionFormat: '{point.name}. {point.desc}'
        },
        typeDescription: 'Idea map, laid out as tiles with the main idea in ' +
            'the centre. Steps related to the main idea are shown as ' +
            'additional tiles circling the centre tile.'
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        visible: false
    },

    legend: {
        enabled: false
    },

    tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color: {point.color}">●</span>' +
            '<span style="font-size: 13px; font-weight: bold"> {point.name}' +
            '</span><br>{point.desc}',
        style: {
            width: 170
        },
        padding: 10,
        hideDelay: 1000000
    },

    plotOptions: {
        series: {
            keys: ['x', 'y', 'name', 'desc'],
            tileShape: 'diamond',
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                color: '#000000',
                style: {
                    textOutline: false
                }
            }
        }
    },

    series: [{
        name: 'Main idea',
        pointPadding: 10,
        data: [
            [
                5, 3, 'Main idea',
                'The main idea tile outlines the overall theme of the idea ' +
                'map.'
            ]
        ],
        color: '#7eb'
    }, {
        name: 'Steps',
        colorByPoint: true, // Pick new color for each point from colors array
        data: [
            [
                3, 3, 'Step 1',
                'First step towards the main idea. Describe the starting ' +
                'point of the situation.'
            ],
            [
                4, 3, 'Step 2',
                'Describe where to move next in a short term time ' +
                'perspective.'
            ],
            [
                5, 4, 'Step 3',
                'This can be a larger milestone, after the initial steps ' +
                'have been taken.'
            ],
            [
                6, 3, 'Step 4',
                'Evaluate progress and readjust the course of the project.'
            ],
            [
                7, 3, 'Step 5',
                'At this point, major progress should have been made, and we ' +
                'should be well on our way to implementing the main idea.'
            ],
            [
                6, 2, 'Step 6',
                'Second evaluation and readjustment step. Implement final ' +
                'changes.'
            ],
            [
                5, 2, 'Step 7',
                'Testing and final verification step.'
            ],
            [
                4, 2, 'Step 8',
                'Iterate after final testing and finalize implementation of ' +
                'the idea.'
            ]
        ]
    }]
}, function (chart) {
    chart.tooltip.refresh(chart.series[0].points[0]); // Show tooltip of the
    // first point on load
});

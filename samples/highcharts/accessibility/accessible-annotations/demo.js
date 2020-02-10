Highcharts.chart('container', {
    title: {
        text: 'Total CSUN conference sessions by year'
    },

    series: [{
        name: 'Total sessions',
        pointStart: 2015,
        data: [{
            id: '2015',
            y: 382
        }, {
            id: '2016',
            y: 389
        }, {
            id: '2017',
            y: 426
        }, {
            id: '2018',
            y: 442
        }, {
            id: '2019',
            y: 381
        }, {
            id: '2020',
            y: 468
        }]
    }],

    legend: {
        enabled: false
    },

    xAxis: {
        type: 'category',
        accessibility: {
            description: 'Year',
            rangeDescription: 'Range: 2015 to 2020.'
        }
    },

    yAxis: {
        title: {
            text: 'Sessions'
        },
        labels: {
            format: '{value}'
        }
    },

    tooltip: {
        // Position tooltip below points except for the first one
        positioner: function (_, labelHeight, point) {
            const x = point.plotX;
            const firstPoint = this.chart.series[0].points[0];
            const isClose = (a, b) => Math.abs(a - b) < 1;
            let y = point.plotY;

            if (isClose(x, firstPoint.plotX)) {
                y -= 15; // Display above
            } else {
                y += labelHeight + 15; // Display below
            }

            return { x, y };
        },
        backgroundColor: 'rgba(250, 250, 250, 0.97)'
    },

    annotations: [{
        draggable: false,
        labels: [{
            point: {
                x: 0, y: 0
            },
            x: -10,
            y: 10,
            style: {
                width: 150
            },
            borderRadius: 5,
            shape: 'rect',
            text: 'Annotations showing presentation info for Elsevier and Highcharts',
            backgroundColor: 'rgb(250, 245, 245)',
            borderColor: 'rgb(255, 250, 250)',
            padding: 10
        }]
    }, {
        draggable: false,
        labelOptions: {
            allowOverlap: true,
            distance: 15
        },
        labels: [{
            point: '2015',
            text: 'Ted nearly plows into Stevie Wonder<br> on his way to the bathroom',
            distance: null,
            y: 50
        }, {
            point: '2016',
            text: 'Elsevier & Highcharts presented together'
        }, {
            points: '2017',
            text: 'Elsevier presented on VPATs'
        }, {
            point: '2018',
            text: 'Vidar got selfie with Stevie',
            shape: 'rect',
            verticalAlign: 'top',
            distance: 65
        }, {
            point: '2018',
            text: 'Elsevier presented 2 sessions',
            shape: 'rect',
            verticalAlign: 'top',
            distance: 40
        }, {
            point: '2018',
            text: 'Highcharts presented 1 session',
            verticalAlign: 'top'
        }, {
            point: '2019',
            text: 'Elsevier & Highcharts presented together',
            shape: 'rect',
            verticalAlign: 'top',
            distance: 40
        }, {
            point: '2019',
            text: 'Ted passes by Stevie in the hotel lobby'
        }, {
            point: '2020',
            text: 'Elsevier & Highcharts is presenting together',
            y: -35
        }]
    }]
});

Highcharts.chart('container', {
    accessibility: {
        point: {
            valueSuffix: ' sessions'
        }
    },

    lang: {
        accessibility: {
            screenReaderSection: {
                // No need for end of chart maker when using <figure>
                // with no content after the chart.
                endOfChartMarker: ''
            }
        }
    },

    title: {
        text: 'Total CSUN conference sessions by year'
    },

    subtitle: {
        text: 'Highlighting our sessions and Stevie Wonder encounters'
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
        },
        minPadding: 0.3,
        maxPadding: 0.25
    },

    tooltip: {
        // Position tooltip below points except for the first one
        positioner: function (_, labelHeight, point) {
            const x = point.plotX;
            const firstPoint = this.chart.series[0].points[0];
            const isClose = (a, b) => Math.abs(a - b) < 1;
            let y = point.plotY;

            if (!isClose(x, firstPoint.plotX)) {
                y += labelHeight + 30; // Display below
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
            align: 'left',
            x: 10,
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
            distance: 15,
            style: {
                width: 180
            }
        },
        labels: [{
            point: '2015',
            text: 'Ted nearly plows into Stevie Wonder on his way to the bathroom',
            distance: null,
            y: 60
        }, {
            point: '2016',
            text: 'Elsevier and Highcharts presented first session together: Accessible SVG Charts'
        }, {
            point: '2018',
            text: 'Vidar got selfie with Stevie'
        }, {
            point: '2019',
            text: 'First year in Anaheim',
            shape: 'rect',
            verticalAlign: 'top',
            distance: 110
        }, {
            point: '2019',
            text: 'Elsevier and Highcharts presented 2nd session together:  Highcharts, The Next Chapter',
            shape: 'rect',
            verticalAlign: 'top',
            distance: 55
        }, {
            point: '2019',
            text: 'Ted passes by Stevie in the hotel lobby'
        }, {
            point: '2020',
            text: 'Elsevier and Highcharts presented together: Accessible Visualizations: Maps, Annotations, and Sparklines',
            y: -35
        }]
    }]
});

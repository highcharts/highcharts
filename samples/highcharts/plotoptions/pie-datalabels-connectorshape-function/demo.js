Highcharts.chart('container', {
    chart: {
        borderWidth: 1,
        borderColor: '#eee',
        plotBorderWidth: 1,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Most World Cup Wins By Country (after 2018 tournament)'
    },
    tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b> of all {series.total} cups'
    },
    plotOptions: {
        pie: {
            size: '60%',
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                alignTo: 'plotEdges',
                format: '<b>{point.name}</b>: {point.y}',
                connectorShape: function (labelPosition, connectorPosition, options) {

                    var connectorPadding = options.connectorPadding,
                        touchingSliceAt = connectorPosition.touchingSliceAt,
                        series = this.series,
                        plotWidth = series.chart.plotWidth,
                        plotLeft = series.chart.plotLeft,
                        alignment = labelPosition.alignment,
                        stepDistance = 150, // in px - distance betwenn the step and vertical plot border
                        stepX = alignment === 'left' ? plotLeft + plotWidth - stepDistance : plotLeft + stepDistance;

                    return ['M',
                        labelPosition.x + (alignment === 'left' ? 1 : -1) *
            connectorPadding,
                        labelPosition.y,
                        'L',
                        stepX,
                        labelPosition.y,
                        'L',
                        stepX,
                        touchingSliceAt.y,
                        'L',
                        touchingSliceAt.x,
                        touchingSliceAt.y
                    ];

                }
            }
        }
    },
    series: [{
        name: 'Teams',
        colorByPoint: true,
        data: [{
            name: 'Spain',
            y: 1
        }, {
            name: 'Brazil',
            y: 5
        }, {
            name: 'England',
            y: 1
        }, {
            name: 'Germany',
            y: 4
        }, {
            name: 'Italy',
            y: 4
        }, {
            name: 'Uruguay',
            y: 2
        }, {
            name: 'Argentina',
            y: 2
        }, {
            name: 'France',
            y: 2
        }]
    }]
});

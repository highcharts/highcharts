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
                format: '<b>{point.name}</b><br><b>{point.y}</b> ' +
                    '<span style="opacity: 0.5">({point.percentage:.1f}%)</span>',
                style: {
                    fontWeight: 'normal'
                },
                // Apply a custom connectorShape function that extends the
                // horizontal part of the connector below the label.
                connectorShape: function (
                    labelPosition,
                    connectorPosition,
                    options
                ) {

                    // Let the built-in crookedLine function do the heavy
                    // lifting
                    const path = Highcharts.seriesTypes
                        .pie
                        .prototype
                        .pointClass
                        .prototype
                        .connectorShapes
                        .crookedLine
                        .call(this, labelPosition, connectorPosition, options);

                    const labelWidth = this.dataLabel.getBBox().width;
                    if (labelPosition.alignment === 'right') {
                        path[0][1] -= labelWidth;
                    } else {
                        path[0][1] += labelWidth;
                    }

                    return path;

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

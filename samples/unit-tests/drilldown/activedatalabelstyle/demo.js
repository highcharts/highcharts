QUnit.test('activeDataLabelStyle', function (assert) {
    function getDataLabelFill(point) {
        return point.dataLabel.element.childNodes[0].style.fill;
    }
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        inside: true
                    }
                }
            },
            series: [{
                data: [{
                    drilldown: 'fruits',
                    y: 20,
                    color: '#000000'
                }]
            }],
            drilldown: {
                activeDataLabelStyle: {
                    color: 'contrast'
                },
                series: [{
                    id: 'fruits',
                    data: [2]
                }]
            }
        }),
        series = chart.series[0],
        point = series.points[0];

    assert.ok(
        getDataLabelFill(point) === 'rgb(255, 255, 255)' || getDataLabelFill(point) === '#ffffff',
        'activeDataLabelStyle.color contrast to black'
    );
    point.update({
        color: '#FFFFFF'
    });
    assert.ok(
        getDataLabelFill(point),
        getDataLabelFill(point) === 'rgb(0, 0, 0)' || getDataLabelFill(point) === '#000000',
        'activeDataLabelStyle.color contrast to white'
    );

    chart.destroy();
    chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    inside: true
                }
            }
        },
        series: [{
            data: [{
                drilldown: 'fruits',
                y: 20
            }]
        }],
        drilldown: {
            activeDataLabelStyle: {
                color: '#FFFF00'
            },
            series: [{
                id: 'fruits',
                data: [2]
            }]
        }
    });
    series = chart.series[0];
    point = series.points[0];
    assert.ok(
        getDataLabelFill(point) === 'rgb(255, 255, 0)' || getDataLabelFill(point) === '#ffff00',
        'activeDataLabelStyle.color: "#FFFF00"'
    );
});

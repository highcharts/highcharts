
QUnit.test('Visible funnel items', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'funnel',
            marginRight: 100,
            width: 300
        },
        title: {
            text: 'Sales funnel',
            x: -50
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                    softConnector: true
                },
                neckWidth: '30%',
                neckHeight: '25%'

                //-- Other available options
                // height: pixels or percent
                // width: pixels or percent
            }
        },
        legend: {
            enabled: true
        },
        series: [{
            name: 'Unique users',
            data: [
                {
                    name: 'Website visits',
                    y: 15654,
                    visible: false
                }, {
                    name: 'Downloads',
                    y: 4064
                },
                ['Requested price list', 1987],
                ['Invoice sent', 976],
                ['Finalized', 846]
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.attr('visibility'),
        'hidden',
        'No graphic for invisible point'
    );
});

QUnit.test('Top path of funnel intact', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'funnel'
        },
        plotOptions: {
            series: {
                reversed: true
            }
        },
        series: [{
            name: 'Unique users',
            data: [
                ['Website visits', 323],
                ['Downloads', 1343],
                ['Requested price list', 2287],
                ['Invoice sent', 2784]
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].points[3].graphic.element.getAttribute('d').split(' ')
            .filter(function (s) {
                return s !== 'L'; // Because Edge adds an L for each segment
            }).length,
        14,
        'The path should have the neck intact (#8277)'
    );
});

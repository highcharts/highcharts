QUnit.test('Drilling with keys', function (assert) {

    // Create the chart
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        xAxis: {
            type: 'category'
        },

        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        series: [{
            name: '2010',
            data: [
                ['Republican', 5, 'republican-2010'],
                ['Democrats', 2, 'democrats-2010'],
                ['Other', 4, 'other-2010']
            ],
            keys: ['name', 'y', 'drilldown']

        }, {
            name: '2014',
            data: [
                [
                    'Republican',
                    4,
                    'republican-2014'
                ],
                [
                    'Democrats',
                    4,
                    'democrats-2014'
                ],
                [
                    'Other',
                    4,
                    'other-2014'
                ]
            ],
            keys: ['name', 'y', 'drilldown']
        }],
        drilldown: {
            allowPointDrilldown: false,
            series: [{
                id: 'republican-2010',
                name: 'Republican 2010',
                data: [
                    ['East', 4],
                    ['West', 2],
                    ['North', 1],
                    ['South', 4]
                ]
            }, {
                id: 'democrats-2010',
                name: 'Republican 2010',
                data: [
                    ['East', 6],
                    ['West', 2],
                    ['North', 2],
                    ['South', 4]
                ]
            }, {
                id: 'other-2010',
                name: 'Other 2010',
                data: [
                    ['East', 2],
                    ['West', 7],
                    ['North', 3],
                    ['South', 2]
                ]
            }, {
                id: 'republican-2014',
                name: 'Republican 2014',
                data: [
                    ['East', 2],
                    ['West', 4],
                    ['North', 1],
                    ['South', 7]
                ]
            }, {
                id: 'democrats-2014',
                name: 'Democrats 2014',
                data: [
                    ['East', 4],
                    ['West', 2],
                    ['North', 5],
                    ['South', 3]
                ]
            }, {
                id: 'other-2014',
                name: 'Other 2014',
                data: [
                    ['East', 7],
                    ['West', 8],
                    ['North', 2],
                    ['South', 2]
                ]
            }]
        }
    });


    chart.xAxis[0].drilldownCategory(0);

    assert.deepEqual(
        chart.xAxis[0].names, ['East', 'West', 'North', 'South'],
        'allowPointDrilldown = false, drilling should work with keys (#8008)'
    );
    assert.strictEqual(
        chart.series.length,
        2,
        'Both series should be drilled'
    );


});

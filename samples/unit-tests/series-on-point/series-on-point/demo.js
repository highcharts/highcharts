QUnit.test('Series on point', function (assert) {
    const chart = Highcharts.mapChart('container', {
        plotOptions: {
            pie: {
                minSize: 15,
                maxSize: '30%',
                dataLabels: {
                    enabled: false
                }
            },
            sunburst: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        series: [{
            mapData: Highcharts.maps['custom/europe'],
            data: [{
                'hc-key': 'es',
                value: 40,
                id: 'es'
            }, {
                'hc-key': 'no',
                value: 4,
                id: 'no'
            }, {
                'hc-key': 'pl',
                value: 5,
                id: 'pl'
            }]
        }, {
            type: 'pie',
            onPoint: {
                id: 'es',
                z: 3,
                position: {
                    offsetX: 50,
                    offsetY: 1
                },
                connectorOptions: {
                    width: 2,
                    color: 'black',
                    dashStyle: 'shortDash'
                }
            },
            data: [1, 2, 3, 4]
        }, {
            type: 'pie',
            onPoint: {
                id: 'no',
                z: 50
            },
            data: [1, 2, 3, 4]
        }, {
            type: 'sunburst',
            onPoint: {
                id: 'pl',
                z: 150
            },
            data: [{
                name: 'Lower Silesia',
                value: 3
            }, {
                name: 'Masovia',
                value: 6
            }, {
                name: 'Subcarpathia',
                value: 5
            }, {
                name: 'Lesser Poland',
                value: 7
            }],
            dataLabels: {
                format: '{point.name}'
            }
        }]
    });

    assert.strictEqual(
        chart.series[1].options.onPoint.z,
        3,
        'The value of z should be 3.'
    );

    assert.strictEqual(
        chart.series[1].options.onPoint.position.offsetX,
        50,
        'The value of offsetX should be 50.'
    );

    assert.strictEqual(
        chart.series[1].options.onPoint.connectorOptions.width,
        2,
        'The value of connector width should be 3.'
    );

    assert.strictEqual(
        chart.series[1].options.onPoint.position.offsetX,
        50,
        'The value of offsetX should be 50.'
    );

    assert.strictEqual(
        chart.series[1].options.type,
        'pie',
        'The chart type should be pie.'
    );

    assert.strictEqual(
        chart.series[3].options.type,
        'sunburst',
        'The chart type should be sunburst.'
    );
});

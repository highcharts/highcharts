
QUnit.test('Drilldown across types', function (assert) {

    var chart = Highcharts
        .chart('container', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Drilldown from column to pie'
            },
            xAxis: {
                type: 'category',
                showEmpty: false
            },
            yAxis: {
                showEmpty: false
            },

            legend: {
                enabled: false
            },

            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true
                    }
                }
            },

            series: [{
                name: 'Things',
                colorByPoint: true,
                data: [{
                    name: 'Animals',
                    y: 5,
                    drilldown: 'animals'
                }, {
                    name: 'Fruits',
                    y: 2,
                    drilldown: 'fruits'
                }, {
                    name: 'Cars',
                    y: 4,
                    drilldown: 'cars'
                }],
                type: 'column'
            }],
            drilldown: {
                series: [{
                    id: 'animals',
                    data: [
                        ['Cats', 4],
                        ['Dogs', 2],
                        ['Cows', 1],
                        ['Sheep', 2],
                        ['Pigs', 1]
                    ]
                }, {
                    id: 'fruits',
                    data: [
                        ['Apples', 4],
                        ['Oranges', 2]
                    ]
                }, {
                    id: 'cars',
                    data: [
                        ['Toyota', 4],
                        ['Opel', 2],
                        ['Volkswagen', 2]
                    ]
                }]
            }
        });

    chart.options.drilldown.animation = false;

    assert.equal(
        chart.series.length,
        1,
        'Chart created'
    );

    chart.series[0].points[0].doDrilldown();

    assert.equal(
        chart.series[0].name,
        'Series 2',
        'Second level name'
    );

    assert.equal(
        chart.series[0].type,
        'pie',
        'Second level type'
    );

    // Check that the point actually draws an arc
    assert.equal(
        typeof chart.series[0].points[0].graphic.element.getAttribute('d').indexOf('A'),
        'number',
        'Point is arc'
    );

    assert.notEqual(
        chart.series[0].points[0].graphic.element.getAttribute('d').indexOf('A'),
        -1,
        'Point is arc'
    );

    chart.drillUp();

    assert.equal(
        chart.series[0].name,
        'Things',
        'First level name'
    );

    assert.equal(
        chart.series[0].type,
        'column',
        'First level type'
    );

});
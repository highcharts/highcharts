QUnit.test('Multiple legends with responsive rules.', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: [{
                        id: 'legend1',
                        title: {
                            text: 'Legend 1'
                        }
                    }, {
                        id: 'legend2',
                        title: {
                            text: 'Title updated'
                        }
                    }]
                }
            }]
        },
        series: [{
            data: [1, 2],
            legend: 'legend1'
        }, {
            data: [222, 111],
            legend: 'legend2'
        }],
        legend: [{
            id: 'legend1',
            title: {
                text: 'Legend 1'
            },
            align: 'left',
            verticalAlign: 'middle'
        }, {
            id: 'legend2',
            title: {
                text: 'Legend 2'
            }
        }]
    });

    chart.setSize(400);

    assert.ok(
        chart.legend[1].title.element.innerHTML.indexOf('Title updated') > -1,
        'Title automatically updated.'
    );

    chart.setSize(600);
    assert.ok(
        chart.legend[1].title.element.innerHTML.indexOf('Legend 2') > -1,
        'Title automatically restored.'
    );
});
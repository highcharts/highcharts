QUnit.test('RTL characters on data labels', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        series: [{
            data: [{
                name: 'عربي',
                y: 10
            }, {
                name: 'עברית',
                y: 10
            }, {
                name: '中文',
                y: 10
            }, {
                name: 'Edge',
                y: 10
            }]
        }]
    });

    assert.notOk(
        ~[].indexOf.apply(
            chart.series[0].data[0].dataLabel.text.element.children[0].classList,
            ['highcharts-text-outline']
        ),
        'The data label which arabic characters is not covered with outline'
    );
    assert.notOk(
        ~[].indexOf.apply(
            chart.series[0].data[1].dataLabel.text.element.children[0].classList,
            ['highcharts-text-outline']
        ),
        'The data label which hebrew characters is not covered with outline'
    );

    assert.ok(
        ~[].indexOf.apply(
            chart.series[0].data[2].dataLabel.text.element.children[0].classList,
            ['highcharts-text-outline']
        ),
        'The data label which japan characters is not covered with outline'
    );
    assert.ok(
        ~[].indexOf.apply(
            chart.series[0].data[3].dataLabel.text.element.children[0].classList,
            ['highcharts-text-outline']
        ),
        'The data label which latin characters is not covered with outline'
    );

});

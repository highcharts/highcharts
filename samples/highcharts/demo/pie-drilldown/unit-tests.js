QUnit.test('Pie drilldown', function (assert) {
    var chart = Highcharts.charts[0];

    var done = assert.async();

    chart.options.drilldown.animation = {
        duration: 50
    };

    assert.equal(
        chart.series.length,
        1,
        'Chart created'
    );

    chart.series[0].points[0].doDrilldown();


    setTimeout(function () {

        assert.equal(
            chart.series[0].name,
            'IE',
            'Second level name'
        );

        assert.strictEqual(
            Highcharts.color(
                chart.series[0].points[3].graphic.element.getAttribute('fill')
            ).get(),
            Highcharts.color(Highcharts.getOptions().colors[3]).get(),
            'Point color animated'
        );

        chart.drillUp();
        assert.equal(
            chart.series[0].name,
            'Brands',
            'First level name'
        );

        done();
    }, 100);

});
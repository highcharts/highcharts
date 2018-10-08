

QUnit.test('Mutually linked (#3341)', function (assert) {

    // #3341 caused exceeded stack size
    assert.expect(0);
    var chart = Highcharts.chart('container', {

        series: [{
            data: [1, 3, 2, 4],
            type: 'column',
            id: 'A',
            linkedTo: 'B'
        }, {
            data: [1, 4, 3, 5],
            type: 'line',
            id: 'B',
            linkedTo: 'A'
        }]

    });

    chart.get('A').hide();
});

// Highcharts 4.0.1, Issue #3028
// linkedTo after series.update() fails
QUnit.test('Linked series update (#3028)', function (assert) {

    TestTemplate.test('highcharts/line', {

        series: [{
            data: [0.6820803502018753, 0.05533494462052113],
            id: "a"
        }, {
            data: [0.07601782967260373, 0.1726532410217495],
            id: "b"
        }, {
            data: [0.9013182093899192, 0.3390551892767565],
            id: "c"
        }, {
            data: [0.551932400756212, 0.009206774065841805],
            linkedTo: "a"
        }, {
            data: [0.7640630116461821, 0.0380141771800222],
            linkedTo: "b"
        }, {
            data: [0.18496775541137755, 0.04887790962917371],
            linkedTo: "c"
        }, {
            data: [0.8241777419092826, 0.4921648208451488],
            linkedTo: "a"
        }, {
            data: [0.6752480091977303, 0.575652597336077],
            linkedTo: "b"
        }, {
            data: [0.7703115567784166, 0.18277585315778122],
            linkedTo: "c"
        }]

    }, function (template) {

        var chart = template.chart,
            series = chart.series,
            i, ie;

        for (i = 0, ie = series.length; i < ie; ++i) {
            series[i].update({
                dataLabels: {
                    enabled: true
                }
            });
        }

        series[0].hide();
        series[1].hide();
        series[2].hide();

        for (i = 0, ie = series.length; i < ie; ++i) {
            assert.ok(
                !series[i].visible,
                'Series should not be visible.'
            );
        }

    });

});

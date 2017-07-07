QUnit.test('#6930 - scrollbar had wrong extremes when data was not set.', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            xAxis: {
              scrollbar: {
                enabled: true
              }, 
              min: 1497132000000,
              max: 1497218399000,
              type: "datetime"
            },
            series: [{
                data: []
            }]
        }),
        scrollbar = chart.xAxis[0].scrollbar;

    assert.strictEqual(
        scrollbar.from == 0,
        true,
        'Scrollbar starts from left button.'
    );
    assert.strictEqual(
        scrollbar.to == 1,
        true,
        'Scrollbar ends at right edge.'
    );

});

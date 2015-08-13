$(function () {
    QUnit.test('Step=1 should preserve ticks', function (assert) {
        var data = [107, 31, 635, 203, 2,107, 31, 635, 203, 2,107, 31, 635, 203, 2,107, 31, 635, 203, 2,107, 31, 635, 203, 2,107, 31, 635, 203, 2];
        var chart = $('#container').highcharts({
            chart: {
                type: 'bar'
            },
            xAxis: {
                labels:{
                    step: 1
                },
                categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania','Africa', 'America', 'Asia', 'Europe', 'Oceania','Africa', 'America', 'Asia', 'Europe', 'Oceania','Africa', 'America', 'Asia', 'Europe', 'Oceania','Africa', 'America', 'Asia', 'Europe', 'Oceania','Africa', 'America', 'Asia', 'Europe', 'Oceania']
            },
            series: [{
                name: 'Year 1800',
                data: data
            }]
        }).highcharts();


        assert.strictEqual(
            chart.xAxis[0].tickPositions.length,
            data.length,
            'Tick amount'
        );

    });
});
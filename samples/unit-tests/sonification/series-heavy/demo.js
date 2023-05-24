QUnit.test('Lots of series', function (assert) {
    Highcharts.sonification.Sonification.prototype.forceReady = true;

    var chart = Highcharts.chart('container', {
        sonification: {
            duration: 3000,
            afterSeriesWait: 300,
            pointGrouping: {
                enabled: false
            }
        },
        series: (function () {
            var s = [];
            for (var i = 0; i < 15; ++i) {
                s.push({
                    data: [i, i + 1, i + 2]
                });
            }
            return s;
        }())
    });

    assert.strictEqual(
        chart.sonification.timeline.channels
            .map(c => c.events[0].time + ',' + c.events[c.events.length - 1].time)
            .join('#'),
        '0,50#350,400#700,750#1050,1100#1400,1450#1750,1800#2100,2150#2450,2500#' +
        '2800,2850#3150,3200#3500,3550#3850,3900#4200,4250#4550,4600#4900,4950',
        'Series wait and minimum series time should override total duration'
    );

    delete Highcharts.sonification.Sonification.prototype.forceReady;
});

jQuery(function () {
    QUnit.test('Hide label with useHTML', function (assert) {

        Highcharts.setOptions({
            global: {
                useUTC: true,

                getTimezoneOffset: function (timestamp) {
                    var zone = 'Europe/Lisbon';
                    var date = moment.tz(timestamp, zone);

                    return -date.utcOffset();
                }
            }
        });
        var chart = Highcharts.chart('container', {
            xAxis: {
                type: 'datetime',
                labels: {
                    format: '{value:%Y-%m-%d %H:%M}',
                    rotation: 90
                }
            },
            tooltip: {
                shared: true,
                crosshairs: {
                    width: 1,
                    color: 'rgb(40, 52, 61)',
                    dashStyle: 'ShortDash'
                }
            },
            series: [{
                data: [{
                    x: 1445641200000,
                    y: 1
                }, {
                    x: 1445727600000,
                    y: 1
                }, {
                    x: 1445817600000,
                    y: 1
                }, {
                    x: 1445904000000,
                    y: 1
                }],
                dataLabels: {
                    enabled: true,
                    format: '{x:%H:%M}'
                },
                name: 'UTC Midnight',
                tooltip: {
                    pointFormat: 'UTC midnight = {point.x:%H:%M} local time'
                }
            }]
        });

        chart.xAxis[0].tickPositions.forEach(function (pos) {
            var tick = chart.xAxis[0].ticks[pos];
            assert.strictEqual(
                tick.label.element.textContent.substr(11, 5),
                '00:00',
                'Tick is on timezone midnight'
            );
        });

    });
});
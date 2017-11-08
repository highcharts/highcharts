QUnit.test('NaN in label position (#7175)', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },
        xAxis: {
            plotBands: [{ // mark the weekend
                color: '#FCFFC5',
                from: Date.UTC(2010, 0, 2),
                to: Date.UTC(2010, 0, 4),
                label: {
                    text: 'Plot band'
                }
            }],
            tickInterval: 24 * 3600 * 1000, // one day
            type: 'datetime'
        },

        series: [{
            data: [29.9, 71.5, 56.4, 69.2, 144.0, 176.0, 135.6, 148.5, 216.4],
            pointStart: Date.UTC(2010, 0, 1),
            pointInterval: 24 * 3600 * 1000
        }]
    });


    assert.notEqual(
        chart.container.innerHTML.indexOf('Plot band'),
        -1,
        'Label added successfully'
    );
    assert.strictEqual(
        chart.container.innerHTML.indexOf('NaN'),
        -1,
        'No NaN'
    );

    chart.series[0].hide();

    assert.strictEqual(
        chart.container.innerHTML.indexOf('NaN'),
        -1,
        'No NaN'
    );


});

QUnit.test('Events should be bound to all plotBands (#6166).', function (assert) {
    var clicked,
        chart = Highcharts.stockChart('container', {
            xAxis: {
                min: 20,
                max: 50,
                plotBands: [{
                    color: '#FCFFC5',
                    from: 0,
                    to: 11,
                    id: 'plotband-1',
                    events: {
                        click: function () {
                            clicked = 'clicked';
                        }
                    }
                }]
            },
            series: [{
                data: [
                    [1, 20],
                    [11, 20],
                    [21, 25],
                    [41, 28]
                ]
            }]
        });

    chart.xAxis[0].setExtremes(0, 10);

    var controller = new TestController(chart);
    controller.click(100, 100);

    assert.deepEqual(
        clicked,
        'clicked',
        'Click event fired'
    );
});
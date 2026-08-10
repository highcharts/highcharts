QUnit.test('Axis events', function (assert) {
    const calls = {
        afterSetExtremesClass: 0,
        afterSetExtremesInstance: 0,
        afterSetExtremesOptions: 0,
        afterSetExtremesOptionsUpdated: 0,
        setExtremesOptions: 0
    };

    const unbindClass = Highcharts.addEvent(
        Highcharts.Axis,
        'afterSetExtremes',
        function () {
            if (this.coll === 'xAxis') {
                calls.afterSetExtremesClass++;
            }
        }
    );

    const chart = Highcharts.chart('container', {
        chart: {
            animation: false
        },
        xAxis: {
            events: {
                afterSetExtremes: function () {
                    calls.afterSetExtremesOptions++;
                },
                setExtremes: function () {
                    calls.setExtremesOptions++;
                }
            }
        },
        series: [
            {
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0],
                animation: false
            }
        ]
    });
    Highcharts.addEvent(
        chart.xAxis[0],
        'afterSetExtremes',
        function () {
            calls.afterSetExtremesInstance++;
        }
    );

    // Events got lost after Axis.update (#5773)
    assert.deepEqual(
        [calls.afterSetExtremesOptions, calls.setExtremesOptions],
        [0, 0],
        'No events should be fired initially'
    );

    chart.xAxis[0].setExtremes(2, 8);
    assert.deepEqual(
        [calls.afterSetExtremesOptions, calls.setExtremesOptions],
        [1, 1],
        'Each event should be fired on set extremes'
    );

    chart.xAxis[0].update({
        minRange: 1
    });

    chart.xAxis[0].setExtremes(3, 7);
    assert.deepEqual(
        [calls.afterSetExtremesOptions, calls.setExtremesOptions],
        [2, 2],
        'Each event should be fired again on set extremes after update'
    );


    // Events should be replaced when doing Axis.update (#6943)
    chart.xAxis[0].update({
        events: {
            afterSetExtremes: function () {
                calls.afterSetExtremesOptionsUpdated++;
            }
        }
    });
    chart.xAxis[0].setExtremes(2, 7);
    assert.deepEqual(
        [calls.afterSetExtremesOptions, calls.afterSetExtremesOptionsUpdated],
        [2, 1],
        'Old options-set handler should be removed, new activated (#6943)'
    );

    assert.deepEqual(
        [calls.afterSetExtremesClass, calls.afterSetExtremesInstance],
        [3, 3],
        'Events set on the class and instance should be unaffected by options'
    );

    unbindClass();

    chart.xAxis[0].update({
        events: {
            afterSetExtremes: void 0
        }
    });
    chart.xAxis[0].setExtremes(3, 7);
    assert.deepEqual(
        [calls.afterSetExtremesOptions, calls.afterSetExtremesOptionsUpdated],
        [2, 1],
        'Event handler should be removed after updating to undefined (#15983)'
    );
});

QUnit.test(
    'afterSetExtremes should not fire on axes whose extremes have ' +
        'not changed (#22780)',
    function (assert) {
        const calls = {
            x: 0,
            y: 0
        };

        const chart = Highcharts.chart('container', {
            chart: {
                animation: false
            },
            xAxis: {
                events: {
                    afterSetExtremes: function () {
                        calls.x++;
                    }
                }
            },
            yAxis: {
                events: {
                    afterSetExtremes: function () {
                        calls.y++;
                    }
                }
            },
            series: [
                {
                    data: [1, 2, 3, 4, 5],
                    animation: false
                }
            ]
        });

        assert.deepEqual(
            [calls.x, calls.y],
            [0, 0],
            'No events should be fired on initial render'
        );

        chart.redraw();
        assert.deepEqual(
            [calls.x, calls.y],
            [0, 0],
            'No events should be fired on a redraw where extremes do not change'
        );

        chart.xAxis[0].setExtremes(1, 4);
        assert.deepEqual(
            [calls.x, calls.y],
            [1, 0],
            'Only the x axis should fire when its own extremes change'
        );

        chart.xAxis[0].setExtremes(2, 3);
        assert.deepEqual(
            [calls.x, calls.y],
            [1, 0],
            'The y axis should stay silent when only x extremes change'
        );

        chart.xAxis[0].setExtremes(2, 3);
        assert.deepEqual(
            [calls.x, calls.y],
            [1, 0],
            'No event should be fired when extremes are set to the same values'
        );

        chart.yAxis[0].setExtremes(0, 5);
        assert.deepEqual(
            [calls.x, calls.y],
            [1, 1],
            'The y axis should fire when its own extremes change'
        );
    });

QUnit.test(
    'afterSetExtremes should not fire on an added axis (#22780)',
    function (assert) {
        const calls = {
            added: 0
        };

        const chart = Highcharts.chart('container', {
            chart: {
                animation: false
            },
            series: [
                {
                    data: [1, 2, 3, 4, 5],
                    animation: false
                }
            ]
        });

        chart.addAxis({
            title: {
                text: 'extra'
            },
            events: {
                afterSetExtremes: function () {
                    calls.added++;
                }
            }
        }, true, false);

        chart.redraw();
        assert.deepEqual(
            [calls.added],
            [0],
            'No events should be fired on the first redraw of an added axis'
        );

        chart.xAxis[1].setExtremes(0, 10);
        assert.deepEqual(
            [calls.added],
            [1],
            'The added axis should fire when its own extremes change'
        );
    });

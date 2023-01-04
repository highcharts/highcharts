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

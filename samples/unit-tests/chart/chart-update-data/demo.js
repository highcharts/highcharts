
QUnit.test('Soft series update by data module update', function (assert) {

    var csv1 = 'Name,Initial name\nApples,1\nPears,2\nBananas,3';
    var csv2 = 'Name,Updated name\nApples,3\nPears,2\nBananas,1';


    var chart = Highcharts.chart('container', {
        chart: {
            animation: false,
            type: 'pie'
        },
        data: {
            csv: csv1
        }
    });

    var s = chart.series[0];

    assert.strictEqual(
        s.name,
        'Initial name',
        'Initial name should be set'
    );


    s.points.forEach(function (p) {
        p.wasThereInitially = true;
    });

    chart.update({
        data: {
            csv: csv2
        }
    });

    assert.strictEqual(
        s.name,
        'Updated name',
        'Name should be updated'
    );

    assert.deepEqual(
        s.points.map(function (p) {
            return p.wasThereInitially;
        }),
        [true, true, true],
        'Exisition points should be updated (soft update)'
    );

});


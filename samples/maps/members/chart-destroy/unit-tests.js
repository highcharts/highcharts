QUnit.test('Destroy map', function (assert) {

    var done = assert.async();


    var timer = setInterval(function () {

        var chart = Highcharts.charts[0];

        if (chart) {
            assert.notEqual(
                document.getElementById('container').innerHTML.indexOf('<svg'),
                -1,
                'SVG in container'
            );


            chart.destroy();
            console.log(document.getElementById('container').innerHTML);
            assert.ok(
                document.getElementById('container').innerHTML.match(/[\s]?$/g),
                'No markup in container'
            );

            assert.strictEqual(
                Highcharts.charts[0],
                undefined,
                'Chart removed'
            );

            done();
            clearTimeout(timer);
        }
    }, 50);
});

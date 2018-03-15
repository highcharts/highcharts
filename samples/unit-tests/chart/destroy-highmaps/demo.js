
QUnit.test('Destroy map', function (assert) {

    var done = assert.async();

    $.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.4/samples/data/world-population-density.json', function (data) {

        // Initiate the chart
        var chart = Highcharts.mapChart('container', {

            title: {
                text: 'Destroy chart from button'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic'
            },

            series: [{
                data: data,
                mapData: Highcharts.maps['custom/world'],
                joinBy: ['iso-a2', 'code'],
                name: 'Population density',
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });

        assert.notEqual(
            document.getElementById('container').innerHTML.indexOf('<svg'),
            -1,
            'SVG in container'
        );

        chart.destroy();

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

    });

});

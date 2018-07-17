
QUnit.test('Destroy map', function (assert) {

    // Test data
    var data = [
        {
            "code": "AF",
            "value": 53,
            "name": "Afghanistan"
        },
        {
            "code": "AL",
            "value": 117,
            "name": "Albania"
        },
        {
            "code": "DZ",
            "value": 15,
            "name": "Algeria"
        },
        {
            "code": "AS",
            "value": 342,
            "name": "American Samoa"
        },
        {
            "code": "AD",
            "value": 181,
            "name": "Andorra"
        },
        {
            "code": "AO",
            "value": 15,
            "name": "Angola"
        },
        {
            "code": "AI",
            "value": 202,
            "name": "Antigua and Barbuda"
        },
        {
            "code": "AR",
            "value": 15,
            "name": "Argentina"
        },
        {
            "code": "AM",
            "value": 109,
            "name": "Armenia"
        },
        {
            "code": "AW",
            "value": 597,
            "name": "Aruba"
        }
    ];

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

    var chartIndex = (Highcharts.charts.length - 1);

    chart.destroy();

    assert.ok(
        document.getElementById('container').innerHTML.match(/[\s]?$/g),
        'No markup in container'
    );

    assert.strictEqual(
        chart.renderer,
        undefined,
        'Chart renderer should be removed'
    );

    assert.strictEqual(
        Highcharts.charts[chartIndex],
        undefined,
        'Chart should be removed'
    );

});

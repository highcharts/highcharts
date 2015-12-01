QUnit.test('Max point width', function (assert) {

    var chart,
        point;

    chart = $('#container').highcharts();
    point = chart.series[0].points[0];

    assert.strictEqual(
        parseInt(point.graphic.attr('width'), 10) <= 50,
        true,
        'Column width less than 50'
    );

    // Now try a bar chart
    $('#container').highcharts({

        chart: {
            type: 'bar'
        },

        title: {
            text: 'Max point width in Highcharts'
        },

        xAxis: {
            categories: ['One', 'Two', 'Three']
        },

        series: [{
            data: [1, 2, 3],
            maxPointWidth: 50
        }]

    });
    chart = $('#container').highcharts();
    point = chart.series[0].points[0];

    // The bar chart plot area is rotated 90 degrees, so we check the width even though it
    // is the bar height we are testing.
    assert.strictEqual(
        parseInt(point.graphic.attr('width'), 10) <= 50,
        true,
        'Bar width (flipped) less than 50'
    );




});
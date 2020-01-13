QUnit.test('Zoom in - zoomout with padding, panning in both directions.', function (assert) {

    var chart = Highcharts.mapChart('container', {

        chart: {
            plotBorderWidth: 1
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: 'spacingBox',
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic',
            minColor: '#e6e696',
            maxColor: '#003700'
        },

        // Add some padding inside the plot box
        xAxis: {
            minPadding: 0.2,
            maxPadding: 0.2
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2
        },

        // The map series
        series: [{
            data: [{
                value: 1,
                path: 'M,0,0,L,100,0,L,100,100,L,0,100,z'
            }, {
                value: 2,
                path: 'M,200,200,L,300,200,L,300,300,L,200,300,z'
            }]
        }]
    });

    var xExtremes = chart.xAxis[0].getExtremes(),
        yExtremes,
        controller = new TestController(chart);


    chart.mapZoom(0.5);

    assert.notEqual(
        chart.xAxis[0].getExtremes().min,
        xExtremes.min,
        'Zoomed in'
    );

    chart.mapZoom(2);
    assert.strictEqual(
        chart.xAxis[0].getExtremes().min,
        xExtremes.min,
        'Zoomed out including padding'
    );

    chart.mapZoom(0.2);

    xExtremes = chart.xAxis[0].getExtremes();
    yExtremes = chart.yAxis[0].getExtremes();

    controller.pan(
        [chart.plotLeft + 50, chart.plotTop + 50],
        [chart.plotLeft + 100, chart.plotTop + 100]
    );

    assert.notEqual(
        chart.xAxis[0].getExtremes().min,
        xExtremes.min,
        'Correctly panned in horizontal direction'
    );

    assert.notEqual(
        chart.yAxis[0].getExtremes().min,
        yExtremes.min,
        'Correctly panned in vertical direction'
    );

});

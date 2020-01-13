QUnit.test('Zoom in - zoomout with padding', function (assert) {

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
            }]
        }]
    });

    var xExtremes = chart.xAxis[0].getExtremes();

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

});

QUnit.test('Map navigation button alignment', assert => {
    const chart = Highcharts.mapChart('container', {

        chart: {
            plotBorderWidth: 1,
            width: 600
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        series: [{
            data: [{
                path: 'M 0 0 L 100 0 L 0 100',
                value: 1
            }, {
                path: 'M 100 0 L 100 100 L 0 100',
                value: 2
            }]
        }]
    });

    assert.close(
        chart.mapNavButtons[1].translateY + chart.mapNavButtons[1].getBBox().height,
        chart.plotTop + chart.plotHeight,
        1.5,
        'The buttons should initially be bottom-aligned to the plot box (#12776)'
    );

    chart.setSize(undefined, 380);

    assert.close(
        chart.mapNavButtons[1].translateY + chart.mapNavButtons[1].getBBox().height,
        chart.plotTop + chart.plotHeight,
        1.5,
        'The buttons should be bottom-aligned to the plot box after redraw (#12776)'
    );

});

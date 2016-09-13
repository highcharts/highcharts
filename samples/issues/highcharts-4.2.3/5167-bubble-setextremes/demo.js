jQuery(function () {

    QUnit.test('Setting X axis extremes on bubble', function (assert) {

        var chart = Highcharts.chart('container', {

            chart: {
                type: 'bubble',
                animation: false
            },



            yAxis: {
                startOnTick: false,
                endOnTick: false,
                maxPadding: 0.2
            },

            series: [{
                data: [
                    { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' },
                    { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
                    { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
                    { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
                    { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
                    { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
                    { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
                    { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
                    { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
                    { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
                    { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
                    { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
                    { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
                    { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' }
                ]
            }]

        });

        chart.xAxis[0].setExtremes(85, 90);
        assert.ok(
            chart.yAxis[0].min < 102.9,
            'DE point is within range'
        );
        assert.ok(
            chart.yAxis[0].max > 102.9,
            'DE point is within range'
        );

    });
});
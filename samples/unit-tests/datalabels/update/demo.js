QUnit.test(
    'Update dataLabels\' options',
    assert => {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                data: [1000, 950]
            }]
        });

        [-90, 0, -90].forEach(rotation => {
            chart.series[0].update({
                dataLabels: {
                    rotation
                }
            });

            const point = chart.series[0].points[0],
                labelBox = point.dataLabel.element.getBoundingClientRect(),
                columnBox = point.graphic.element.getBoundingClientRect();

            assert.close(
                labelBox.x + labelBox.width / 2,
                columnBox.x + columnBox.width / 2,
                // Trying to dodge the browsers differences,
                // previous misplacements were between 7-20 pixels
                3,
                `Correct position after updating rotation to ${rotation}
                (#14175).`
            );
        });
    }
);
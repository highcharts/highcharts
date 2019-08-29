QUnit.test(
    "Multiple data labels general tests.",
    function (assert) {
        var defined = Highcharts.defined,
            chart = Highcharts.chart('container', {
                xAxis: {
                    type: 'datetime'
                },
                series: [{
                    type: 'xrange',
                    name: 'Project 1',
                    dataLabels: [{
                        enabled: true,
                        format: 'Left label',
                        align: 'left'
                    }, {
                        enabled: true,
                        format: 'Right label',
                        align: 'right'
                    }],
                    data: [{
                        name: 'Start prototype',
                        x: Date.UTC(2014, 10, 18),
                        x2: Date.UTC(2014, 10, 25),
                        y: 1
                    }, {
                        name: 'Test prototype',
                        x: Date.UTC(2014, 10, 27),
                        x2: Date.UTC(2014, 10, 29),
                        y: 2
                    }, {
                        name: 'Develop',
                        x: Date.UTC(2014, 10, 20),
                        x2: Date.UTC(2014, 10, 25),
                        y: 3
                    }, {
                        name: 'Run acceptance tests',
                        x: Date.UTC(2014, 10, 23),
                        x2: Date.UTC(2014, 10, 26),
                        y: 4
                    }]
                }]
            });

        var controller = new TestController(chart),
            point = chart.series[0].points[0],
            correct = true;

        point.dataLabels.forEach(function (dataLabel, i) {
            if (i === 0) {
                controller.touchStart(0, 0);
            }
            controller.moveTo(
                chart.plotLeft + dataLabel.x + dataLabel.width / 2,
                chart.plotTop + dataLabel.y + dataLabel.height / 2
            );

            if (chart.hoverPoint !== point) {
                correct = false;
            }
        });

        assert.strictEqual(
            correct,
            true,
            "Appropriate tooltip appears when hovering both point's data labels."
        );

        assert.strictEqual(
            defined(point.dataLabels[0].element.point) &&
            defined(point.dataLabels[1].element.point),
            true,
            "Both data labels have point reference within element."
        );
    }
);

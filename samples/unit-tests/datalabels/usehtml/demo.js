QUnit.test(
    '#7287: Correct class for the last dataLable when useHTML',
    function (assert) {
        var chart = Highcharts.chart('container', {
                series: [{
                    type: "bar",
                    data: [3, 2, 1],
                    dataLabels: {
                        enabled: true,
                        useHTML: true
                    }
                }]
            }),
            point = chart.series[0].points[2];

        assert.strictEqual(
            /highcharts-data-labels/
                .test(point.dataLabel.element.getAttribute('class')),
            false,
            'Single dataLabel doesn\'t have "highcharts-data-labels" class.'
        );
    }
);

QUnit.test(
    '#6794: "cursor: pointer" works when useHTML is enabled.',
    function (assert) {
        var chart = Highcharts.chart('container', {
                series: [{
                    type: 'bar',
                    data: [1],
                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        style: {
                            cursor: 'pointer'
                        }
                    }
                }]
            }),
            point = chart.series[0].points[0];

        assert.strictEqual(
            point.dataLabel.div.children[0].style.cursor,
            'pointer',
            "Data label's 'cursor' attribute equals to 'pointer'"
        );
    }
);

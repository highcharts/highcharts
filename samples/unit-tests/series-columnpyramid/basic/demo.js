QUnit.test('Column pyramid series', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            renderTo: 'container',
            type: 'columnpyramid'
        },
        series: [
            {
                data: [10, 20, 5]
            }
        ]
    });

    assert.ok(
        chart.series[0].points[1].graphic.d &&
            chart.series[0].points[1].graphic !== 'rect',
        'Shapes are paths - pyramids'
    );
});

QUnit.test('Column pyramid series - 0 dataLabel #12514', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'columnpyramid'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [
            {
                data: [
                    ['Pyramid of Khufu', 138.8],
                    ['Pyramid of Khafre', 0],
                    ['Red Pyramid', 104]
                ]
            }
        ]
    });
    var testedLabel = chart.series[0].points[1].dataLabel;

    assert.strictEqual(
        Number.isNaN(testedLabel.alignAttr.x),
        false,
        'Label alignAttr.x should be a number #12514'
    );

    assert.strictEqual(
        testedLabel.translateY !== -9999,
        true,
        'Label should be translated and had different position translate attributes than starting values #12514'
    );
});

QUnit.test(
    "Column pyramid series inverted - yAxis width #16150",
    function (assert) {
        const chart = Highcharts.chart("container", {
            chart: {
                type: "columnpyramid",
                inverted: true,
                width: 600,
                animation: false,
                height: 600
            },
            yAxis: {
                width: "40%"
            },

            series: [
                {
                    data: [5, 4, 2]
                }
            ]
        });

        var roundPath = function (dArray) {
            return dArray.map(item =>
                Highcharts.map(item, function (value) {
                    var number = Math.round(value);
                    return Highcharts.isNumber(number) ? number : value;
                })
            );
        };

        const validPath = [
            ["M", 370, 37],
            ["L", 370, 37],
            ["L", 335, 223],
            ["L", 406, 223],
            ["Z"]
        ];

        const testedPath = roundPath(chart.series[0].points[0].shapeArgs.d);
        assert.deepEqual(
            testedPath,
            validPath,
            "testedPath should be equal to validPath, #16150"
        );
    }
);
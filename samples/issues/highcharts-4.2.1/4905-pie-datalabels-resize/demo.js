
$(function () {
    QUnit.test('Pie data labels were not hidden on scaling down', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'pie',
                width: 520,
                height: 300,
                animation: false
            },
            plotOptions: {
                pie: {
                    animation: false,
                    size: '70%' // Removing size option will fix labels reflow issue
                }
            },
            series: [{
                data: [{
                    "y": 20541,
                    "name": "David Cameron"
                }, {
                    "y": 6462,
                    "name": "Barack Obama"
                }, {
                    "y": 3954,
                    "name": "Jeremy Corbyn"
                }, {
                    "y": 3826,
                    "name": "Donald Trump"
                }, {
                    "y": 3395,
                    "name": "David"
                }, {
                    "y": 3046,
                    "name": "David Price"
                }, {
                    "y": 2853,
                    "name": "Obama"
                }, {
                    "y": 2693,
                    "name": "David Warner"
                }, {
                    "y": 2626,
                    "name": "Hillary Clinton"
                }, {
                    "y": 2565,
                    "name": "Francois Hollande"
                }, {
                    "y": 2421,
                    "name": "David Beckham"
                }, {
                    "y": 2410,
                    "name": "Vladimir Putin"
                }, {
                    "y": 2007,
                    "name": "Angela Merkel"
                }, {
                    "y": 1879,
                    "name": "Malcolm Turnbull"
                }, {
                    "y": 1745,
                    "name": "Xi Jinping"
                }, {
                    "y": 1717,
                    "name": "Francis"
                }, {
                    "y": 1686,
                    "name": "David Wright"
                }, {
                    "y": 1502,
                    "name": "Andy Murray"
                }, {
                    "y": 1483,
                    "name": "Bernie Sanders"
                }, {
                    "y": 1476,
                    "name": "Usman Khawaja"
                }, {
                    "y": 1428,
                    "name": "Bashar al-Assad"
                }, {
                    "y": 1413,
                    "name": "Michael Cheika"
                }, {
                    "y": 1393,
                    "name": "Louis van Gaal"
                }, {
                    "y": 1375,
                    "name": "Jeb Bush"
                }, {
                    "y": 1338,
                    "name": "Tashfeen Malik"
                }, {
                    "y": 1068,
                    "name": "David Moyes"
                }, {
                    "y": 1000,
                    "name": "Michael"
                }, {
                    "y": 999,
                    "name": "Louis"
                }, {
                    "y": 998,
                    "name": "Jeb"
                }, {
                    "y": 996,
                    "name": "Tashfeen"
                }, {
                    "y": 995,
                    "name": "Alex"
                }],
                name: "Test"
            }]
        });

        function getVisibleLabelCount() {
            return chart.series[0].points.filter(function (point) {
                return point.dataLabel.attr('translateY') > -99;
            }).length;
        }

        var initialLabelCount = getVisibleLabelCount();

        assert.strictEqual(
            typeof initialLabelCount,
            'number',
            'Initial label count'
        );

        chart.setSize(900, 600);
        assert.ok(
            getVisibleLabelCount() > initialLabelCount,
            'More labels visible'
        );



        chart.setSize(520, 300);
        assert.strictEqual(
            getVisibleLabelCount(),
            initialLabelCount,
            'Back to start'
        );
    });
});
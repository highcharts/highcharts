$(function () {
    QUnit.test('Ellipsis', function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                height: 62,
                margin: 0,
                marginTop: 11,
                marginBottom: 10,
                renderTo: 'container',
                type: 'column',
                width: 220
            },

            credits: {
                enabled: false
            },
            title: {
                text: null
            },
            legend: {
                enabled: false
            },
            rangeSelector: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },

            xAxis: {
                categories: [],
                labels: {
                    autoRotation: false,
                    style: {
                        fontSize: '8px',
                        textOverflow: 'none'
                    },
                    y: 8
                }
            },

            yAxis: {
                gridLineWidth: 0,
                labels: {
                    enabled: false
                },
                min: 0,
                title: {
                    text: null
                },
                maxPadding: 0.04,
                endOnTick: false
            },

            series: [{
                name: 'Rainfall (mm)',
                data: [{
                    name: 'LongTextWithNoEllipsis',
                    y: 0.2
                }, {
                    name: 'Th',
                    y: 0.4
                }, {
                    name: 'Fr',
                    y: 0
                }, {
                    name: 'Sa',
                    y: 8.4
                }, {
                    name: 'LongTextWithNoEllipsis',
                    y: 0
                }, {
                    name: 'Mo',
                    y: 1.2
                }, {
                    name: 'Tu',
                    y: 0
                }, {
                    name: 'LongTextWithNoEllipsis',
                    y: 0
                }],
                groupPadding: 0,
                pointPadding: 0,
                borderWidth: 0,
                shadow: false
            }]
        }).highcharts();

        assert.strictEqual(
            chart.xAxis[0].ticks['0'].label.element.textContent,
            'LongTextWithNoEllipsis',
            'No ellipsis'
        );
        assert.strictEqual(
            chart.xAxis[0].ticks['4'].label.element.textContent,
            'LongTextWithNoEllipsis',
            'No ellipsis'
        );
        assert.strictEqual(
            chart.xAxis[0].ticks['7'].label.element.textContent,
            'LongTextWithNoEllipsis',
            'No ellipsis'
        );

    });

});
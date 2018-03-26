QUnit.test('Drill-up text', function (assert) {

    Highcharts.setOptions({
        lang: {
            drillUpText: '<< Terug naar {series.name}'
        }
    });

    var chart = Highcharts
        .chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Drilldown label styling'
            },
            xAxis: {
                type: 'category'
            },

            legend: {
                enabled: false
            },

            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true
                    }
                }
            },

            series: [{
                name: 'Things',
                colorByPoint: true,
                data: [{
                    name: 'Dieren',
                    y: 5,
                    drilldown: 'animals'
                }, {
                    name: 'Fruit',
                    y: 2,
                    drilldown: 'fruits'
                }, {
                    name: 'Auto\'s',
                    y: 4
                }]
            }],
            drilldown: {
                drillUpButton: {
                    relativeTo: 'spacingBox',
                    position: {
                        y: 0,
                        x: 0
                    },
                    theme: {
                        fill: 'white',
                        'stroke-width': 1,
                        stroke: 'silver',
                        r: 0,
                        states: {
                            hover: {
                                fill: '#a4edba'
                            },
                            select: {
                                stroke: '#039',
                                fill: '#a4edba'
                            }
                        }
                    }

                },
                series: [{
                    id: 'animals',
                    data: [
                        ['Katten', 4],
                        ['Honden', 2],
                        ['Koeien', 1],
                        ['Schapen', 2],
                        ['Varkens', 1]
                    ]
                }, {
                    id: 'fruits',
                    data: [
                        ['Appels', 4],
                        ['Sinaasappels', 2]
                    ]
                }]
            }
        });

    chart.options.drilldown.animation = false;

    assert.equal(
        chart.series.length,
        1,
        'Chart should have been created'
    );

    chart.series[0].points[0].doDrilldown();

    assert.equal(
        chart.drillUpButton.element.textContent,
        '<< Terug naar Things',
        'Button should have text'
    );
    assert.equal(
        chart.drillUpButton.element.firstChild.getAttribute('fill'),
        'white',
        'Button should have filled white'
    );

    assert.equal(
        chart.drillUpButton.element.firstChild.getAttribute('stroke'),
        'silver',
        'Button should have silver stroke'
    );

});

QUnit.test(
    'Legend item should have positive height (#6519)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            series: [
                {
                    data: [1, 3, 2, 4],
                    name: ' '
                },
                {
                    data: [2, 4, 3, 5],
                    name: ' '
                }
            ],
            legend: {
                layout: 'vertical'
            }
        });

        assert.notEqual(
            chart.legend.allItems[0].legendItem.y,
            chart.legend.allItems[1].legendItem.y,
            'Legend item has positive height'
        );

        const initialHeight = chart.legend.legendHeight;

        chart.series[0].update({
            name: 'Series'
        });

        const updatedHeight = chart.legend.legendHeight;

        assert.equal(
            initialHeight,
            updatedHeight,
            'Legend items should have same spacing regardless of empty name (#16398)'
        );
    }
);

QUnit.test('Use HTML and legend item resizing', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 800,
            height: 250
        },
        legend: {
            useHTML: true,
            itemStyle: {
                textOverflow: 'clip'
            }
        },
        series: [
            {
                name:
                    'AAAAAAAAAAAAAAAAAAAAAAAAAAAA long tiiiiiiiiiiiiiiiiiitle',
                data: [39]
            },
            {
                name:
                    'BBBBBBBBBBBBBBBBBBBBBBBBBBBB long tiiiiiiiiiiiiiiiiiitle',
                data: [12]
            }
        ]
    });

    var legendHeight = chart.legend.legendHeight;

    chart.setSize(350);

    assert.notEqual(
        chart.legend.legendHeight,
        legendHeight,
        'Texts should be wrapped, legend height should change (#7874)'
    );
});

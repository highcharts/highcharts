$(function () {
    QUnit.test('Marker border should not be applied, when the serie is hidden.', function (assert) {
        
        $('#container').highcharts({
            title: {
                text: 'Legend <em>itemHiddenStyle</em> demo'
            },
            subtitle: {
                text: 'Marker border should not be applied, when series is hidden'
            },
            plotOptions: {
                series: {
                    marker: {
                        symbol: 'circle',
                        lineWidth: 2,
                        lineColor: 'black'
                    }
                }
            },
            legend: {
                itemHiddenStyle: {
                    color: 'gray',
                }
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            },{
                visible: false,
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        });

        var chart = $('#container').highcharts();
            
        assert.strictEqual(
            chart.series[0].legendSymbol.attr('stroke'),
            'black',
            'Legend - Marker border is black'
        );

        assert.strictEqual(
            chart.series[1].legendSymbol.attr('stroke'),
            'gray',
            'Legend - Hidden marker border has hidden color (gray)'
        );

    });
});
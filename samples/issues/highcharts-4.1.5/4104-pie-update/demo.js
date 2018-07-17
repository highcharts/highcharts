$(function () {
    QUnit.test('Pie slice updating', function (assert) {
        $('#container').highcharts({

            chart: {
                type: 'pie',
                animation: false
            },

            legend: {
                labelFormat: '{name} ({percentage:.1f}%)'
            },

            series: [{
                animation: false,
                data: [1, 2, 3, 4, 5, -5],
                showInLegend: true
            }]

        });

        var chart = $('#container').highcharts();

        chart.series[0].points[0].setVisible(false);

        assert.equal(
            chart.series[0].points[0].graphic.attr('visibility'),
            'hidden',
            'Hidden pie on setVisible false'
        );
        assert.equal(
            typeof chart.series[0].points[0].dataLabel,
            'undefined',
            'Hidden data label on setVisible false'
        );
        assert.equal(
            chart.series[0].points[0].legendItem.textStr,
            'Slice (0.0%)',
            'Hidden data label text string'
        );
        assert.equal(
            chart.series[0].points[1].legendItem.textStr,
            'Slice (14.3%)',
            'Next to hidden data label text string'
        );


        chart.series[0].points[0].setVisible(true, false);
        chart.redraw();
        assert.strictEqual(
            chart.series[0].points[0].graphic.element.getAttribute('visibility'),
            null,
            'Visible pie on setVisible true'
        );
        assert.strictEqual(
            chart.series[0].points[0].dataLabel.element.getAttribute('visibility'),
            null,
            'Visible data label on setVisible true'
        );
        assert.equal(
            chart.series[0].points[0].legendItem.textStr,
            'Slice (6.7%)',
            'Visible data label text string'
        );

        // @todo Create an extensive unit test for PieSeries.updateTotals to replace this
        assert.strictEqual(
            chart.series[0].points[5].isNull,
            true,
            'Disallow negative data. #5322'
        );




    });

});
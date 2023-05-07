QUnit.test('Pie slice updating(#4104)', function (assert) {
    $('#container').highcharts({
        chart: {
            type: 'pie',
            animation: false
        },

        legend: {
            labelFormat: '{name} ({percentage:.1f}%)'
        },

        series: [
            {
                animation: false,
                data: [1, 2, 3, 4, 5, -5],
                showInLegend: true
            }
        ]
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
        chart.series[0].points[0].legendItem.label.textStr,
        'Slice (0.0%)',
        'Hidden data label text string'
    );
    assert.equal(
        chart.series[0].points[1].legendItem.label.textStr,
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
        chart.series[0].points[0].legendItem.label.textStr,
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
QUnit.test('Allow point select with 3D chart (#6094)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                slicedOffset: 25,
                depth: 25,
                animation: false
            }
        },
        series: [
            {
                data: [2, 4, 6, 1, 3]
            }
        ]
    });

    var point = chart.series[0].points[0];
    function getPos() {
        return point.graphic.element.firstChild.getAttribute('transform');
    }

    var startPos = getPos(),
        clock = TestUtilities.lolexInstall();

    try {
        chart.series[0].points[0].slice();
        TestUtilities.lolexRunAndUninstall(clock);
        assert.notEqual(getPos(), startPos, 'Point has moved');
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});

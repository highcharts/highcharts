$(function () {
    QUnit.test('Pie connector with HTML', function (assert) {
        var chart = $('#container').highcharts({

            series: [{
                type: 'pie',
                dataLabels: {
                    useHTML: true
                },
                data: [1, 2, 3]
            }]
        }).highcharts();

        assert.strictEqual(
            typeof chart.series[0].points[0].connector.element.getBBox(),
            'object',
            'Connector has a bounding box'
        );


        // Now hide the series and check that one of the connector's parents is hidden
        chart.series[0].hide();
        var hiddenParent,
            parent = chart.series[0].points[0].connector.element;

        while (parent && hiddenParent === undefined) {
            if (parent.getAttribute('visibility') === 'visible') {
                hiddenParent = false;
            } else if (parent.getAttribute('visibility') === 'hidden') {
                hiddenParent = true;
            }
            parent = parent.parentNode;
        }

        assert.strictEqual(
            hiddenParent,
            true,
            'Connector is inherently hidden'
        );

    });
});
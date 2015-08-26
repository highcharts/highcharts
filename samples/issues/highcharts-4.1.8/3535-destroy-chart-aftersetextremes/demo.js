$(function () {
    QUnit.test('Destroying chart in afterSetExtremes event cause errors in console.', function (assert) {
        var UNDEFINED,
            chart = $('#container').highcharts({
                chart: {
                    zoomType: "x"
                },
                xAxis: {
                    events: {
                        afterSetExtremes: function (event) {
                            console.log("etc.")
                            $('#container').highcharts().destroy();
                        }
                    }
                },
                series: [{
                    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                }]
            }).highcharts();

        chart.pointer.onContainerMouseDown({
            pageX: 100, 
            pageY: 310,
            type: "mousedown",
            target: chart.series[0].group.element 
        });
        chart.pointer.onContainerMouseMove({ 
            pageX: 150, 
            pageY: 310, 
            target: chart.series[0].group.element 
        });
        chart.pointer.onDocumentMouseUp({ 
            pageX: 150, 
            pageY: 310, 
            target: chart.series[0].group.element 
        });

        assert.strictEqual(
            Highcharts.charts[0],
            UNDEFINED,
            'Ok - no errors'
        );
        
    });

});
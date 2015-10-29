$(function () {
    QUnit.test('Sub-millisecond tooltip', function (assert) {
        var chart;

        $('#container').highcharts({
            "title": {
                "text": "Y axis translation failed"
            },
            "legend": {
                "enabled": false
            },
            "xAxis": {
                "min": 5
            },
            "yAxis": {
                "breaks": [{
                    "from": 3,
                    "to": 8,
                    "breakSize": 1
                }]
            },
            "chart": {
                "type": "column",
                "zoomType": "x"
            },
            "series": [{
                "data": [9,8,7,6,5,4,3,2,1]
            }]
        });

        chart = $('#container').highcharts();


        assert.equal(
            chart.yAxis[0].min,
            0,
            'Min makes sense'
        );
        assert.equal(
            chart.yAxis[0].max,
            3,
            'Max stops at break'
        );

    });

});
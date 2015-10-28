$(function () {
    $('#container').highcharts({
        "chart": {
            "type": "waterfall"
        },

        title: {
            text: 'Waterfall with yAxis.min'
        },

        "yAxis": {
            "min": 4
        },

        "series": [{
            "data": [{
                "y": 6
            }, {
                "y": 1
            }, {
                "y": 1
            }]
        }]
    });
});
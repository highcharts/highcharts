// Highcharts 4.1.1, Issue #3886
// Waterfall with y axis starting at >0 broken in 4.1.x
Highcharts.chart('container', {
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

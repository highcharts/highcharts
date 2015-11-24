$(function () {

    $('#container').highcharts({
        chart: {
            "type": "bar",
            "alignTicks": false,
            "marginLeft": 148,
            width: 300,
            backgroundColor: '#FFEFEF'
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'Highcharts <= 3.0.9: Last horizontal axis label was clipped',
            "style": {
                "fontFamily": "Arial, Helvetica, Sans Serif",
                "fontSize": "13px",
                "fontWeight": "bold",
                "color": "#222222"
            }
        },
        "legend": {
            "enabled": false,
            "borderWidth": 0,
            "itemMarginBottom": 10,
            "itemStyle": {
                "fontFamily": "Arial, Helvetica, Sans Serif",
                "fontSize": "10px",
                "color": "#222222"
            }
        },
        "exporting": {
            "buttons": {
                "contextButton": {
                    "enabled": false
                },
                "exportButton": {
                    "enabled": false
                },
                "printButton": {
                    "enabled": false
                }
            }
        },
        "tooltip": {
            "valueDecimals": 2
        },
        xAxis: {
            "labels": {
                "style": {
                    "fontFamily": "Arial, Helvetica, Sans Serif",
                    "fontSize": "10px",
                    "color": "#222222"
                },
                "ellipsis": true
            },
            "title": {
                "text": null,
                "style": {}
            },
            "categories": ["36668 (Description 36668)", "226410 (Description 226410)", "237351 (Description 237351)", "9909 (Description 9909)", "47366 (Description 47366)", "293735 (Description 293735)", "237356 (Description 237356)", "237354 (Description 237354)", "237357 (Description 237357)", "Rest"]
        },
        yAxis: {
            "title": {
                "text": null,
                "style": {}
            },
            "minPadding": 0,
            "maxPadding": 0,
            "min": 0,
            "max": 7000000000,
            "tickInterval": 1000000000,
            "labels": {
                "style": {
                    "fontFamily": "Arial, Helvetica, Sans Serif",
                    "fontSize": "10px",
                    "color": "#222222"
                },
                "formatter": function () {
                    return Highcharts.numberFormat(this.value / 1000000, 0);
                }
            },
            "plotLines": [{
                "value": 0,
                "width": 2,
                "color": "#222222",
                "zIndex": 4
            }]
        },
        plotOptions: {
            bar: {
                "tooltip": {
                    "pointFormat": "<span>{series.name}</span>: <b>{point.y}</b><br/>",
                    "valueDecimals": 2,
                    "valueSuffix": ""
                }
            }
        },
        // now the data
        series: [{
            "name": "Value",
            "dataLabels": {},
            data: [2203996749.00, 2181327870.00, 1842143410.00, 1724601434.00, 1391446136.00, 1377422297.00, 1218712623.00, 1057997532.00, 794479667.00, 6492893821.00]
        }]
    });


});
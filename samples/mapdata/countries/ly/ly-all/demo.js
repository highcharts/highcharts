$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ly-gd",
            "value": 0
        },
        {
            "hc-key": "ly-ju",
            "value": 1
        },
        {
            "hc-key": "ly-kf",
            "value": 2
        },
        {
            "hc-key": "ly-mb",
            "value": 3
        },
        {
            "hc-key": "ly-sh",
            "value": 4
        },
        {
            "hc-key": "ly-gt",
            "value": 5
        },
        {
            "hc-key": "ly-mq",
            "value": 6
        },
        {
            "hc-key": "ly-mi",
            "value": 7
        },
        {
            "hc-key": "ly-sb",
            "value": 8
        },
        {
            "hc-key": "ly-ji",
            "value": 9
        },
        {
            "hc-key": "ly-nq",
            "value": 10
        },
        {
            "hc-key": "ly-za",
            "value": 11
        },
        {
            "hc-key": "ly-mz",
            "value": 12
        },
        {
            "hc-key": "ly-tn",
            "value": 13
        },
        {
            "hc-key": "ly-sr",
            "value": 14
        },
        {
            "hc-key": "ly-hz",
            "value": 15
        },
        {
            "hc-key": "ly-ja",
            "value": 16
        },
        {
            "hc-key": "ly-aj",
            "value": 17
        },
        {
            "hc-key": "ly-ba",
            "value": 18
        },
        {
            "hc-key": "ly-qb",
            "value": 19
        },
        {
            "hc-key": "ly-bu",
            "value": 20
        },
        {
            "hc-key": "ly-wh",
            "value": 21
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ly/ly-all.js">Libya</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series : [{
            data : data,
            mapData: Highcharts.maps['countries/ly/ly-all'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});

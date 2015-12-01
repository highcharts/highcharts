$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "lt-kp",
            "value": 0
        },
        {
            "hc-key": "lt-as",
            "value": 1
        },
        {
            "hc-key": "lt-ks",
            "value": 2
        },
        {
            "hc-key": "lt-ma",
            "value": 3
        },
        {
            "hc-key": "lt-pa",
            "value": 4
        },
        {
            "hc-key": "lt-sh",
            "value": 5
        },
        {
            "hc-key": "lt-tg",
            "value": 6
        },
        {
            "hc-key": "lt-vi",
            "value": 7
        },
        {
            "hc-key": "lt-un",
            "value": 8
        },
        {
            "hc-key": "lt-tl",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/lt/lt-all.js">Lithuania</a>'
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
            mapData: Highcharts.maps['countries/lt/lt-all'],
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

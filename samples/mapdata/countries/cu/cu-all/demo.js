$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "cu-ho",
            "value": 0
        },
        {
            "hc-key": "cu-ar",
            "value": 1
        },
        {
            "hc-key": "cu-ma",
            "value": 2
        },
        {
            "hc-key": "cu-vc",
            "value": 3
        },
        {
            "hc-key": "cu-5812",
            "value": 4
        },
        {
            "hc-key": "cu-ij",
            "value": 5
        },
        {
            "hc-key": "cu-ss",
            "value": 6
        },
        {
            "hc-key": "cu-ca",
            "value": 7
        },
        {
            "hc-key": "cu-cm",
            "value": 8
        },
        {
            "hc-key": "cu-ch",
            "value": 9
        },
        {
            "hc-key": "cu-cf",
            "value": 10
        },
        {
            "hc-key": "cu-gu",
            "value": 11
        },
        {
            "hc-key": "cu-gr",
            "value": 12
        },
        {
            "hc-key": "cu-lt",
            "value": 13
        },
        {
            "hc-key": "cu-sc",
            "value": 14
        },
        {
            "hc-key": "cu-mq",
            "value": 15
        },
        {
            "hc-key": "cu-pr",
            "value": 16
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/cu/cu-all.js">Cuba</a>'
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
            mapData: Highcharts.maps['countries/cu/cu-all'],
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

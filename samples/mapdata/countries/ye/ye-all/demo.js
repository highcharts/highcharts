$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ye-3662",
            "value": 0
        },
        {
            "hc-key": "ye-hu",
            "value": 1
        },
        {
            "hc-key": "ye-3415",
            "value": 2
        },
        {
            "hc-key": "ye-3427",
            "value": 3
        },
        {
            "hc-key": "ye-ad",
            "value": 4
        },
        {
            "hc-key": "ye-3430",
            "value": 5
        },
        {
            "hc-key": "ye-ta",
            "value": 6
        },
        {
            "hc-key": "ye-sd",
            "value": 7
        },
        {
            "hc-key": "ye-mw",
            "value": 8
        },
        {
            "hc-key": "ye-dh",
            "value": 9
        },
        {
            "hc-key": "ye-hj",
            "value": 10
        },
        {
            "hc-key": "ye-am",
            "value": 11
        },
        {
            "hc-key": "ye-ib",
            "value": 12
        },
        {
            "hc-key": "ye-la",
            "value": 13
        },
        {
            "hc-key": "ye-mr",
            "value": 14
        },
        {
            "hc-key": "ye-ba",
            "value": 15
        },
        {
            "hc-key": "ye-dl",
            "value": 16
        },
        {
            "hc-key": "ye-ja",
            "value": 17
        },
        {
            "hc-key": "ye-sh",
            "value": 18
        },
        {
            "hc-key": "ye-ma",
            "value": 19
        },
        {
            "hc-key": "ye-3426",
            "value": 20
        },
        {
            "hc-key": "ye-3428",
            "value": 21
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ye/ye-all.js">Yemen</a>'
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
            mapData: Highcharts.maps['countries/ye/ye-all'],
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

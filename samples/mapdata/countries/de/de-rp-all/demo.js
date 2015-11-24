$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-rp-07211000",
            "value": 0
        },
        {
            "hc-key": "de-rp-07138000",
            "value": 1
        },
        {
            "hc-key": "de-rp-07143000",
            "value": 2
        },
        {
            "hc-key": "de-rp-07313000",
            "value": 3
        },
        {
            "hc-key": "de-rp-07317000",
            "value": 4
        },
        {
            "hc-key": "de-rp-07131000",
            "value": 5
        },
        {
            "hc-key": "de-rp-07319000",
            "value": 6
        },
        {
            "hc-key": "de-rp-07137000",
            "value": 7
        },
        {
            "hc-key": "de-rp-07231000",
            "value": 8
        },
        {
            "hc-key": "de-rp-07134000",
            "value": 9
        },
        {
            "hc-key": "de-rp-07235000",
            "value": 10
        },
        {
            "hc-key": "de-rp-07141000",
            "value": 11
        },
        {
            "hc-key": "de-rp-07233000",
            "value": 12
        },
        {
            "hc-key": "de-rp-07318000",
            "value": 13
        },
        {
            "hc-key": "de-rp-07314000",
            "value": 14
        },
        {
            "hc-key": "de-rp-07331000",
            "value": 15
        },
        {
            "hc-key": "de-rp-07336000",
            "value": 16
        },
        {
            "hc-key": "de-rp-07232000",
            "value": 17
        },
        {
            "hc-key": "de-rp-07132000",
            "value": 18
        },
        {
            "hc-key": "de-rp-07135000",
            "value": 19
        },
        {
            "hc-key": "de-rp-07311000",
            "value": 20
        },
        {
            "hc-key": "de-rp-07315000",
            "value": 21
        },
        {
            "hc-key": "de-rp-07333000",
            "value": 22
        },
        {
            "hc-key": "de-rp-07133000",
            "value": 23
        },
        {
            "hc-key": "de-rp-07111000",
            "value": 24
        },
        {
            "hc-key": "de-rp-07312000",
            "value": 25
        },
        {
            "hc-key": "de-rp-07332000",
            "value": 26
        },
        {
            "hc-key": "de-rp-07340000",
            "value": 27
        },
        {
            "hc-key": "de-rp-07335000",
            "value": 28
        },
        {
            "hc-key": "de-rp-07316000",
            "value": 29
        },
        {
            "hc-key": "de-rp-07338000",
            "value": 30
        },
        {
            "hc-key": "de-rp-07320000",
            "value": 31
        },
        {
            "hc-key": "de-rp-07337000",
            "value": 32
        },
        {
            "hc-key": "de-rp-07339000",
            "value": 33
        },
        {
            "hc-key": "de-rp-07140000",
            "value": 34
        },
        {
            "hc-key": "de-rp-07334000",
            "value": 35
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-rp-all.js">Rheinland-Pfalz</a>'
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
            mapData: Highcharts.maps['countries/de/de-rp-all'],
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

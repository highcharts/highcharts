$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-bw-08136000",
            "value": 0
        },
        {
            "hc-key": "de-bw-08116000",
            "value": 1
        },
        {
            "hc-key": "de-bw-08415000",
            "value": 2
        },
        {
            "hc-key": "de-bw-08115000",
            "value": 3
        },
        {
            "hc-key": "de-bw-08117000",
            "value": 4
        },
        {
            "hc-key": "de-bw-08425000",
            "value": 5
        },
        {
            "hc-key": "de-bw-08226000",
            "value": 6
        },
        {
            "hc-key": "de-bw-08236000",
            "value": 7
        },
        {
            "hc-key": "de-bw-08235000",
            "value": 8
        },
        {
            "hc-key": "de-bw-08231000",
            "value": 9
        },
        {
            "hc-key": "de-bw-08125000",
            "value": 10
        },
        {
            "hc-key": "de-bw-08215000",
            "value": 11
        },
        {
            "hc-key": "de-bw-08111000",
            "value": 12
        },
        {
            "hc-key": "de-bw-08222000",
            "value": 13
        },
        {
            "hc-key": "de-bw-08221000",
            "value": 14
        },
        {
            "hc-key": "de-bw-08212000",
            "value": 15
        },
        {
            "hc-key": "de-bw-08216000",
            "value": 16
        },
        {
            "hc-key": "de-bw-08118000",
            "value": 17
        },
        {
            "hc-key": "de-bw-08119000",
            "value": 18
        },
        {
            "hc-key": "de-bw-08311000",
            "value": 19
        },
        {
            "hc-key": "de-bw-08316000",
            "value": 20
        },
        {
            "hc-key": "de-bw-08135000",
            "value": 21
        },
        {
            "hc-key": "de-bw-08417000",
            "value": 22
        },
        {
            "hc-key": "de-bw-08237000",
            "value": 23
        },
        {
            "hc-key": "de-bw-08225000",
            "value": 24
        },
        {
            "hc-key": "de-bw-08128000",
            "value": 25
        },
        {
            "hc-key": "de-bw-08435000",
            "value": 26
        },
        {
            "hc-key": "de-bw-08127000",
            "value": 27
        },
        {
            "hc-key": "de-bw-08335000",
            "value": 28
        },
        {
            "hc-key": "de-bw-08317000",
            "value": 29
        },
        {
            "hc-key": "de-bw-08336000",
            "value": 30
        },
        {
            "hc-key": "de-bw-08326000",
            "value": 31
        },
        {
            "hc-key": "de-bw-08337000",
            "value": 32
        },
        {
            "hc-key": "de-bw-08436000",
            "value": 33
        },
        {
            "hc-key": "de-bw-08437000",
            "value": 34
        },
        {
            "hc-key": "de-bw-08426000",
            "value": 35
        },
        {
            "hc-key": "de-bw-08421000",
            "value": 36
        },
        {
            "hc-key": "de-bw-08315000",
            "value": 37
        },
        {
            "hc-key": "de-bw-08121000",
            "value": 38
        },
        {
            "hc-key": "de-bw-08416000",
            "value": 39
        },
        {
            "hc-key": "de-bw-08211000",
            "value": 40
        },
        {
            "hc-key": "de-bw-08325000",
            "value": 41
        },
        {
            "hc-key": "de-bw-08327000",
            "value": 42
        },
        {
            "hc-key": "de-bw-08126000",
            "value": 43
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-bw-all.js">Baden-Württemberg</a>'
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
            mapData: Highcharts.maps['countries/de/de-bw-all'],
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

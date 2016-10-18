$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-nw-05334000",
            "value": 0
        },
        {
            "hc-key": "de-nw-05914000",
            "value": 1
        },
        {
            "hc-key": "de-nw-05978000",
            "value": 2
        },
        {
            "hc-key": "de-nw-05754000",
            "value": 3
        },
        {
            "hc-key": "de-nw-05758000",
            "value": 4
        },
        {
            "hc-key": "de-nw-05314000",
            "value": 5
        },
        {
            "hc-key": "de-nw-05370000",
            "value": 6
        },
        {
            "hc-key": "de-nw-05162000",
            "value": 7
        },
        {
            "hc-key": "de-nw-05166000",
            "value": 8
        },
        {
            "hc-key": "de-nw-05915000",
            "value": 9
        },
        {
            "hc-key": "de-nw-05558000",
            "value": 10
        },
        {
            "hc-key": "de-nw-05962000",
            "value": 11
        },
        {
            "hc-key": "de-nw-05954000",
            "value": 12
        },
        {
            "hc-key": "de-nw-05374000",
            "value": 13
        },
        {
            "hc-key": "de-nw-05124000",
            "value": 14
        },
        {
            "hc-key": "de-nw-05974000",
            "value": 15
        },
        {
            "hc-key": "de-nw-05119000",
            "value": 16
        },
        {
            "hc-key": "de-nw-05170000",
            "value": 17
        },
        {
            "hc-key": "de-nw-05120000",
            "value": 18
        },
        {
            "hc-key": "de-nw-05122000",
            "value": 19
        },
        {
            "hc-key": "de-nw-05112000",
            "value": 20
        },
        {
            "hc-key": "de-nw-05911000",
            "value": 21
        },
        {
            "hc-key": "de-nw-05562000",
            "value": 22
        },
        {
            "hc-key": "de-nw-05358000",
            "value": 23
        },
        {
            "hc-key": "de-nw-05378000",
            "value": 24
        },
        {
            "hc-key": "de-nw-05158000",
            "value": 25
        },
        {
            "hc-key": "de-nw-05315000",
            "value": 26
        },
        {
            "hc-key": "de-nw-05316000",
            "value": 27
        },
        {
            "hc-key": "de-nw-05113000",
            "value": 28
        },
        {
            "hc-key": "de-nw-05512000",
            "value": 29
        },
        {
            "hc-key": "de-nw-05913000",
            "value": 30
        },
        {
            "hc-key": "de-nw-05513000",
            "value": 31
        },
        {
            "hc-key": "de-nw-05114000",
            "value": 32
        },
        {
            "hc-key": "de-nw-05766000",
            "value": 33
        },
        {
            "hc-key": "de-nw-05970000",
            "value": 34
        },
        {
            "hc-key": "de-nw-05566000",
            "value": 35
        },
        {
            "hc-key": "de-nw-05116000",
            "value": 36
        },
        {
            "hc-key": "de-nw-05570000",
            "value": 37
        },
        {
            "hc-key": "de-nw-05711000",
            "value": 38
        },
        {
            "hc-key": "de-nw-05966000",
            "value": 39
        },
        {
            "hc-key": "de-nw-05154000",
            "value": 40
        },
        {
            "hc-key": "de-nw-05762000",
            "value": 41
        },
        {
            "hc-key": "de-nw-05958000",
            "value": 42
        },
        {
            "hc-key": "de-nw-05554000",
            "value": 43
        },
        {
            "hc-key": "de-nw-05770000",
            "value": 44
        },
        {
            "hc-key": "de-nw-05382000",
            "value": 45
        },
        {
            "hc-key": "de-nw-05366000",
            "value": 46
        },
        {
            "hc-key": "de-nw-05774000",
            "value": 47
        },
        {
            "hc-key": "de-nw-05515000",
            "value": 48
        },
        {
            "hc-key": "de-nw-05916000",
            "value": 49
        },
        {
            "hc-key": "de-nw-05117000",
            "value": 50
        },
        {
            "hc-key": "de-nw-05111000",
            "value": 51
        },
        {
            "hc-key": "de-nw-05362000",
            "value": 52
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-nw-all.js">Nordrhein-Westfalen</a>'
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
            mapData: Highcharts.maps['countries/de/de-nw-all'],
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

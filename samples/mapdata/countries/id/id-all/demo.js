$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "id-3700",
            "value": 0
        },
        {
            "hc-key": "id-ac",
            "value": 1
        },
        {
            "hc-key": "id-ki",
            "value": 2
        },
        {
            "hc-key": "id-jt",
            "value": 3
        },
        {
            "hc-key": "id-be",
            "value": 4
        },
        {
            "hc-key": "id-bt",
            "value": 5
        },
        {
            "hc-key": "id-kb",
            "value": 6
        },
        {
            "hc-key": "id-bb",
            "value": 7
        },
        {
            "hc-key": "id-ba",
            "value": 8
        },
        {
            "hc-key": "id-ji",
            "value": 9
        },
        {
            "hc-key": "id-ks",
            "value": 10
        },
        {
            "hc-key": "id-nt",
            "value": 11
        },
        {
            "hc-key": "id-se",
            "value": 12
        },
        {
            "hc-key": "id-kr",
            "value": 13
        },
        {
            "hc-key": "id-ib",
            "value": 14
        },
        {
            "hc-key": "id-su",
            "value": 15
        },
        {
            "hc-key": "id-ri",
            "value": 16
        },
        {
            "hc-key": "id-sw",
            "value": 17
        },
        {
            "hc-key": "id-la",
            "value": 18
        },
        {
            "hc-key": "id-sb",
            "value": 19
        },
        {
            "hc-key": "id-ma",
            "value": 20
        },
        {
            "hc-key": "id-nb",
            "value": 21
        },
        {
            "hc-key": "id-sg",
            "value": 22
        },
        {
            "hc-key": "id-st",
            "value": 23
        },
        {
            "hc-key": "id-pa",
            "value": 24
        },
        {
            "hc-key": "id-jr",
            "value": 25
        },
        {
            "hc-key": "id-1024",
            "value": 26
        },
        {
            "hc-key": "id-jk",
            "value": 27
        },
        {
            "hc-key": "id-go",
            "value": 28
        },
        {
            "hc-key": "id-yo",
            "value": 29
        },
        {
            "hc-key": "id-kt",
            "value": 30
        },
        {
            "hc-key": "id-sl",
            "value": 31
        },
        {
            "hc-key": "id-sr",
            "value": 32
        },
        {
            "hc-key": "id-ja",
            "value": 33
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/id/id-all.js">Indonesia</a>'
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
            mapData: Highcharts.maps['countries/id/id-all'],
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

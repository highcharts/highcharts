$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "af-kt",
            "value": 0
        },
        {
            "hc-key": "af-pk",
            "value": 1
        },
        {
            "hc-key": "af-gz",
            "value": 2
        },
        {
            "hc-key": "af-bd",
            "value": 3
        },
        {
            "hc-key": "af-nr",
            "value": 4
        },
        {
            "hc-key": "af-kr",
            "value": 5
        },
        {
            "hc-key": "af-kz",
            "value": 6
        },
        {
            "hc-key": "af-ng",
            "value": 7
        },
        {
            "hc-key": "af-tk",
            "value": 8
        },
        {
            "hc-key": "af-bl",
            "value": 9
        },
        {
            "hc-key": "af-kb",
            "value": 10
        },
        {
            "hc-key": "af-kp",
            "value": 11
        },
        {
            "hc-key": "af-2030",
            "value": 12
        },
        {
            "hc-key": "af-la",
            "value": 13
        },
        {
            "hc-key": "af-lw",
            "value": 14
        },
        {
            "hc-key": "af-pv",
            "value": 15
        },
        {
            "hc-key": "af-sm",
            "value": 16
        },
        {
            "hc-key": "af-vr",
            "value": 17
        },
        {
            "hc-key": "af-pt",
            "value": 18
        },
        {
            "hc-key": "af-bg",
            "value": 19
        },
        {
            "hc-key": "af-hr",
            "value": 20
        },
        {
            "hc-key": "af-bk",
            "value": 21
        },
        {
            "hc-key": "af-jw",
            "value": 22
        },
        {
            "hc-key": "af-bm",
            "value": 23
        },
        {
            "hc-key": "af-gr",
            "value": 24
        },
        {
            "hc-key": "af-fb",
            "value": 25
        },
        {
            "hc-key": "af-sp",
            "value": 26
        },
        {
            "hc-key": "af-fh",
            "value": 27
        },
        {
            "hc-key": "af-hm",
            "value": 28
        },
        {
            "hc-key": "af-nm",
            "value": 29
        },
        {
            "hc-key": "af-2014",
            "value": 30
        },
        {
            "hc-key": "af-oz",
            "value": 31
        },
        {
            "hc-key": "af-kd",
            "value": 32
        },
        {
            "hc-key": "af-zb",
            "value": 33
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/af/af-all.js">Afghanistan</a>'
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
            mapData: Highcharts.maps['countries/af/af-all'],
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

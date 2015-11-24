$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gl",
            "value": 0
        },
        {
            "hc-key": "lc",
            "value": 1
        },
        {
            "hc-key": "um",
            "value": 2
        },
        {
            "hc-key": "us",
            "value": 3
        },
        {
            "hc-key": "vi",
            "value": 4
        },
        {
            "hc-key": "ca",
            "value": 5
        },
        {
            "hc-key": "cu",
            "value": 6
        },
        {
            "hc-key": "kn",
            "value": 7
        },
        {
            "hc-key": "ni",
            "value": 8
        },
        {
            "hc-key": "gd",
            "value": 9
        },
        {
            "hc-key": "dm",
            "value": 10
        },
        {
            "hc-key": "ag",
            "value": 11
        },
        {
            "hc-key": "tt",
            "value": 12
        },
        {
            "hc-key": "sw",
            "value": 13
        },
        {
            "hc-key": "bb",
            "value": 14
        },
        {
            "hc-key": "jm",
            "value": 15
        },
        {
            "hc-key": "bu",
            "value": 16
        },
        {
            "hc-key": "bs",
            "value": 17
        },
        {
            "hc-key": "vc",
            "value": 18
        },
        {
            "hc-key": "ht",
            "value": 19
        },
        {
            "hc-key": "sv",
            "value": 20
        },
        {
            "hc-key": "hn",
            "value": 21
        },
        {
            "hc-key": "do",
            "value": 22
        },
        {
            "hc-key": "mx",
            "value": 23
        },
        {
            "hc-key": "bz",
            "value": 24
        },
        {
            "hc-key": "gt",
            "value": 25
        },
        {
            "hc-key": "cr",
            "value": 26
        },
        {
            "hc-key": "pr",
            "value": 27
        },
        {
            "hc-key": "pa",
            "value": 28
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/north-america.js">North America</a>'
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
            mapData: Highcharts.maps['custom/north-america'],
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

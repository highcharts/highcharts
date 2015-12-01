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
            "hc-key": "gd",
            "value": 8
        },
        {
            "hc-key": "dm",
            "value": 9
        },
        {
            "hc-key": "ag",
            "value": 10
        },
        {
            "hc-key": "tt",
            "value": 11
        },
        {
            "hc-key": "sw",
            "value": 12
        },
        {
            "hc-key": "bb",
            "value": 13
        },
        {
            "hc-key": "jm",
            "value": 14
        },
        {
            "hc-key": "bu",
            "value": 15
        },
        {
            "hc-key": "bs",
            "value": 16
        },
        {
            "hc-key": "vc",
            "value": 17
        },
        {
            "hc-key": "ht",
            "value": 18
        },
        {
            "hc-key": "do",
            "value": 19
        },
        {
            "hc-key": "mx",
            "value": 20
        },
        {
            "hc-key": "pr",
            "value": 21
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/north-america-no-central.js">North America without central</a>'
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
            mapData: Highcharts.maps['custom/north-america-no-central'],
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

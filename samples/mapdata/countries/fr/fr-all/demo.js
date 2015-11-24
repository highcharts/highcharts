$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-t",
            "value": 0
        },
        {
            "hc-key": "fr-h",
            "value": 1
        },
        {
            "hc-key": "fr-e",
            "value": 2
        },
        {
            "hc-key": "fr-r",
            "value": 3
        },
        {
            "hc-key": "fr-u",
            "value": 4
        },
        {
            "hc-key": "fr-n",
            "value": 5
        },
        {
            "hc-key": "fr-p",
            "value": 6
        },
        {
            "hc-key": "fr-o",
            "value": 7
        },
        {
            "hc-key": "fr-v",
            "value": 8
        },
        {
            "hc-key": "fr-s",
            "value": 9
        },
        {
            "hc-key": "fr-g",
            "value": 10
        },
        {
            "hc-key": "fr-k",
            "value": 11
        },
        {
            "hc-key": "fr-a",
            "value": 12
        },
        {
            "hc-key": "fr-c",
            "value": 13
        },
        {
            "hc-key": "fr-f",
            "value": 14
        },
        {
            "hc-key": "fr-l",
            "value": 15
        },
        {
            "hc-key": "fr-d",
            "value": 16
        },
        {
            "hc-key": "fr-b",
            "value": 17
        },
        {
            "hc-key": "fr-i",
            "value": 18
        },
        {
            "hc-key": "fr-q",
            "value": 19
        },
        {
            "hc-key": "fr-j",
            "value": 20
        },
        {
            "hc-key": "fr-m",
            "value": 21
        },
        {
            "hc-key": "fr-re",
            "value": 22
        },
        {
            "hc-key": "fr-yt",
            "value": 23
        },
        {
            "hc-key": "fr-gf",
            "value": 24
        },
        {
            "hc-key": "fr-mq",
            "value": 25
        },
        {
            "hc-key": "fr-gp",
            "value": 26
        },
        {
            "value": 27
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-all.js">France</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-all'],
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
        }, {
            name: 'Separators',
            type: 'mapline',
            data: Highcharts.geojson(Highcharts.maps['countries/fr/fr-all'], 'mapline'),
            color: 'silver',
            showInLegend: false,
            enableMouseTracking: false
        }]
    });
});

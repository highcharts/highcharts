$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "dk",
            "value": 0
        },
        {
            "hc-key": "de",
            "value": 1
        },
        {
            "hc-key": "gl",
            "value": 2
        },
        {
            "hc-key": "fr",
            "value": 3
        },
        {
            "hc-key": "no",
            "value": 4
        },
        {
            "hc-key": "us",
            "value": 5
        },
        {
            "hc-key": "ca",
            "value": 6
        },
        {
            "hc-key": "hr",
            "value": 7
        },
        {
            "hc-key": "gb",
            "value": 8
        },
        {
            "hc-key": "ee",
            "value": 9
        },
        {
            "hc-key": "gr",
            "value": 10
        },
        {
            "hc-key": "nl",
            "value": 11
        },
        {
            "hc-key": "es",
            "value": 12
        },
        {
            "hc-key": "lt",
            "value": 13
        },
        {
            "hc-key": "it",
            "value": 14
        },
        {
            "hc-key": "tr",
            "value": 15
        },
        {
            "hc-key": "pl",
            "value": 16
        },
        {
            "hc-key": "sk",
            "value": 17
        },
        {
            "hc-key": "bg",
            "value": 18
        },
        {
            "hc-key": "lv",
            "value": 19
        },
        {
            "hc-key": "hu",
            "value": 20
        },
        {
            "hc-key": "lu",
            "value": 21
        },
        {
            "hc-key": "si",
            "value": 22
        },
        {
            "hc-key": "be",
            "value": 23
        },
        {
            "hc-key": "al",
            "value": 24
        },
        {
            "hc-key": "ro",
            "value": 25
        },
        {
            "hc-key": "pt",
            "value": 26
        },
        {
            "hc-key": "is",
            "value": 27
        },
        {
            "hc-key": "cz",
            "value": 28
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/nato.js">North Atlantic Treaty Organization</a>'
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
            mapData: Highcharts.maps['custom/nato'],
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

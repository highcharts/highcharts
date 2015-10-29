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
            "hc-key": "fr",
            "value": 2
        },
        {
            "hc-key": "ie",
            "value": 3
        },
        {
            "hc-key": "hr",
            "value": 4
        },
        {
            "hc-key": "gb",
            "value": 5
        },
        {
            "hc-key": "ee",
            "value": 6
        },
        {
            "hc-key": "cy",
            "value": 7
        },
        {
            "hc-key": "fi",
            "value": 8
        },
        {
            "hc-key": "gr",
            "value": 9
        },
        {
            "hc-key": "se",
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
            "hc-key": "mt",
            "value": 15
        },
        {
            "hc-key": "nc",
            "value": 16
        },
        {
            "hc-key": "pl",
            "value": 17
        },
        {
            "hc-key": "sk",
            "value": 18
        },
        {
            "hc-key": "hu",
            "value": 19
        },
        {
            "hc-key": "lu",
            "value": 20
        },
        {
            "hc-key": "si",
            "value": 21
        },
        {
            "hc-key": "be",
            "value": 22
        },
        {
            "hc-key": "cnm",
            "value": 23
        },
        {
            "hc-key": "bg",
            "value": 24
        },
        {
            "hc-key": "ro",
            "value": 25
        },
        {
            "hc-key": "lv",
            "value": 26
        },
        {
            "hc-key": "at",
            "value": 27
        },
        {
            "hc-key": "cz",
            "value": 28
        },
        {
            "hc-key": "pt",
            "value": 29
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/european-union.js">European Union</a>'
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
            mapData: Highcharts.maps['custom/european-union'],
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

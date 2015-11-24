$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "dk",
            "value": 0
        },
        {
            "hc-key": "fo",
            "value": 1
        },
        {
            "hc-key": "hr",
            "value": 2
        },
        {
            "hc-key": "nl",
            "value": 3
        },
        {
            "hc-key": "ee",
            "value": 4
        },
        {
            "hc-key": "bg",
            "value": 5
        },
        {
            "hc-key": "es",
            "value": 6
        },
        {
            "hc-key": "it",
            "value": 7
        },
        {
            "hc-key": "sm",
            "value": 8
        },
        {
            "hc-key": "va",
            "value": 9
        },
        {
            "hc-key": "tr",
            "value": 10
        },
        {
            "hc-key": "mt",
            "value": 11
        },
        {
            "hc-key": "fr",
            "value": 12
        },
        {
            "hc-key": "no",
            "value": 13
        },
        {
            "hc-key": "de",
            "value": 14
        },
        {
            "hc-key": "ie",
            "value": 15
        },
        {
            "hc-key": "ua",
            "value": 16
        },
        {
            "hc-key": "fi",
            "value": 17
        },
        {
            "hc-key": "se",
            "value": 18
        },
        {
            "hc-key": "ru",
            "value": 19
        },
        {
            "hc-key": "gb",
            "value": 20
        },
        {
            "hc-key": "cy",
            "value": 21
        },
        {
            "hc-key": "pt",
            "value": 22
        },
        {
            "hc-key": "gr",
            "value": 23
        },
        {
            "hc-key": "lt",
            "value": 24
        },
        {
            "hc-key": "si",
            "value": 25
        },
        {
            "hc-key": "ba",
            "value": 26
        },
        {
            "hc-key": "mc",
            "value": 27
        },
        {
            "hc-key": "al",
            "value": 28
        },
        {
            "hc-key": "cnm",
            "value": 29
        },
        {
            "hc-key": "nc",
            "value": 30
        },
        {
            "hc-key": "rs",
            "value": 31
        },
        {
            "hc-key": "ro",
            "value": 32
        },
        {
            "hc-key": "me",
            "value": 33
        },
        {
            "hc-key": "li",
            "value": 34
        },
        {
            "hc-key": "at",
            "value": 35
        },
        {
            "hc-key": "sk",
            "value": 36
        },
        {
            "hc-key": "hu",
            "value": 37
        },
        {
            "hc-key": "ad",
            "value": 38
        },
        {
            "hc-key": "lu",
            "value": 39
        },
        {
            "hc-key": "ch",
            "value": 40
        },
        {
            "hc-key": "be",
            "value": 41
        },
        {
            "hc-key": "kv",
            "value": 42
        },
        {
            "hc-key": "pl",
            "value": 43
        },
        {
            "hc-key": "mk",
            "value": 44
        },
        {
            "hc-key": "lv",
            "value": 45
        },
        {
            "hc-key": "by",
            "value": 46
        },
        {
            "hc-key": "is",
            "value": 47
        },
        {
            "hc-key": "md",
            "value": 48
        },
        {
            "hc-key": "cz",
            "value": 49
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/europe.js">Europe</a>'
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
            mapData: Highcharts.maps['custom/europe'],
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

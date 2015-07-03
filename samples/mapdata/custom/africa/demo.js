$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ug",
            "value": 0
        },
        {
            "hc-key": "ng",
            "value": 1
        },
        {
            "hc-key": "st",
            "value": 2
        },
        {
            "hc-key": "tz",
            "value": 3
        },
        {
            "hc-key": "sl",
            "value": 4
        },
        {
            "hc-key": "gw",
            "value": 5
        },
        {
            "hc-key": "cv",
            "value": 6
        },
        {
            "hc-key": "sc",
            "value": 7
        },
        {
            "hc-key": "tn",
            "value": 8
        },
        {
            "hc-key": "mg",
            "value": 9
        },
        {
            "hc-key": "ke",
            "value": 10
        },
        {
            "hc-key": "cd",
            "value": 11
        },
        {
            "hc-key": "fr",
            "value": 12
        },
        {
            "hc-key": "mr",
            "value": 13
        },
        {
            "hc-key": "dz",
            "value": 14
        },
        {
            "hc-key": "er",
            "value": 15
        },
        {
            "hc-key": "so",
            "value": 16
        },
        {
            "hc-key": "sx",
            "value": 17
        },
        {
            "hc-key": "gq",
            "value": 18
        },
        {
            "hc-key": "mu",
            "value": 19
        },
        {
            "hc-key": "sn",
            "value": 20
        },
        {
            "hc-key": "km",
            "value": 21
        },
        {
            "hc-key": "et",
            "value": 22
        },
        {
            "hc-key": "ci",
            "value": 23
        },
        {
            "hc-key": "gh",
            "value": 24
        },
        {
            "hc-key": "zm",
            "value": 25
        },
        {
            "hc-key": "na",
            "value": 26
        },
        {
            "hc-key": "rw",
            "value": 27
        },
        {
            "hc-key": "cm",
            "value": 28
        },
        {
            "hc-key": "cg",
            "value": 29
        },
        {
            "hc-key": "eh",
            "value": 30
        },
        {
            "hc-key": "bj",
            "value": 31
        },
        {
            "hc-key": "bf",
            "value": 32
        },
        {
            "hc-key": "tg",
            "value": 33
        },
        {
            "hc-key": "ss",
            "value": 34
        },
        {
            "hc-key": "ne",
            "value": 35
        },
        {
            "hc-key": "ly",
            "value": 36
        },
        {
            "hc-key": "lr",
            "value": 37
        },
        {
            "hc-key": "mw",
            "value": 38
        },
        {
            "hc-key": "gm",
            "value": 39
        },
        {
            "hc-key": "td",
            "value": 40
        },
        {
            "hc-key": "ga",
            "value": 41
        },
        {
            "hc-key": "dj",
            "value": 42
        },
        {
            "hc-key": "bi",
            "value": 43
        },
        {
            "hc-key": "ao",
            "value": 44
        },
        {
            "hc-key": "ml",
            "value": 45
        },
        {
            "hc-key": "gn",
            "value": 46
        },
        {
            "hc-key": "zw",
            "value": 47
        },
        {
            "hc-key": "za",
            "value": 48
        },
        {
            "hc-key": "mz",
            "value": 49
        },
        {
            "hc-key": "sz",
            "value": 50
        },
        {
            "hc-key": "bw",
            "value": 51
        },
        {
            "hc-key": "sd",
            "value": 52
        },
        {
            "hc-key": "ma",
            "value": 53
        },
        {
            "hc-key": "eg",
            "value": 54
        },
        {
            "hc-key": "ls",
            "value": 55
        },
        {
            "hc-key": "cf",
            "value": 56
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/custom/africa.js">Africa</a>'
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
            mapData: Highcharts.maps['custom/africa'],
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

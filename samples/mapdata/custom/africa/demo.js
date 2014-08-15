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
            "hc-key": "bj",
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
            "hc-key": "ly",
            "value": 11
        },
        {
            "hc-key": "sd",
            "value": 12
        },
        {
            "hc-key": "cd",
            "value": 13
        },
        {
            "hc-key": "mr",
            "value": 14
        },
        {
            "hc-key": "dz",
            "value": 15
        },
        {
            "hc-key": "er",
            "value": 16
        },
        {
            "hc-key": "gq",
            "value": 17
        },
        {
            "hc-key": "sn",
            "value": 18
        },
        {
            "hc-key": "km",
            "value": 19
        },
        {
            "hc-key": "et",
            "value": 20
        },
        {
            "hc-key": "ci",
            "value": 21
        },
        {
            "hc-key": "gh",
            "value": 22
        },
        {
            "hc-key": "zm",
            "value": 23
        },
        {
            "hc-key": "na",
            "value": 24
        },
        {
            "hc-key": "rw",
            "value": 25
        },
        {
            "hc-key": "cm",
            "value": 26
        },
        {
            "hc-key": "cg",
            "value": 27
        },
        {
            "hc-key": "eh",
            "value": 28
        },
        {
            "hc-key": "tg",
            "value": 29
        },
        {
            "hc-key": "bf",
            "value": 30
        },
        {
            "hc-key": "ne",
            "value": 31
        },
        {
            "hc-key": "lr",
            "value": 32
        },
        {
            "hc-key": "mw",
            "value": 33
        },
        {
            "hc-key": "gm",
            "value": 34
        },
        {
            "hc-key": "td",
            "value": 35
        },
        {
            "hc-key": "ga",
            "value": 36
        },
        {
            "hc-key": "dj",
            "value": 37
        },
        {
            "hc-key": "sx",
            "value": 38
        },
        {
            "hc-key": "bi",
            "value": 39
        },
        {
            "hc-key": "ao",
            "value": 40
        },
        {
            "hc-key": "ml",
            "value": 41
        },
        {
            "hc-key": "gn",
            "value": 42
        },
        {
            "hc-key": "zw",
            "value": 43
        },
        {
            "hc-key": "za",
            "value": 44
        },
        {
            "hc-key": "mz",
            "value": 45
        },
        {
            "hc-key": "sz",
            "value": 46
        },
        {
            "hc-key": "bw",
            "value": 47
        },
        {
            "hc-key": "so",
            "value": 48
        },
        {
            "hc-key": "ss",
            "value": 49
        },
        {
            "hc-key": "ma",
            "value": 50
        },
        {
            "hc-key": "eg",
            "value": 51
        },
        {
            "hc-key": "ls",
            "value": 52
        },
        {
            "hc-key": "cf",
            "value": 53
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

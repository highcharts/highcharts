$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "th-ct",
            "value": 0
        },
        {
            "hc-key": "th-4255",
            "value": 1
        },
        {
            "hc-key": "th-pg",
            "value": 2
        },
        {
            "hc-key": "th-st",
            "value": 3
        },
        {
            "hc-key": "th-kr",
            "value": 4
        },
        {
            "hc-key": "th-sa",
            "value": 5
        },
        {
            "hc-key": "th-tg",
            "value": 6
        },
        {
            "hc-key": "th-tt",
            "value": 7
        },
        {
            "hc-key": "th-pl",
            "value": 8
        },
        {
            "hc-key": "th-ps",
            "value": 9
        },
        {
            "hc-key": "th-kp",
            "value": 10
        },
        {
            "hc-key": "th-pc",
            "value": 11
        },
        {
            "hc-key": "th-sh",
            "value": 12
        },
        {
            "hc-key": "th-at",
            "value": 13
        },
        {
            "hc-key": "th-lb",
            "value": 14
        },
        {
            "hc-key": "th-pa",
            "value": 15
        },
        {
            "hc-key": "th-np",
            "value": 16
        },
        {
            "hc-key": "th-sb",
            "value": 17
        },
        {
            "hc-key": "th-cn",
            "value": 18
        },
        {
            "hc-key": "th-bm",
            "value": 19
        },
        {
            "hc-key": "th-pt",
            "value": 20
        },
        {
            "hc-key": "th-no",
            "value": 21
        },
        {
            "hc-key": "th-sp",
            "value": 22
        },
        {
            "hc-key": "th-ss",
            "value": 23
        },
        {
            "hc-key": "th-sm",
            "value": 24
        },
        {
            "hc-key": "th-pe",
            "value": 25
        },
        {
            "hc-key": "th-cc",
            "value": 26
        },
        {
            "hc-key": "th-nn",
            "value": 27
        },
        {
            "hc-key": "th-cb",
            "value": 28
        },
        {
            "hc-key": "th-br",
            "value": 29
        },
        {
            "hc-key": "th-kk",
            "value": 30
        },
        {
            "hc-key": "th-ph",
            "value": 31
        },
        {
            "hc-key": "th-kl",
            "value": 32
        },
        {
            "hc-key": "th-sr",
            "value": 33
        },
        {
            "hc-key": "th-nr",
            "value": 34
        },
        {
            "hc-key": "th-si",
            "value": 35
        },
        {
            "hc-key": "th-re",
            "value": 36
        },
        {
            "hc-key": "th-le",
            "value": 37
        },
        {
            "hc-key": "th-nk",
            "value": 38
        },
        {
            "hc-key": "th-ac",
            "value": 39
        },
        {
            "hc-key": "th-md",
            "value": 40
        },
        {
            "hc-key": "th-sn",
            "value": 41
        },
        {
            "hc-key": "th-nw",
            "value": 42
        },
        {
            "hc-key": "th-pi",
            "value": 43
        },
        {
            "hc-key": "th-rn",
            "value": 44
        },
        {
            "hc-key": "th-nt",
            "value": 45
        },
        {
            "hc-key": "th-sg",
            "value": 46
        },
        {
            "hc-key": "th-pr",
            "value": 47
        },
        {
            "hc-key": "th-py",
            "value": 48
        },
        {
            "hc-key": "th-so",
            "value": 49
        },
        {
            "hc-key": "th-ud",
            "value": 50
        },
        {
            "hc-key": "th-kn",
            "value": 51
        },
        {
            "hc-key": "th-tk",
            "value": 52
        },
        {
            "hc-key": "th-ut",
            "value": 53
        },
        {
            "hc-key": "th-ns",
            "value": 54
        },
        {
            "hc-key": "th-pk",
            "value": 55
        },
        {
            "hc-key": "th-ur",
            "value": 56
        },
        {
            "hc-key": "th-sk",
            "value": 57
        },
        {
            "hc-key": "th-ry",
            "value": 58
        },
        {
            "hc-key": "th-cy",
            "value": 59
        },
        {
            "hc-key": "th-su",
            "value": 60
        },
        {
            "hc-key": "th-nf",
            "value": 61
        },
        {
            "hc-key": "th-bk",
            "value": 62
        },
        {
            "hc-key": "th-mh",
            "value": 63
        },
        {
            "hc-key": "th-pu",
            "value": 64
        },
        {
            "hc-key": "th-cp",
            "value": 65
        },
        {
            "hc-key": "th-yl",
            "value": 66
        },
        {
            "hc-key": "th-cr",
            "value": 67
        },
        {
            "hc-key": "th-cm",
            "value": 68
        },
        {
            "hc-key": "th-ln",
            "value": 69
        },
        {
            "hc-key": "th-na",
            "value": 70
        },
        {
            "hc-key": "th-lg",
            "value": 71
        },
        {
            "hc-key": "th-pb",
            "value": 72
        },
        {
            "hc-key": "th-rt",
            "value": 73
        },
        {
            "hc-key": "th-ys",
            "value": 74
        },
        {
            "hc-key": "th-ms",
            "value": 75
        },
        {
            "hc-key": "th-un",
            "value": 76
        },
        {
            "hc-key": "th-nb",
            "value": 77
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/th/th-all.js">Thailand</a>'
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
            mapData: Highcharts.maps['countries/th/th-all'],
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

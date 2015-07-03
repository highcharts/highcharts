$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fr-e-mb",
            "value": 0
        },
        {
            "hc-key": "fr-r-vd",
            "value": 1
        },
        {
            "hc-key": "fr-k-ad",
            "value": 2
        },
        {
            "hc-key": "fr-u-vc",
            "value": 3
        },
        {
            "hc-key": "fr-v-ai",
            "value": 4
        },
        {
            "hc-key": "fr-v-is",
            "value": 5
        },
        {
            "hc-key": "fr-g-hm",
            "value": 6
        },
        {
            "hc-key": "fr-g-mr",
            "value": 7
        },
        {
            "hc-key": "fr-o-no",
            "value": 8
        },
        {
            "hc-key": "fr-n-hp",
            "value": 9
        },
        {
            "hc-key": "fr-v-rh",
            "value": 10
        },
        {
            "hc-key": "fr-d-sl",
            "value": 11
        },
        {
            "hc-key": "fr-f-in",
            "value": 12
        },
        {
            "hc-key": "fr-t-vn",
            "value": 13
        },
        {
            "hc-key": "fr-t-cm",
            "value": 14
        },
        {
            "hc-key": "fr-b-dd",
            "value": 15
        },
        {
            "hc-key": "fr-u-am",
            "value": 16
        },
        {
            "hc-key": "fr-u-vr",
            "value": 17
        },
        {
            "hc-key": "fr-u-ap",
            "value": 18
        },
        {
            "hc-key": "fr-s-as",
            "value": 19
        },
        {
            "hc-key": "fr-u-bd",
            "value": 20
        },
        {
            "hc-key": "fr-n-av",
            "value": 21
        },
        {
            "hc-key": "fr-k-ga",
            "value": 22
        },
        {
            "hc-key": "fr-t-ct",
            "value": 23
        },
        {
            "hc-key": "fr-g-ab",
            "value": 24
        },
        {
            "hc-key": "fr-d-co",
            "value": 25
        },
        {
            "hc-key": "fr-f-ch",
            "value": 26
        },
        {
            "hc-key": "fr-l-cr",
            "value": 27
        },
        {
            "hc-key": "fr-t-ds",
            "value": 28
        },
        {
            "hc-key": "fr-r-ml",
            "value": 29
        },
        {
            "hc-key": "fr-v-dm",
            "value": 30
        },
        {
            "hc-key": "fr-v-ah",
            "value": 31
        },
        {
            "hc-key": "fr-q-eu",
            "value": 32
        },
        {
            "hc-key": "fr-j-es",
            "value": 33
        },
        {
            "hc-key": "fr-f-el",
            "value": 34
        },
        {
            "hc-key": "fr-j-hd",
            "value": 35
        },
        {
            "hc-key": "fr-l-hv",
            "value": 36
        },
        {
            "hc-key": "fr-r-st",
            "value": 37
        },
        {
            "hc-key": "fr-f-il",
            "value": 38
        },
        {
            "hc-key": "fr-i-ju",
            "value": 39
        },
        {
            "hc-key": "fr-i-hn",
            "value": 40
        },
        {
            "hc-key": "fr-v-lr",
            "value": 41
        },
        {
            "hc-key": "fr-n-tg",
            "value": 42
        },
        {
            "hc-key": "fr-n-lo",
            "value": 43
        },
        {
            "hc-key": "fr-b-lg",
            "value": 44
        },
        {
            "hc-key": "fr-k-lz",
            "value": 45
        },
        {
            "hc-key": "fr-e-iv",
            "value": 46
        },
        {
            "hc-key": "fr-m-mm",
            "value": 47
        },
        {
            "hc-key": "fr-m-ms",
            "value": 48
        },
        {
            "hc-key": "fr-d-ni",
            "value": 49
        },
        {
            "hc-key": "fr-s-oi",
            "value": 50
        },
        {
            "hc-key": "fr-l-cz",
            "value": 51
        },
        {
            "hc-key": "fr-c-pd",
            "value": 52
        },
        {
            "hc-key": "fr-n-ge",
            "value": 53
        },
        {
            "hc-key": "fr-b-pa",
            "value": 54
        },
        {
            "hc-key": "fr-v-sv",
            "value": 55
        },
        {
            "hc-key": "fr-j-vp",
            "value": 56
        },
        {
            "hc-key": "fr-j-ss",
            "value": 57
        },
        {
            "hc-key": "fr-j-se",
            "value": 58
        },
        {
            "hc-key": "fr-j-vm",
            "value": 59
        },
        {
            "hc-key": "fr-s-so",
            "value": 60
        },
        {
            "hc-key": "fr-i-tb",
            "value": 61
        },
        {
            "hc-key": "fr-i-db",
            "value": 62
        },
        {
            "hc-key": "fr-j-vo",
            "value": 63
        },
        {
            "hc-key": "fr-m-vg",
            "value": 64
        },
        {
            "hc-key": "fr-j-yv",
            "value": 65
        },
        {
            "hc-key": "fr-f-lc",
            "value": 66
        },
        {
            "hc-key": "fr-h-cs",
            "value": 67
        },
        {
            "hc-key": "fr-e-fi",
            "value": 68
        },
        {
            "hc-key": "fr-h-hc",
            "value": 69
        },
        {
            "hc-key": "fr-p-mh",
            "value": 70
        },
        {
            "hc-key": "fr-g-an",
            "value": 71
        },
        {
            "hc-key": "fr-n-ag",
            "value": 72
        },
        {
            "hc-key": "fr-a-br",
            "value": 73
        },
        {
            "hc-key": "fr-p-cv",
            "value": 74
        },
        {
            "hc-key": "fr-c-cl",
            "value": 75
        },
        {
            "hc-key": "fr-e-ca",
            "value": 76
        },
        {
            "hc-key": "fr-b-gi",
            "value": 77
        },
        {
            "hc-key": "fr-a-hr",
            "value": 78
        },
        {
            "hc-key": "fr-n-hg",
            "value": 79
        },
        {
            "hc-key": "fr-v-hs",
            "value": 80
        },
        {
            "hc-key": "fr-k-he",
            "value": 81
        },
        {
            "hc-key": "fr-b-ld",
            "value": 82
        },
        {
            "hc-key": "fr-c-hl",
            "value": 83
        },
        {
            "hc-key": "fr-r-la",
            "value": 84
        },
        {
            "hc-key": "fr-f-lt",
            "value": 85
        },
        {
            "hc-key": "fr-m-mo",
            "value": 86
        },
        {
            "hc-key": "fr-o-pc",
            "value": 87
        },
        {
            "hc-key": "fr-k-po",
            "value": 88
        },
        {
            "hc-key": "fr-q-sm",
            "value": 89
        },
        {
            "hc-key": "fr-n-ta",
            "value": 90
        },
        {
            "hc-key": "fr-u-ha",
            "value": 91
        },
        {
            "hc-key": "fr-c-al",
            "value": 92
        },
        {
            "hc-key": "fr-r-my",
            "value": 93
        },
        {
            "hc-key": "fr-p-or",
            "value": 94
        },
        {
            "hc-key": "fr-d-yo",
            "value": 95
        },
        {
            "value": 96
        },
        {
            "hc-key": "fr-re-re",
            "value": 97
        },
        {
            "hc-key": "fr-yt-yt",
            "value": 98
        },
        {
            "hc-key": "fr-gf-gf",
            "value": 99
        },
        {
            "hc-key": "fr-mq-mq",
            "value": 100
        },
        {
            "hc-key": "fr-gp-gp",
            "value": 101
        },
        {
            "value": 102
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/fr-all-all.js">France, admin2</a>'
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
            mapData: Highcharts.maps['countries/fr/fr-all-all'],
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
            data: Highcharts.geojson(Highcharts.maps['countries/fr/fr-all-all'], 'mapline'),
            color: 'silver',
            showInLegend: false,
            enableMouseTracking: false
        }]
    });
});

$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "cn-sh",
            "value": 0
        },
        {
            "hc-key": "cn-zj",
            "value": 1
        },
        {
            "hc-key": "tw-ph",
            "value": 2
        },
        {
            "hc-key": "tw-km",
            "value": 3
        },
        {
            "hc-key": "tw-lk",
            "value": 4
        },
        {
            "hc-key": "tw-tw",
            "value": 5
        },
        {
            "hc-key": "tw-cs",
            "value": 6
        },
        {
            "hc-key": "cn-3664",
            "value": 7
        },
        {
            "hc-key": "cn-3681",
            "value": 8
        },
        {
            "hc-key": "tw-tp",
            "value": 9
        },
        {
            "hc-key": "tw-ch",
            "value": 10
        },
        {
            "hc-key": "tw-tt",
            "value": 11
        },
        {
            "hc-key": "tw-pt",
            "value": 12
        },
        {
            "hc-key": "cn-6657",
            "value": 13
        },
        {
            "hc-key": "cn-6663",
            "value": 14
        },
        {
            "hc-key": "cn-6665",
            "value": 15
        },
        {
            "hc-key": "cn-6666",
            "value": 16
        },
        {
            "hc-key": "cn-6667",
            "value": 17
        },
        {
            "hc-key": "cn-gs",
            "value": 18
        },
        {
            "hc-key": "cn-6669",
            "value": 19
        },
        {
            "hc-key": "cn-6670",
            "value": 20
        },
        {
            "hc-key": "cn-6671",
            "value": 21
        },
        {
            "hc-key": "tw-kh",
            "value": 22
        },
        {
            "hc-key": "tw-hs",
            "value": 23
        },
        {
            "hc-key": "tw-hh",
            "value": 24
        },
        {
            "hc-key": "cn-nx",
            "value": 25
        },
        {
            "hc-key": "cn-sa",
            "value": 26
        },
        {
            "hc-key": "tw-cl",
            "value": 27
        },
        {
            "hc-key": "cn-3682",
            "value": 28
        },
        {
            "hc-key": "tw-ml",
            "value": 29
        },
        {
            "hc-key": "cn-6655",
            "value": 30
        },
        {
            "hc-key": "cn-ah",
            "value": 31
        },
        {
            "hc-key": "cn-hu",
            "value": 32
        },
        {
            "hc-key": "tw-ty",
            "value": 33
        },
        {
            "hc-key": "cn-6656",
            "value": 34
        },
        {
            "hc-key": "tw-cg",
            "value": 35
        },
        {
            "hc-key": "cn-6658",
            "value": 36
        },
        {
            "hc-key": "tw-hl",
            "value": 37
        },
        {
            "hc-key": "tw-nt",
            "value": 38
        },
        {
            "hc-key": "tw-th",
            "value": 39
        },
        {
            "hc-key": "cn-6659",
            "value": 40
        },
        {
            "hc-key": "cn-6660",
            "value": 41
        },
        {
            "hc-key": "cn-6661",
            "value": 42
        },
        {
            "hc-key": "tw-yl",
            "value": 43
        },
        {
            "hc-key": "cn-6662",
            "value": 44
        },
        {
            "hc-key": "cn-6664",
            "value": 45
        },
        {
            "hc-key": "cn-6668",
            "value": 46
        },
        {
            "hc-key": "cn-gd",
            "value": 47
        },
        {
            "hc-key": "cn-fj",
            "value": 48
        },
        {
            "hc-key": "cn-bj",
            "value": 49
        },
        {
            "hc-key": "cn-hb",
            "value": 50
        },
        {
            "hc-key": "cn-sd",
            "value": 51
        },
        {
            "hc-key": "tw-tn",
            "value": 52
        },
        {
            "hc-key": "cn-tj",
            "value": 53
        },
        {
            "hc-key": "tw-il",
            "value": 54
        },
        {
            "hc-key": "cn-js",
            "value": 55
        },
        {
            "hc-key": "cn-ha",
            "value": 56
        },
        {
            "hc-key": "cn-qh",
            "value": 57
        },
        {
            "hc-key": "cn-jl",
            "value": 58
        },
        {
            "hc-key": "cn-xz",
            "value": 59
        },
        {
            "hc-key": "cn-xj",
            "value": 60
        },
        {
            "hc-key": "cn-he",
            "value": 61
        },
        {
            "hc-key": "cn-nm",
            "value": 62
        },
        {
            "hc-key": "cn-hl",
            "value": 63
        },
        {
            "hc-key": "cn-yn",
            "value": 64
        },
        {
            "hc-key": "cn-gx",
            "value": 65
        },
        {
            "hc-key": "cn-ln",
            "value": 66
        },
        {
            "hc-key": "cn-sc",
            "value": 67
        },
        {
            "hc-key": "cn-cq",
            "value": 68
        },
        {
            "hc-key": "cn-gz",
            "value": 69
        },
        {
            "hc-key": "cn-hn",
            "value": 70
        },
        {
            "hc-key": "cn-sx",
            "value": 71
        },
        {
            "hc-key": "cn-jx",
            "value": 72
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cn/custom/cn-all-sar-taiwan.js">China with Hong Kong, Macau, and Taiwan</a>'
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
            mapData: Highcharts.maps['countries/cn/custom/cn-all-sar-taiwan'],
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

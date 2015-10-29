$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ru-3637",
            "value": 0
        },
        {
            "hc-key": "ru-ck",
            "value": 1
        },
        {
            "hc-key": "ru-ar",
            "value": 2
        },
        {
            "hc-key": "ru-nn",
            "value": 3
        },
        {
            "hc-key": "ru-yn",
            "value": 4
        },
        {
            "hc-key": "ru-ky",
            "value": 5
        },
        {
            "hc-key": "ru-sk",
            "value": 6
        },
        {
            "hc-key": "ru-kh",
            "value": 7
        },
        {
            "hc-key": "ru-sl",
            "value": 8
        },
        {
            "hc-key": "ru-ka",
            "value": 9
        },
        {
            "hc-key": "ru-kt",
            "value": 10
        },
        {
            "hc-key": "ru-2510",
            "value": 11
        },
        {
            "hc-key": "ru-rz",
            "value": 12
        },
        {
            "hc-key": "ru-sa",
            "value": 13
        },
        {
            "hc-key": "ru-ul",
            "value": 14
        },
        {
            "hc-key": "ru-om",
            "value": 15
        },
        {
            "hc-key": "ru-ns",
            "value": 16
        },
        {
            "hc-key": "ru-mm",
            "value": 17
        },
        {
            "hc-key": "ru-ln",
            "value": 18
        },
        {
            "hc-key": "ru-sp",
            "value": 19
        },
        {
            "hc-key": "ru-ki",
            "value": 20
        },
        {
            "hc-key": "ru-kc",
            "value": 21
        },
        {
            "hc-key": "ru-in",
            "value": 22
        },
        {
            "hc-key": "ru-kb",
            "value": 23
        },
        {
            "hc-key": "ru-no",
            "value": 24
        },
        {
            "hc-key": "ru-st",
            "value": 25
        },
        {
            "hc-key": "ru-sm",
            "value": 26
        },
        {
            "hc-key": "ru-ps",
            "value": 27
        },
        {
            "hc-key": "ru-tv",
            "value": 28
        },
        {
            "hc-key": "ru-vo",
            "value": 29
        },
        {
            "hc-key": "ru-iv",
            "value": 30
        },
        {
            "hc-key": "ru-ys",
            "value": 31
        },
        {
            "hc-key": "ru-kg",
            "value": 32
        },
        {
            "hc-key": "ru-br",
            "value": 33
        },
        {
            "hc-key": "ru-ks",
            "value": 34
        },
        {
            "hc-key": "ru-lp",
            "value": 35
        },
        {
            "hc-key": "ru-ms",
            "value": 36
        },
        {
            "hc-key": "ru-ol",
            "value": 37
        },
        {
            "hc-key": "ru-nz",
            "value": 38
        },
        {
            "hc-key": "ru-pz",
            "value": 39
        },
        {
            "hc-key": "ru-vl",
            "value": 40
        },
        {
            "hc-key": "ru-vr",
            "value": 41
        },
        {
            "hc-key": "ru-ko",
            "value": 42
        },
        {
            "hc-key": "ru-sv",
            "value": 43
        },
        {
            "hc-key": "ru-bk",
            "value": 44
        },
        {
            "hc-key": "ru-ud",
            "value": 45
        },
        {
            "hc-key": "ru-mr",
            "value": 46
        },
        {
            "hc-key": "ru-cv",
            "value": 47
        },
        {
            "hc-key": "ru-cl",
            "value": 48
        },
        {
            "hc-key": "ru-ob",
            "value": 49
        },
        {
            "hc-key": "ru-sr",
            "value": 50
        },
        {
            "hc-key": "ru-tt",
            "value": 51
        },
        {
            "hc-key": "ru-to",
            "value": 52
        },
        {
            "hc-key": "ru-ty",
            "value": 53
        },
        {
            "hc-key": "ru-ga",
            "value": 54
        },
        {
            "hc-key": "ru-kk",
            "value": 55
        },
        {
            "hc-key": "ru-cn",
            "value": 56
        },
        {
            "hc-key": "ru-kl",
            "value": 57
        },
        {
            "hc-key": "ru-da",
            "value": 58
        },
        {
            "hc-key": "ru-ro",
            "value": 59
        },
        {
            "hc-key": "ru-bl",
            "value": 60
        },
        {
            "hc-key": "ru-tu",
            "value": 61
        },
        {
            "hc-key": "ru-ir",
            "value": 62
        },
        {
            "hc-key": "ru-ct",
            "value": 63
        },
        {
            "hc-key": "ru-yv",
            "value": 64
        },
        {
            "hc-key": "ru-am",
            "value": 65
        },
        {
            "hc-key": "ru-tb",
            "value": 66
        },
        {
            "hc-key": "ru-tl",
            "value": 67
        },
        {
            "hc-key": "ru-ng",
            "value": 68
        },
        {
            "hc-key": "ru-vg",
            "value": 69
        },
        {
            "hc-key": "ru-kv",
            "value": 70
        },
        {
            "hc-key": "ru-me",
            "value": 71
        },
        {
            "hc-key": "ru-ke",
            "value": 72
        },
        {
            "hc-key": "ru-as",
            "value": 73
        },
        {
            "hc-key": "ru-pr",
            "value": 74
        },
        {
            "hc-key": "ru-mg",
            "value": 75
        },
        {
            "hc-key": "ru-bu",
            "value": 76
        },
        {
            "hc-key": "ru-kn",
            "value": 77
        },
        {
            "hc-key": "ru-kd",
            "value": 78
        },
        {
            "hc-key": "ru-ku",
            "value": 79
        },
        {
            "hc-key": "ru-al",
            "value": 80
        },
        {
            "hc-key": "ru-km",
            "value": 81
        },
        {
            "hc-key": "ru-pe",
            "value": 82
        },
        {
            "hc-key": "ru-ad",
            "value": 83
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ru/ru-all.js">Russia</a>'
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
            mapData: Highcharts.maps['countries/ru/ru-all'],
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

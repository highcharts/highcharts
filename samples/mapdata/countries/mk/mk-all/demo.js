$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "mk-vv",
            "value": 0
        },
        {
            "hc-key": "mk-ar",
            "value": 1
        },
        {
            "hc-key": "mk-li",
            "value": 2
        },
        {
            "hc-key": "mk-cz",
            "value": 3
        },
        {
            "hc-key": "mk-dm",
            "value": 4
        },
        {
            "hc-key": "mk-od",
            "value": 5
        },
        {
            "hc-key": "mk-3086",
            "value": 6
        },
        {
            "hc-key": "mk-pp",
            "value": 7
        },
        {
            "hc-key": "mk-aj",
            "value": 8
        },
        {
            "hc-key": "mk-st",
            "value": 9
        },
        {
            "hc-key": "mk-pt",
            "value": 10
        },
        {
            "hc-key": "mk-pe",
            "value": 11
        },
        {
            "hc-key": "mk-su",
            "value": 12
        },
        {
            "hc-key": "mk-sl",
            "value": 13
        },
        {
            "hc-key": "mk-pn",
            "value": 14
        },
        {
            "hc-key": "mk-vc",
            "value": 15
        },
        {
            "hc-key": "mk-bu",
            "value": 16
        },
        {
            "hc-key": "mk-ci",
            "value": 17
        },
        {
            "hc-key": "mk-ng",
            "value": 18
        },
        {
            "hc-key": "mk-rm",
            "value": 19
        },
        {
            "hc-key": "mk-ce",
            "value": 20
        },
        {
            "hc-key": "mk-zr",
            "value": 21
        },
        {
            "hc-key": "mk-ch",
            "value": 22
        },
        {
            "hc-key": "mk-cs",
            "value": 23
        },
        {
            "hc-key": "mk-gb",
            "value": 24
        },
        {
            "hc-key": "mk-gr",
            "value": 25
        },
        {
            "hc-key": "mk-lo",
            "value": 26
        },
        {
            "hc-key": "mk-dk",
            "value": 27
        },
        {
            "hc-key": "mk-kn",
            "value": 28
        },
        {
            "hc-key": "mk-kx",
            "value": 29
        },
        {
            "hc-key": "mk-ca",
            "value": 30
        },
        {
            "hc-key": "mk-av",
            "value": 31
        },
        {
            "hc-key": "mk-ad",
            "value": 32
        },
        {
            "hc-key": "mk-ss",
            "value": 33
        },
        {
            "hc-key": "mk-vd",
            "value": 34
        },
        {
            "hc-key": "mk-ky",
            "value": 35
        },
        {
            "hc-key": "mk-tl",
            "value": 36
        },
        {
            "hc-key": "mk-ks",
            "value": 37
        },
        {
            "hc-key": "mk-um",
            "value": 38
        },
        {
            "hc-key": "mk-ze",
            "value": 39
        },
        {
            "hc-key": "mk-md",
            "value": 40
        },
        {
            "hc-key": "mk-gp",
            "value": 41
        },
        {
            "hc-key": "mk-kh",
            "value": 42
        },
        {
            "hc-key": "mk-os",
            "value": 43
        },
        {
            "hc-key": "mk-vh",
            "value": 44
        },
        {
            "hc-key": "mk-vj",
            "value": 45
        },
        {
            "hc-key": "mk-et",
            "value": 46
        },
        {
            "hc-key": "mk-bn",
            "value": 47
        },
        {
            "hc-key": "mk-gt",
            "value": 48
        },
        {
            "hc-key": "mk-jg",
            "value": 49
        },
        {
            "hc-key": "mk-ru",
            "value": 50
        },
        {
            "hc-key": "mk-va",
            "value": 51
        },
        {
            "hc-key": "mk-bg",
            "value": 52
        },
        {
            "hc-key": "mk-ns",
            "value": 53
        },
        {
            "hc-key": "mk-br",
            "value": 54
        },
        {
            "hc-key": "mk-ni",
            "value": 55
        },
        {
            "hc-key": "mk-rv",
            "value": 56
        },
        {
            "hc-key": "mk-dr",
            "value": 57
        },
        {
            "hc-key": "mk-ug",
            "value": 58
        },
        {
            "hc-key": "mk-db",
            "value": 59
        },
        {
            "hc-key": "mk-re",
            "value": 60
        },
        {
            "hc-key": "mk-kz",
            "value": 61
        },
        {
            "hc-key": "mk-kb",
            "value": 62
        },
        {
            "hc-key": "mk-na",
            "value": 63
        },
        {
            "hc-key": "mk-nv",
            "value": 64
        },
        {
            "hc-key": "mk-mr",
            "value": 65
        },
        {
            "hc-key": "mk-tr",
            "value": 66
        },
        {
            "hc-key": "mk-gv",
            "value": 67
        },
        {
            "hc-key": "mk-sd",
            "value": 68
        },
        {
            "hc-key": "mk-dl",
            "value": 69
        },
        {
            "hc-key": "mk-oc",
            "value": 70
        },
        {
            "hc-key": "mk-mk",
            "value": 71
        },
        {
            "hc-key": "mk-ph",
            "value": 72
        },
        {
            "hc-key": "mk-rn",
            "value": 73
        },
        {
            "hc-key": "mk-il",
            "value": 74
        },
        {
            "hc-key": "mk-ve",
            "value": 75
        },
        {
            "hc-key": "mk-zk",
            "value": 76
        },
        {
            "hc-key": "mk-so",
            "value": 77
        },
        {
            "hc-key": "mk-de",
            "value": 78
        },
        {
            "hc-key": "mk-kg",
            "value": 79
        },
        {
            "hc-key": "mk-mg",
            "value": 80
        },
        {
            "hc-key": "mk-za",
            "value": 81
        },
        {
            "hc-key": "mk-vl",
            "value": 82
        },
        {
            "hc-key": "mk-bs",
            "value": 83
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/mk/mk-all.js">Macedonia</a>'
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
            mapData: Highcharts.maps['countries/mk/mk-all'],
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

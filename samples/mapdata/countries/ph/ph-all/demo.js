$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ph-mn",
            "value": 0
        },
        {
            "hc-key": "ph-4218",
            "value": 1
        },
        {
            "hc-key": "ph-tt",
            "value": 2
        },
        {
            "hc-key": "ph-bo",
            "value": 3
        },
        {
            "hc-key": "ph-cb",
            "value": 4
        },
        {
            "hc-key": "ph-bs",
            "value": 5
        },
        {
            "hc-key": "ph-2603",
            "value": 6
        },
        {
            "hc-key": "ph-su",
            "value": 7
        },
        {
            "hc-key": "ph-aq",
            "value": 8
        },
        {
            "hc-key": "ph-pl",
            "value": 9
        },
        {
            "hc-key": "ph-ro",
            "value": 10
        },
        {
            "hc-key": "ph-al",
            "value": 11
        },
        {
            "hc-key": "ph-cs",
            "value": 12
        },
        {
            "hc-key": "ph-6999",
            "value": 13
        },
        {
            "hc-key": "ph-bn",
            "value": 14
        },
        {
            "hc-key": "ph-cg",
            "value": 15
        },
        {
            "hc-key": "ph-pn",
            "value": 16
        },
        {
            "hc-key": "ph-bt",
            "value": 17
        },
        {
            "hc-key": "ph-mc",
            "value": 18
        },
        {
            "hc-key": "ph-qz",
            "value": 19
        },
        {
            "hc-key": "ph-es",
            "value": 20
        },
        {
            "hc-key": "ph-le",
            "value": 21
        },
        {
            "hc-key": "ph-sm",
            "value": 22
        },
        {
            "hc-key": "ph-ns",
            "value": 23
        },
        {
            "hc-key": "ph-cm",
            "value": 24
        },
        {
            "hc-key": "ph-di",
            "value": 25
        },
        {
            "hc-key": "ph-ds",
            "value": 26
        },
        {
            "hc-key": "ph-6457",
            "value": 27
        },
        {
            "hc-key": "ph-6985",
            "value": 28
        },
        {
            "hc-key": "ph-7017",
            "value": 29
        },
        {
            "hc-key": "ph-7021",
            "value": 30
        },
        {
            "hc-key": "ph-lg",
            "value": 31
        },
        {
            "hc-key": "ph-ri",
            "value": 32
        },
        {
            "hc-key": "ph-ln",
            "value": 33
        },
        {
            "hc-key": "ph-6991",
            "value": 34
        },
        {
            "hc-key": "ph-ls",
            "value": 35
        },
        {
            "hc-key": "ph-nc",
            "value": 36
        },
        {
            "hc-key": "ph-mg",
            "value": 37
        },
        {
            "hc-key": "ph-sk",
            "value": 38
        },
        {
            "hc-key": "ph-sc",
            "value": 39
        },
        {
            "hc-key": "ph-sg",
            "value": 40
        },
        {
            "hc-key": "ph-an",
            "value": 41
        },
        {
            "hc-key": "ph-ss",
            "value": 42
        },
        {
            "hc-key": "ph-as",
            "value": 43
        },
        {
            "hc-key": "ph-do",
            "value": 44
        },
        {
            "hc-key": "ph-dv",
            "value": 45
        },
        {
            "hc-key": "ph-bk",
            "value": 46
        },
        {
            "hc-key": "ph-cl",
            "value": 47
        },
        {
            "hc-key": "ph-2658",
            "value": 48
        },
        {
            "hc-key": "ph-ap",
            "value": 49
        },
        {
            "hc-key": "ph-6983",
            "value": 50
        },
        {
            "hc-key": "ph-6984",
            "value": 51
        },
        {
            "hc-key": "ph-6987",
            "value": 52
        },
        {
            "hc-key": "ph-6986",
            "value": 53
        },
        {
            "hc-key": "ph-6988",
            "value": 54
        },
        {
            "hc-key": "ph-6989",
            "value": 55
        },
        {
            "hc-key": "ph-6990",
            "value": 56
        },
        {
            "hc-key": "ph-6992",
            "value": 57
        },
        {
            "hc-key": "ph-6995",
            "value": 58
        },
        {
            "hc-key": "ph-6997",
            "value": 59
        },
        {
            "hc-key": "ph-6998",
            "value": 60
        },
        {
            "hc-key": "ph-7018",
            "value": 61
        },
        {
            "hc-key": "ph-7022",
            "value": 62
        },
        {
            "hc-key": "ph-1852",
            "value": 63
        },
        {
            "hc-key": "ph-7000",
            "value": 64
        },
        {
            "hc-key": "ph-7001",
            "value": 65
        },
        {
            "hc-key": "ph-7002",
            "value": 66
        },
        {
            "hc-key": "ph-7003",
            "value": 67
        },
        {
            "hc-key": "ph-7004",
            "value": 68
        },
        {
            "hc-key": "ph-7006",
            "value": 69
        },
        {
            "hc-key": "ph-7007",
            "value": 70
        },
        {
            "hc-key": "ph-7008",
            "value": 71
        },
        {
            "hc-key": "ph-7009",
            "value": 72
        },
        {
            "hc-key": "ph-7010",
            "value": 73
        },
        {
            "hc-key": "ph-7011",
            "value": 74
        },
        {
            "hc-key": "ph-7012",
            "value": 75
        },
        {
            "hc-key": "ph-7013",
            "value": 76
        },
        {
            "hc-key": "ph-7014",
            "value": 77
        },
        {
            "hc-key": "ph-7015",
            "value": 78
        },
        {
            "hc-key": "ph-7016",
            "value": 79
        },
        {
            "hc-key": "ph-7019",
            "value": 80
        },
        {
            "hc-key": "ph-6456",
            "value": 81
        },
        {
            "hc-key": "ph-zs",
            "value": 82
        },
        {
            "hc-key": "ph-6996",
            "value": 83
        },
        {
            "hc-key": "ph-nd",
            "value": 84
        },
        {
            "hc-key": "ph-zn",
            "value": 85
        },
        {
            "hc-key": "ph-md",
            "value": 86
        },
        {
            "hc-key": "ph-cp",
            "value": 87
        },
        {
            "hc-key": "ph-ii",
            "value": 88
        },
        {
            "hc-key": "ph-ab",
            "value": 89
        },
        {
            "hc-key": "ph-au",
            "value": 90
        },
        {
            "hc-key": "ph-ib",
            "value": 91
        },
        {
            "hc-key": "ph-7020",
            "value": 92
        },
        {
            "hc-key": "ph-if",
            "value": 93
        },
        {
            "hc-key": "ph-mt",
            "value": 94
        },
        {
            "hc-key": "ph-nv",
            "value": 95
        },
        {
            "hc-key": "ph-qr",
            "value": 96
        },
        {
            "hc-key": "ph-ba",
            "value": 97
        },
        {
            "hc-key": "ph-ne",
            "value": 98
        },
        {
            "hc-key": "ph-pm",
            "value": 99
        },
        {
            "hc-key": "ph-bg",
            "value": 100
        },
        {
            "hc-key": "ph-zm",
            "value": 101
        },
        {
            "hc-key": "ph-cv",
            "value": 102
        },
        {
            "hc-key": "ph-bu",
            "value": 103
        },
        {
            "hc-key": "ph-mr",
            "value": 104
        },
        {
            "hc-key": "ph-sq",
            "value": 105
        },
        {
            "hc-key": "ph-gu",
            "value": 106
        },
        {
            "hc-key": "ph-ct",
            "value": 107
        },
        {
            "hc-key": "ph-mb",
            "value": 108
        },
        {
            "hc-key": "ph-mq",
            "value": 109
        },
        {
            "hc-key": "ph-bi",
            "value": 110
        },
        {
            "hc-key": "ph-sl",
            "value": 111
        },
        {
            "hc-key": "ph-nr",
            "value": 112
        },
        {
            "hc-key": "ph-ak",
            "value": 113
        },
        {
            "hc-key": "ph-cn",
            "value": 114
        },
        {
            "hc-key": "ph-sr",
            "value": 115
        },
        {
            "hc-key": "ph-in",
            "value": 116
        },
        {
            "hc-key": "ph-is",
            "value": 117
        },
        {
            "hc-key": "ph-tr",
            "value": 118
        },
        {
            "hc-key": "ph-lu",
            "value": 119
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ph/ph-all.js">Philippines</a>'
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
            mapData: Highcharts.maps['countries/ph/ph-all'],
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

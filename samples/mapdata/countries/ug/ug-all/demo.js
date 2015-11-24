$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ug-2595",
            "value": 0
        },
        {
            "hc-key": "ug-7073",
            "value": 1
        },
        {
            "hc-key": "ug-7074",
            "value": 2
        },
        {
            "hc-key": "ug-7075",
            "value": 3
        },
        {
            "hc-key": "ug-2785",
            "value": 4
        },
        {
            "hc-key": "ug-2791",
            "value": 5
        },
        {
            "hc-key": "ug-3385",
            "value": 6
        },
        {
            "hc-key": "ug-3388",
            "value": 7
        },
        {
            "hc-key": "ug-2786",
            "value": 8
        },
        {
            "hc-key": "ug-7056",
            "value": 9
        },
        {
            "hc-key": "ug-7083",
            "value": 10
        },
        {
            "hc-key": "ug-7084",
            "value": 11
        },
        {
            "hc-key": "ug-7058",
            "value": 12
        },
        {
            "hc-key": "ug-1678",
            "value": 13
        },
        {
            "hc-key": "ug-1682",
            "value": 14
        },
        {
            "hc-key": "ug-1683",
            "value": 15
        },
        {
            "hc-key": "ug-1685",
            "value": 16
        },
        {
            "hc-key": "ug-7051",
            "value": 17
        },
        {
            "hc-key": "ug-2762",
            "value": 18
        },
        {
            "hc-key": "ug-2767",
            "value": 19
        },
        {
            "hc-key": "ug-2777",
            "value": 20
        },
        {
            "hc-key": "ug-2778",
            "value": 21
        },
        {
            "hc-key": "ug-2780",
            "value": 22
        },
        {
            "hc-key": "ug-2781",
            "value": 23
        },
        {
            "hc-key": "ug-2782",
            "value": 24
        },
        {
            "hc-key": "ug-2783",
            "value": 25
        },
        {
            "hc-key": "ug-2779",
            "value": 26
        },
        {
            "hc-key": "ug-2784",
            "value": 27
        },
        {
            "hc-key": "ug-3382",
            "value": 28
        },
        {
            "hc-key": "ug-3384",
            "value": 29
        },
        {
            "hc-key": "ug-3389",
            "value": 30
        },
        {
            "hc-key": "ug-3383",
            "value": 31
        },
        {
            "hc-key": "ug-3390",
            "value": 32
        },
        {
            "hc-key": "ug-3386",
            "value": 33
        },
        {
            "hc-key": "ug-3391",
            "value": 34
        },
        {
            "hc-key": "ug-3392",
            "value": 35
        },
        {
            "hc-key": "ug-3394",
            "value": 36
        },
        {
            "hc-key": "ug-2750",
            "value": 37
        },
        {
            "hc-key": "ug-7048",
            "value": 38
        },
        {
            "hc-key": "ug-7080",
            "value": 39
        },
        {
            "hc-key": "ug-7081",
            "value": 40
        },
        {
            "hc-key": "ug-1684",
            "value": 41
        },
        {
            "hc-key": "ug-7082",
            "value": 42
        },
        {
            "hc-key": "ug-1688",
            "value": 43
        },
        {
            "hc-key": "ug-7079",
            "value": 44
        },
        {
            "hc-key": "ug-7068",
            "value": 45
        },
        {
            "hc-key": "ug-7070",
            "value": 46
        },
        {
            "hc-key": "ug-7049",
            "value": 47
        },
        {
            "hc-key": "ug-2787",
            "value": 48
        },
        {
            "hc-key": "ug-7055",
            "value": 49
        },
        {
            "hc-key": "ug-2769",
            "value": 50
        },
        {
            "hc-key": "ug-7052",
            "value": 51
        },
        {
            "hc-key": "ug-2774",
            "value": 52
        },
        {
            "hc-key": "ug-7059",
            "value": 53
        },
        {
            "hc-key": "ug-7060",
            "value": 54
        },
        {
            "hc-key": "ug-7057",
            "value": 55
        },
        {
            "hc-key": "ug-2790",
            "value": 56
        },
        {
            "hc-key": "ug-2776",
            "value": 57
        },
        {
            "hc-key": "ug-7067",
            "value": 58
        },
        {
            "hc-key": "ug-7065",
            "value": 59
        },
        {
            "hc-key": "ug-7066",
            "value": 60
        },
        {
            "hc-key": "ug-7069",
            "value": 61
        },
        {
            "hc-key": "ug-7061",
            "value": 62
        },
        {
            "hc-key": "ug-7063",
            "value": 63
        },
        {
            "hc-key": "ug-7062",
            "value": 64
        },
        {
            "hc-key": "ug-7064",
            "value": 65
        },
        {
            "hc-key": "ug-7086",
            "value": 66
        },
        {
            "hc-key": "ug-2744",
            "value": 67
        },
        {
            "hc-key": "ug-1679",
            "value": 68
        },
        {
            "hc-key": "ug-1680",
            "value": 69
        },
        {
            "hc-key": "ug-7054",
            "value": 70
        },
        {
            "hc-key": "ug-1686",
            "value": 71
        },
        {
            "hc-key": "ug-7078",
            "value": 72
        },
        {
            "hc-key": "ug-1677",
            "value": 73
        },
        {
            "hc-key": "ug-1690",
            "value": 74
        },
        {
            "hc-key": "ug-2745",
            "value": 75
        },
        {
            "hc-key": "ug-2752",
            "value": 76
        },
        {
            "hc-key": "ug-2754",
            "value": 77
        },
        {
            "hc-key": "ug-1687",
            "value": 78
        },
        {
            "hc-key": "ug-2757",
            "value": 79
        },
        {
            "hc-key": "ug-1689",
            "value": 80
        },
        {
            "hc-key": "ug-2760",
            "value": 81
        },
        {
            "hc-key": "ug-2761",
            "value": 82
        },
        {
            "hc-key": "ug-2766",
            "value": 83
        },
        {
            "hc-key": "ug-2765",
            "value": 84
        },
        {
            "hc-key": "ug-2764",
            "value": 85
        },
        {
            "hc-key": "ug-2749",
            "value": 86
        },
        {
            "hc-key": "ug-2768",
            "value": 87
        },
        {
            "hc-key": "ug-2763",
            "value": 88
        },
        {
            "hc-key": "ug-2748",
            "value": 89
        },
        {
            "hc-key": "ug-2771",
            "value": 90
        },
        {
            "hc-key": "ug-2772",
            "value": 91
        },
        {
            "hc-key": "ug-2775",
            "value": 92
        },
        {
            "hc-key": "ug-2788",
            "value": 93
        },
        {
            "hc-key": "ug-2789",
            "value": 94
        },
        {
            "hc-key": "ug-3381",
            "value": 95
        },
        {
            "hc-key": "ug-3387",
            "value": 96
        },
        {
            "hc-key": "ug-3393",
            "value": 97
        },
        {
            "hc-key": "ug-7076",
            "value": 98
        },
        {
            "hc-key": "ug-1681",
            "value": 99
        },
        {
            "hc-key": "ug-2746",
            "value": 100
        },
        {
            "hc-key": "ug-2747",
            "value": 101
        },
        {
            "hc-key": "ug-2751",
            "value": 102
        },
        {
            "hc-key": "ug-2758",
            "value": 103
        },
        {
            "hc-key": "ug-2759",
            "value": 104
        },
        {
            "hc-key": "ug-2756",
            "value": 105
        },
        {
            "hc-key": "ug-2770",
            "value": 106
        },
        {
            "hc-key": "ug-7072",
            "value": 107
        },
        {
            "hc-key": "ug-7053",
            "value": 108
        },
        {
            "hc-key": "ug-2753",
            "value": 109
        },
        {
            "hc-key": "ug-2755",
            "value": 110
        },
        {
            "hc-key": "ug-2773",
            "value": 111
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ug/ug-all.js">Uganda</a>'
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
            mapData: Highcharts.maps['countries/ug/ug-all'],
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

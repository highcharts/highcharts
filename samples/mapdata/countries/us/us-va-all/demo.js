$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-va-510",
            "value": 0
        },
        {
            "hc-key": "us-va-001",
            "value": 1
        },
        {
            "hc-key": "us-va-013",
            "value": 2
        },
        {
            "hc-key": "us-va-131",
            "value": 3
        },
        {
            "hc-key": "us-va-600",
            "value": 4
        },
        {
            "hc-key": "us-va-059",
            "value": 5
        },
        {
            "hc-key": "us-va-690",
            "value": 6
        },
        {
            "hc-key": "us-va-750",
            "value": 7
        },
        {
            "hc-key": "us-va-595",
            "value": 8
        },
        {
            "hc-key": "us-va-678",
            "value": 9
        },
        {
            "hc-key": "us-va-530",
            "value": 10
        },
        {
            "hc-key": "us-va-051",
            "value": 11
        },
        {
            "hc-key": "us-va-167",
            "value": 12
        },
        {
            "hc-key": "us-va-153",
            "value": 13
        },
        {
            "hc-key": "us-va-840",
            "value": 14
        },
        {
            "hc-key": "us-va-085",
            "value": 15
        },
        {
            "hc-key": "us-va-075",
            "value": 16
        },
        {
            "hc-key": "us-va-031",
            "value": 17
        },
        {
            "hc-key": "us-va-037",
            "value": 18
        },
        {
            "hc-key": "us-va-720",
            "value": 19
        },
        {
            "hc-key": "us-va-800",
            "value": 20
        },
        {
            "hc-key": "us-va-061",
            "value": 21
        },
        {
            "hc-key": "us-va-520",
            "value": 22
        },
        {
            "hc-key": "us-va-515",
            "value": 23
        },
        {
            "hc-key": "us-va-035",
            "value": 24
        },
        {
            "hc-key": "us-va-580",
            "value": 25
        },
        {
            "hc-key": "us-va-005",
            "value": 26
        },
        {
            "hc-key": "us-va-045",
            "value": 27
        },
        {
            "hc-key": "us-va-083",
            "value": 28
        },
        {
            "hc-key": "us-va-015",
            "value": 29
        },
        {
            "hc-key": "us-va-003",
            "value": 30
        },
        {
            "hc-key": "us-va-540",
            "value": 31
        },
        {
            "hc-key": "us-va-033",
            "value": 32
        },
        {
            "hc-key": "us-va-101",
            "value": 33
        },
        {
            "hc-key": "us-va-740",
            "value": 34
        },
        {
            "hc-key": "us-va-195",
            "value": 35
        },
        {
            "hc-key": "us-va-105",
            "value": 36
        },
        {
            "hc-key": "us-va-077",
            "value": 37
        },
        {
            "hc-key": "us-va-193",
            "value": 38
        },
        {
            "hc-key": "us-va-057",
            "value": 39
        },
        {
            "hc-key": "us-va-113",
            "value": 40
        },
        {
            "hc-key": "us-va-157",
            "value": 41
        },
        {
            "hc-key": "us-va-735",
            "value": 42
        },
        {
            "hc-key": "us-va-199",
            "value": 43
        },
        {
            "hc-key": "us-va-640",
            "value": 44
        },
        {
            "hc-key": "us-va-685",
            "value": 45
        },
        {
            "hc-key": "us-va-683",
            "value": 46
        },
        {
            "hc-key": "us-va-053",
            "value": 47
        },
        {
            "hc-key": "us-va-081",
            "value": 48
        },
        {
            "hc-key": "us-va-087",
            "value": 49
        },
        {
            "hc-key": "us-va-071",
            "value": 50
        },
        {
            "hc-key": "us-va-121",
            "value": 51
        },
        {
            "hc-key": "us-va-179",
            "value": 52
        },
        {
            "hc-key": "us-va-630",
            "value": 53
        },
        {
            "hc-key": "us-va-047",
            "value": 54
        },
        {
            "hc-key": "us-va-550",
            "value": 55
        },
        {
            "hc-key": "us-va-710",
            "value": 56
        },
        {
            "hc-key": "us-va-155",
            "value": 57
        },
        {
            "hc-key": "us-va-063",
            "value": 58
        },
        {
            "hc-key": "us-va-021",
            "value": 59
        },
        {
            "hc-key": "us-va-115",
            "value": 60
        },
        {
            "hc-key": "us-va-073",
            "value": 61
        },
        {
            "hc-key": "us-va-097",
            "value": 62
        },
        {
            "hc-key": "us-va-119",
            "value": 63
        },
        {
            "hc-key": "us-va-041",
            "value": 64
        },
        {
            "hc-key": "us-va-570",
            "value": 65
        },
        {
            "hc-key": "us-va-149",
            "value": 66
        },
        {
            "hc-key": "us-va-670",
            "value": 67
        },
        {
            "hc-key": "us-va-730",
            "value": 68
        },
        {
            "hc-key": "us-va-775",
            "value": 69
        },
        {
            "hc-key": "us-va-770",
            "value": 70
        },
        {
            "hc-key": "us-va-065",
            "value": 71
        },
        {
            "hc-key": "us-va-049",
            "value": 72
        },
        {
            "hc-key": "us-va-007",
            "value": 73
        },
        {
            "hc-key": "us-va-147",
            "value": 74
        },
        {
            "hc-key": "us-va-650",
            "value": 75
        },
        {
            "hc-key": "us-va-187",
            "value": 76
        },
        {
            "hc-key": "us-va-069",
            "value": 77
        },
        {
            "hc-key": "us-va-163",
            "value": 78
        },
        {
            "hc-key": "us-va-125",
            "value": 79
        },
        {
            "hc-key": "us-va-036",
            "value": 80
        },
        {
            "hc-key": "us-va-111",
            "value": 81
        },
        {
            "hc-key": "us-va-173",
            "value": 82
        },
        {
            "hc-key": "us-va-093",
            "value": 83
        },
        {
            "hc-key": "us-va-175",
            "value": 84
        },
        {
            "hc-key": "us-va-620",
            "value": 85
        },
        {
            "hc-key": "us-va-099",
            "value": 86
        },
        {
            "hc-key": "us-va-191",
            "value": 87
        },
        {
            "hc-key": "us-va-095",
            "value": 88
        },
        {
            "hc-key": "us-va-830",
            "value": 89
        },
        {
            "hc-key": "us-va-177",
            "value": 90
        },
        {
            "hc-key": "us-va-810",
            "value": 91
        },
        {
            "hc-key": "us-va-137",
            "value": 92
        },
        {
            "hc-key": "us-va-127",
            "value": 93
        },
        {
            "hc-key": "us-va-159",
            "value": 94
        },
        {
            "hc-key": "us-va-019",
            "value": 95
        },
        {
            "hc-key": "us-va-009",
            "value": 96
        },
        {
            "hc-key": "us-va-011",
            "value": 97
        },
        {
            "hc-key": "us-va-680",
            "value": 98
        },
        {
            "hc-key": "us-va-610",
            "value": 99
        },
        {
            "hc-key": "us-va-161",
            "value": 100
        },
        {
            "hc-key": "us-va-590",
            "value": 101
        },
        {
            "hc-key": "us-va-023",
            "value": 102
        },
        {
            "hc-key": "us-va-143",
            "value": 103
        },
        {
            "hc-key": "us-va-165",
            "value": 104
        },
        {
            "hc-key": "us-va-029",
            "value": 105
        },
        {
            "hc-key": "us-va-043",
            "value": 106
        },
        {
            "hc-key": "us-va-700",
            "value": 107
        },
        {
            "hc-key": "us-va-017",
            "value": 108
        },
        {
            "hc-key": "us-va-185",
            "value": 109
        },
        {
            "hc-key": "us-va-107",
            "value": 110
        },
        {
            "hc-key": "us-va-091",
            "value": 111
        },
        {
            "hc-key": "us-va-089",
            "value": 112
        },
        {
            "hc-key": "us-va-169",
            "value": 113
        },
        {
            "hc-key": "us-va-025",
            "value": 114
        },
        {
            "hc-key": "us-va-027",
            "value": 115
        },
        {
            "hc-key": "us-va-135",
            "value": 116
        },
        {
            "hc-key": "us-va-067",
            "value": 117
        },
        {
            "hc-key": "us-va-109",
            "value": 118
        },
        {
            "hc-key": "us-va-181",
            "value": 119
        },
        {
            "hc-key": "us-va-183",
            "value": 120
        },
        {
            "hc-key": "us-va-103",
            "value": 121
        },
        {
            "hc-key": "us-va-117",
            "value": 122
        },
        {
            "hc-key": "us-va-171",
            "value": 123
        },
        {
            "hc-key": "us-va-133",
            "value": 124
        },
        {
            "hc-key": "us-va-141",
            "value": 125
        },
        {
            "hc-key": "us-va-079",
            "value": 126
        },
        {
            "hc-key": "us-va-197",
            "value": 127
        },
        {
            "hc-key": "us-va-660",
            "value": 128
        },
        {
            "hc-key": "us-va-820",
            "value": 129
        },
        {
            "hc-key": "us-va-790",
            "value": 130
        },
        {
            "hc-key": "us-va-145",
            "value": 131
        },
        {
            "hc-key": "us-va-760",
            "value": 132
        },
        {
            "hc-key": "us-va-139",
            "value": 133
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-va-all.js">Virginia</a>'
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
            mapData: Highcharts.maps['countries/us/us-va-all'],
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

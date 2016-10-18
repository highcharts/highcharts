$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ga-295",
            "value": 0
        },
        {
            "hc-key": "us-ga-261",
            "value": 1
        },
        {
            "hc-key": "us-ga-179",
            "value": 2
        },
        {
            "hc-key": "us-ga-001",
            "value": 3
        },
        {
            "hc-key": "us-ga-279",
            "value": 4
        },
        {
            "hc-key": "us-ga-061",
            "value": 5
        },
        {
            "hc-key": "us-ga-037",
            "value": 6
        },
        {
            "hc-key": "us-ga-077",
            "value": 7
        },
        {
            "hc-key": "us-ga-199",
            "value": 8
        },
        {
            "hc-key": "us-ga-023",
            "value": 9
        },
        {
            "hc-key": "us-ga-175",
            "value": 10
        },
        {
            "hc-key": "us-ga-251",
            "value": 11
        },
        {
            "hc-key": "us-ga-033",
            "value": 12
        },
        {
            "hc-key": "us-ga-285",
            "value": 13
        },
        {
            "hc-key": "us-ga-145",
            "value": 14
        },
        {
            "hc-key": "us-ga-213",
            "value": 15
        },
        {
            "hc-key": "us-ga-087",
            "value": 16
        },
        {
            "hc-key": "us-ga-131",
            "value": 17
        },
        {
            "hc-key": "us-ga-081",
            "value": 18
        },
        {
            "hc-key": "us-ga-287",
            "value": 19
        },
        {
            "hc-key": "us-ga-171",
            "value": 20
        },
        {
            "hc-key": "us-ga-231",
            "value": 21
        },
        {
            "hc-key": "us-ga-097",
            "value": 22
        },
        {
            "hc-key": "us-ga-067",
            "value": 23
        },
        {
            "hc-key": "us-ga-193",
            "value": 24
        },
        {
            "hc-key": "us-ga-249",
            "value": 25
        },
        {
            "hc-key": "us-ga-269",
            "value": 26
        },
        {
            "hc-key": "us-ga-157",
            "value": 27
        },
        {
            "hc-key": "us-ga-229",
            "value": 28
        },
        {
            "hc-key": "us-ga-305",
            "value": 29
        },
        {
            "hc-key": "us-ga-045",
            "value": 30
        },
        {
            "hc-key": "us-ga-223",
            "value": 31
        },
        {
            "hc-key": "us-ga-015",
            "value": 32
        },
        {
            "hc-key": "us-ga-005",
            "value": 33
        },
        {
            "hc-key": "us-ga-299",
            "value": 34
        },
        {
            "hc-key": "us-ga-115",
            "value": 35
        },
        {
            "hc-key": "us-ga-233",
            "value": 36
        },
        {
            "hc-key": "us-ga-225",
            "value": 37
        },
        {
            "hc-key": "us-ga-079",
            "value": 38
        },
        {
            "hc-key": "us-ga-121",
            "value": 39
        },
        {
            "hc-key": "us-ga-063",
            "value": 40
        },
        {
            "hc-key": "us-ga-009",
            "value": 41
        },
        {
            "hc-key": "us-ga-169",
            "value": 42
        },
        {
            "hc-key": "us-ga-149",
            "value": 43
        },
        {
            "hc-key": "us-ga-201",
            "value": 44
        },
        {
            "hc-key": "us-ga-253",
            "value": 45
        },
        {
            "hc-key": "us-ga-139",
            "value": 46
        },
        {
            "hc-key": "us-ga-187",
            "value": 47
        },
        {
            "hc-key": "us-ga-117",
            "value": 48
        },
        {
            "hc-key": "us-ga-085",
            "value": 49
        },
        {
            "hc-key": "us-ga-057",
            "value": 50
        },
        {
            "hc-key": "us-ga-021",
            "value": 51
        },
        {
            "hc-key": "us-ga-153",
            "value": 52
        },
        {
            "hc-key": "us-ga-235",
            "value": 53
        },
        {
            "hc-key": "us-ga-237",
            "value": 54
        },
        {
            "hc-key": "us-ga-311",
            "value": 55
        },
        {
            "hc-key": "us-ga-245",
            "value": 56
        },
        {
            "hc-key": "us-ga-163",
            "value": 57
        },
        {
            "hc-key": "us-ga-181",
            "value": 58
        },
        {
            "hc-key": "us-ga-189",
            "value": 59
        },
        {
            "hc-key": "us-ga-105",
            "value": 60
        },
        {
            "hc-key": "us-ga-317",
            "value": 61
        },
        {
            "hc-key": "us-ga-137",
            "value": 62
        },
        {
            "hc-key": "us-ga-247",
            "value": 63
        },
        {
            "hc-key": "us-ga-135",
            "value": 64
        },
        {
            "hc-key": "us-ga-283",
            "value": 65
        },
        {
            "hc-key": "us-ga-065",
            "value": 66
        },
        {
            "hc-key": "us-ga-185",
            "value": 67
        },
        {
            "hc-key": "us-ga-165",
            "value": 68
        },
        {
            "hc-key": "us-ga-321",
            "value": 69
        },
        {
            "hc-key": "us-ga-127",
            "value": 70
        },
        {
            "hc-key": "us-ga-191",
            "value": 71
        },
        {
            "hc-key": "us-ga-207",
            "value": 72
        },
        {
            "hc-key": "us-ga-221",
            "value": 73
        },
        {
            "hc-key": "us-ga-219",
            "value": 74
        },
        {
            "hc-key": "us-ga-027",
            "value": 75
        },
        {
            "hc-key": "us-ga-289",
            "value": 76
        },
        {
            "hc-key": "us-ga-205",
            "value": 77
        },
        {
            "hc-key": "us-ga-119",
            "value": 78
        },
        {
            "hc-key": "us-ga-095",
            "value": 79
        },
        {
            "hc-key": "us-ga-161",
            "value": 80
        },
        {
            "hc-key": "us-ga-271",
            "value": 81
        },
        {
            "hc-key": "us-ga-315",
            "value": 82
        },
        {
            "hc-key": "us-ga-093",
            "value": 83
        },
        {
            "hc-key": "us-ga-281",
            "value": 84
        },
        {
            "hc-key": "us-ga-215",
            "value": 85
        },
        {
            "hc-key": "us-ga-263",
            "value": 86
        },
        {
            "hc-key": "us-ga-265",
            "value": 87
        },
        {
            "hc-key": "us-ga-141",
            "value": 88
        },
        {
            "hc-key": "us-ga-017",
            "value": 89
        },
        {
            "hc-key": "us-ga-013",
            "value": 90
        },
        {
            "hc-key": "us-ga-297",
            "value": 91
        },
        {
            "hc-key": "us-ga-147",
            "value": 92
        },
        {
            "hc-key": "us-ga-195",
            "value": 93
        },
        {
            "hc-key": "us-ga-003",
            "value": 94
        },
        {
            "hc-key": "us-ga-173",
            "value": 95
        },
        {
            "hc-key": "us-ga-101",
            "value": 96
        },
        {
            "hc-key": "us-ga-019",
            "value": 97
        },
        {
            "hc-key": "us-ga-277",
            "value": 98
        },
        {
            "hc-key": "us-ga-293",
            "value": 99
        },
        {
            "hc-key": "us-ga-197",
            "value": 100
        },
        {
            "hc-key": "us-ga-259",
            "value": 101
        },
        {
            "hc-key": "us-ga-273",
            "value": 102
        },
        {
            "hc-key": "us-ga-177",
            "value": 103
        },
        {
            "hc-key": "us-ga-217",
            "value": 104
        },
        {
            "hc-key": "us-ga-211",
            "value": 105
        },
        {
            "hc-key": "us-ga-059",
            "value": 106
        },
        {
            "hc-key": "us-ga-053",
            "value": 107
        },
        {
            "hc-key": "us-ga-011",
            "value": 108
        },
        {
            "hc-key": "us-ga-103",
            "value": 109
        },
        {
            "hc-key": "us-ga-029",
            "value": 110
        },
        {
            "hc-key": "us-ga-155",
            "value": 111
        },
        {
            "hc-key": "us-ga-109",
            "value": 112
        },
        {
            "hc-key": "us-ga-031",
            "value": 113
        },
        {
            "hc-key": "us-ga-091",
            "value": 114
        },
        {
            "hc-key": "us-ga-309",
            "value": 115
        },
        {
            "hc-key": "us-ga-143",
            "value": 116
        },
        {
            "hc-key": "us-ga-069",
            "value": 117
        },
        {
            "hc-key": "us-ga-267",
            "value": 118
        },
        {
            "hc-key": "us-ga-129",
            "value": 119
        },
        {
            "hc-key": "us-ga-123",
            "value": 120
        },
        {
            "hc-key": "us-ga-111",
            "value": 121
        },
        {
            "hc-key": "us-ga-319",
            "value": 122
        },
        {
            "hc-key": "us-ga-167",
            "value": 123
        },
        {
            "hc-key": "us-ga-125",
            "value": 124
        },
        {
            "hc-key": "us-ga-209",
            "value": 125
        },
        {
            "hc-key": "us-ga-089",
            "value": 126
        },
        {
            "hc-key": "us-ga-151",
            "value": 127
        },
        {
            "hc-key": "us-ga-243",
            "value": 128
        },
        {
            "hc-key": "us-ga-307",
            "value": 129
        },
        {
            "hc-key": "us-ga-255",
            "value": 130
        },
        {
            "hc-key": "us-ga-035",
            "value": 131
        },
        {
            "hc-key": "us-ga-039",
            "value": 132
        },
        {
            "hc-key": "us-ga-083",
            "value": 133
        },
        {
            "hc-key": "us-ga-051",
            "value": 134
        },
        {
            "hc-key": "us-ga-073",
            "value": 135
        },
        {
            "hc-key": "us-ga-241",
            "value": 136
        },
        {
            "hc-key": "us-ga-183",
            "value": 137
        },
        {
            "hc-key": "us-ga-007",
            "value": 138
        },
        {
            "hc-key": "us-ga-275",
            "value": 139
        },
        {
            "hc-key": "us-ga-099",
            "value": 140
        },
        {
            "hc-key": "us-ga-055",
            "value": 141
        },
        {
            "hc-key": "us-ga-291",
            "value": 142
        },
        {
            "hc-key": "us-ga-257",
            "value": 143
        },
        {
            "hc-key": "us-ga-047",
            "value": 144
        },
        {
            "hc-key": "us-ga-107",
            "value": 145
        },
        {
            "hc-key": "us-ga-071",
            "value": 146
        },
        {
            "hc-key": "us-ga-239",
            "value": 147
        },
        {
            "hc-key": "us-ga-025",
            "value": 148
        },
        {
            "hc-key": "us-ga-049",
            "value": 149
        },
        {
            "hc-key": "us-ga-227",
            "value": 150
        },
        {
            "hc-key": "us-ga-303",
            "value": 151
        },
        {
            "hc-key": "us-ga-133",
            "value": 152
        },
        {
            "hc-key": "us-ga-159",
            "value": 153
        },
        {
            "hc-key": "us-ga-301",
            "value": 154
        },
        {
            "hc-key": "us-ga-113",
            "value": 155
        },
        {
            "hc-key": "us-ga-075",
            "value": 156
        },
        {
            "hc-key": "us-ga-043",
            "value": 157
        },
        {
            "hc-key": "us-ga-313",
            "value": 158
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ga-all.js">Georgia</a>'
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
            mapData: Highcharts.maps['countries/us/us-ga-all'],
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

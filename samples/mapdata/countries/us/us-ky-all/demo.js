$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ky-091",
            "value": 0
        },
        {
            "hc-key": "us-ky-183",
            "value": 1
        },
        {
            "hc-key": "us-ky-149",
            "value": 2
        },
        {
            "hc-key": "us-ky-019",
            "value": 3
        },
        {
            "hc-key": "us-ky-089",
            "value": 4
        },
        {
            "hc-key": "us-ky-083",
            "value": 5
        },
        {
            "hc-key": "us-ky-157",
            "value": 6
        },
        {
            "hc-key": "us-ky-185",
            "value": 7
        },
        {
            "hc-key": "us-ky-111",
            "value": 8
        },
        {
            "hc-key": "us-ky-029",
            "value": 9
        },
        {
            "hc-key": "us-ky-017",
            "value": 10
        },
        {
            "hc-key": "us-ky-049",
            "value": 11
        },
        {
            "hc-key": "us-ky-173",
            "value": 12
        },
        {
            "hc-key": "us-ky-031",
            "value": 13
        },
        {
            "hc-key": "us-ky-085",
            "value": 14
        },
        {
            "hc-key": "us-ky-045",
            "value": 15
        },
        {
            "hc-key": "us-ky-207",
            "value": 16
        },
        {
            "hc-key": "us-ky-155",
            "value": 17
        },
        {
            "hc-key": "us-ky-179",
            "value": 18
        },
        {
            "hc-key": "us-ky-199",
            "value": 19
        },
        {
            "hc-key": "us-ky-177",
            "value": 20
        },
        {
            "hc-key": "us-ky-129",
            "value": 21
        },
        {
            "hc-key": "us-ky-237",
            "value": 22
        },
        {
            "hc-key": "us-ky-197",
            "value": 23
        },
        {
            "hc-key": "us-ky-187",
            "value": 24
        },
        {
            "hc-key": "us-ky-041",
            "value": 25
        },
        {
            "hc-key": "us-ky-239",
            "value": 26
        },
        {
            "hc-key": "us-ky-209",
            "value": 27
        },
        {
            "hc-key": "us-ky-107",
            "value": 28
        },
        {
            "hc-key": "us-ky-141",
            "value": 29
        },
        {
            "hc-key": "us-ky-077",
            "value": 30
        },
        {
            "hc-key": "us-ky-015",
            "value": 31
        },
        {
            "hc-key": "us-ky-079",
            "value": 32
        },
        {
            "hc-key": "us-ky-021",
            "value": 33
        },
        {
            "hc-key": "us-ky-229",
            "value": 34
        },
        {
            "hc-key": "us-ky-221",
            "value": 35
        },
        {
            "hc-key": "us-ky-193",
            "value": 36
        },
        {
            "hc-key": "us-ky-051",
            "value": 37
        },
        {
            "hc-key": "us-ky-109",
            "value": 38
        },
        {
            "hc-key": "us-ky-165",
            "value": 39
        },
        {
            "hc-key": "us-ky-205",
            "value": 40
        },
        {
            "hc-key": "us-ky-061",
            "value": 41
        },
        {
            "hc-key": "us-ky-033",
            "value": 42
        },
        {
            "hc-key": "us-ky-233",
            "value": 43
        },
        {
            "hc-key": "us-ky-001",
            "value": 44
        },
        {
            "hc-key": "us-ky-087",
            "value": 45
        },
        {
            "hc-key": "us-ky-223",
            "value": 46
        },
        {
            "hc-key": "us-ky-167",
            "value": 47
        },
        {
            "hc-key": "us-ky-113",
            "value": 48
        },
        {
            "hc-key": "us-ky-093",
            "value": 49
        },
        {
            "hc-key": "us-ky-099",
            "value": 50
        },
        {
            "hc-key": "us-ky-211",
            "value": 51
        },
        {
            "hc-key": "us-ky-171",
            "value": 52
        },
        {
            "hc-key": "us-ky-003",
            "value": 53
        },
        {
            "hc-key": "us-ky-023",
            "value": 54
        },
        {
            "hc-key": "us-ky-201",
            "value": 55
        },
        {
            "hc-key": "us-ky-069",
            "value": 56
        },
        {
            "hc-key": "us-ky-195",
            "value": 57
        },
        {
            "hc-key": "us-ky-119",
            "value": 58
        },
        {
            "hc-key": "us-ky-025",
            "value": 59
        },
        {
            "hc-key": "us-ky-071",
            "value": 60
        },
        {
            "hc-key": "us-ky-159",
            "value": 61
        },
        {
            "hc-key": "us-ky-125",
            "value": 62
        },
        {
            "hc-key": "us-ky-147",
            "value": 63
        },
        {
            "hc-key": "us-ky-191",
            "value": 64
        },
        {
            "hc-key": "us-ky-215",
            "value": 65
        },
        {
            "hc-key": "us-ky-057",
            "value": 66
        },
        {
            "hc-key": "us-ky-053",
            "value": 67
        },
        {
            "hc-key": "us-ky-231",
            "value": 68
        },
        {
            "hc-key": "us-ky-009",
            "value": 69
        },
        {
            "hc-key": "us-ky-227",
            "value": 70
        },
        {
            "hc-key": "us-ky-105",
            "value": 71
        },
        {
            "hc-key": "us-ky-035",
            "value": 72
        },
        {
            "hc-key": "us-ky-065",
            "value": 73
        },
        {
            "hc-key": "us-ky-189",
            "value": 74
        },
        {
            "hc-key": "us-ky-027",
            "value": 75
        },
        {
            "hc-key": "us-ky-127",
            "value": 76
        },
        {
            "hc-key": "us-ky-175",
            "value": 77
        },
        {
            "hc-key": "us-ky-115",
            "value": 78
        },
        {
            "hc-key": "us-ky-213",
            "value": 79
        },
        {
            "hc-key": "us-ky-081",
            "value": 80
        },
        {
            "hc-key": "us-ky-117",
            "value": 81
        },
        {
            "hc-key": "us-ky-169",
            "value": 82
        },
        {
            "hc-key": "us-ky-235",
            "value": 83
        },
        {
            "hc-key": "us-ky-097",
            "value": 84
        },
        {
            "hc-key": "us-ky-005",
            "value": 85
        },
        {
            "hc-key": "us-ky-039",
            "value": 86
        },
        {
            "hc-key": "us-ky-145",
            "value": 87
        },
        {
            "hc-key": "us-ky-139",
            "value": 88
        },
        {
            "hc-key": "us-ky-055",
            "value": 89
        },
        {
            "hc-key": "us-ky-143",
            "value": 90
        },
        {
            "hc-key": "us-ky-151",
            "value": 91
        },
        {
            "hc-key": "us-ky-203",
            "value": 92
        },
        {
            "hc-key": "us-ky-153",
            "value": 93
        },
        {
            "hc-key": "us-ky-131",
            "value": 94
        },
        {
            "hc-key": "us-ky-013",
            "value": 95
        },
        {
            "hc-key": "us-ky-181",
            "value": 96
        },
        {
            "hc-key": "us-ky-037",
            "value": 97
        },
        {
            "hc-key": "us-ky-135",
            "value": 98
        },
        {
            "hc-key": "us-ky-075",
            "value": 99
        },
        {
            "hc-key": "us-ky-101",
            "value": 100
        },
        {
            "hc-key": "us-ky-059",
            "value": 101
        },
        {
            "hc-key": "us-ky-095",
            "value": 102
        },
        {
            "hc-key": "us-ky-161",
            "value": 103
        },
        {
            "hc-key": "us-ky-123",
            "value": 104
        },
        {
            "hc-key": "us-ky-137",
            "value": 105
        },
        {
            "hc-key": "us-ky-043",
            "value": 106
        },
        {
            "hc-key": "us-ky-047",
            "value": 107
        },
        {
            "hc-key": "us-ky-063",
            "value": 108
        },
        {
            "hc-key": "us-ky-133",
            "value": 109
        },
        {
            "hc-key": "us-ky-121",
            "value": 110
        },
        {
            "hc-key": "us-ky-219",
            "value": 111
        },
        {
            "hc-key": "us-ky-225",
            "value": 112
        },
        {
            "hc-key": "us-ky-067",
            "value": 113
        },
        {
            "hc-key": "us-ky-163",
            "value": 114
        },
        {
            "hc-key": "us-ky-007",
            "value": 115
        },
        {
            "hc-key": "us-ky-011",
            "value": 116
        },
        {
            "hc-key": "us-ky-217",
            "value": 117
        },
        {
            "hc-key": "us-ky-103",
            "value": 118
        },
        {
            "hc-key": "us-ky-073",
            "value": 119
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ky-all.js">Kentucky</a>'
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
            mapData: Highcharts.maps['countries/us/us-ky-all'],
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

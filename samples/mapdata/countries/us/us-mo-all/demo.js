$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-mo-223",
            "value": 0
        },
        {
            "hc-key": "us-mo-179",
            "value": 1
        },
        {
            "hc-key": "us-mo-035",
            "value": 2
        },
        {
            "hc-key": "us-mo-145",
            "value": 3
        },
        {
            "hc-key": "us-mo-003",
            "value": 4
        },
        {
            "hc-key": "us-mo-147",
            "value": 5
        },
        {
            "hc-key": "us-mo-199",
            "value": 6
        },
        {
            "hc-key": "us-mo-103",
            "value": 7
        },
        {
            "hc-key": "us-mo-097",
            "value": 8
        },
        {
            "hc-key": "us-mo-011",
            "value": 9
        },
        {
            "hc-key": "us-mo-227",
            "value": 10
        },
        {
            "hc-key": "us-mo-079",
            "value": 11
        },
        {
            "hc-key": "us-mo-117",
            "value": 12
        },
        {
            "hc-key": "us-mo-125",
            "value": 13
        },
        {
            "hc-key": "us-mo-131",
            "value": 14
        },
        {
            "hc-key": "us-mo-073",
            "value": 15
        },
        {
            "hc-key": "us-mo-151",
            "value": 16
        },
        {
            "hc-key": "us-mo-021",
            "value": 17
        },
        {
            "hc-key": "us-mo-165",
            "value": 18
        },
        {
            "hc-key": "us-mo-209",
            "value": 19
        },
        {
            "hc-key": "us-mo-111",
            "value": 20
        },
        {
            "hc-key": "us-mo-127",
            "value": 21
        },
        {
            "hc-key": "us-mo-107",
            "value": 22
        },
        {
            "hc-key": "us-mo-101",
            "value": 23
        },
        {
            "hc-key": "us-mo-163",
            "value": 24
        },
        {
            "hc-key": "us-mo-007",
            "value": 25
        },
        {
            "hc-key": "us-mo-211",
            "value": 26
        },
        {
            "hc-key": "us-mo-129",
            "value": 27
        },
        {
            "hc-key": "us-mo-119",
            "value": 28
        },
        {
            "hc-key": "us-mo-009",
            "value": 29
        },
        {
            "hc-key": "us-mo-173",
            "value": 30
        },
        {
            "hc-key": "us-mo-201",
            "value": 31
        },
        {
            "hc-key": "us-mo-143",
            "value": 32
        },
        {
            "hc-key": "us-mo-187",
            "value": 33
        },
        {
            "hc-key": "us-mo-099",
            "value": 34
        },
        {
            "hc-key": "us-mo-186",
            "value": 35
        },
        {
            "hc-key": "us-mo-093",
            "value": 36
        },
        {
            "hc-key": "us-mo-221",
            "value": 37
        },
        {
            "hc-key": "us-mo-157",
            "value": 38
        },
        {
            "hc-key": "us-mo-109",
            "value": 39
        },
        {
            "hc-key": "us-mo-123",
            "value": 40
        },
        {
            "hc-key": "us-mo-075",
            "value": 41
        },
        {
            "hc-key": "us-mo-139",
            "value": 42
        },
        {
            "hc-key": "us-mo-045",
            "value": 43
        },
        {
            "hc-key": "us-mo-121",
            "value": 44
        },
        {
            "hc-key": "us-mo-001",
            "value": 45
        },
        {
            "hc-key": "us-mo-039",
            "value": 46
        },
        {
            "hc-key": "us-mo-167",
            "value": 47
        },
        {
            "hc-key": "us-mo-085",
            "value": 48
        },
        {
            "hc-key": "us-mo-029",
            "value": 49
        },
        {
            "hc-key": "us-mo-189",
            "value": 50
        },
        {
            "hc-key": "us-mo-067",
            "value": 51
        },
        {
            "hc-key": "us-mo-091",
            "value": 52
        },
        {
            "hc-key": "us-mo-041",
            "value": 53
        },
        {
            "hc-key": "us-mo-141",
            "value": 54
        },
        {
            "hc-key": "us-mo-015",
            "value": 55
        },
        {
            "hc-key": "us-mo-149",
            "value": 56
        },
        {
            "hc-key": "us-mo-115",
            "value": 57
        },
        {
            "hc-key": "us-mo-175",
            "value": 58
        },
        {
            "hc-key": "us-mo-137",
            "value": 59
        },
        {
            "hc-key": "us-mo-219",
            "value": 60
        },
        {
            "hc-key": "us-mo-047",
            "value": 61
        },
        {
            "hc-key": "us-mo-081",
            "value": 62
        },
        {
            "hc-key": "us-mo-059",
            "value": 63
        },
        {
            "hc-key": "us-mo-077",
            "value": 64
        },
        {
            "hc-key": "us-mo-061",
            "value": 65
        },
        {
            "hc-key": "us-mo-195",
            "value": 66
        },
        {
            "hc-key": "us-mo-053",
            "value": 67
        },
        {
            "hc-key": "us-mo-019",
            "value": 68
        },
        {
            "hc-key": "us-mo-065",
            "value": 69
        },
        {
            "hc-key": "us-mo-013",
            "value": 70
        },
        {
            "hc-key": "us-mo-083",
            "value": 71
        },
        {
            "hc-key": "us-mo-095",
            "value": 72
        },
        {
            "hc-key": "us-mo-215",
            "value": 73
        },
        {
            "hc-key": "us-mo-159",
            "value": 74
        },
        {
            "hc-key": "us-mo-057",
            "value": 75
        },
        {
            "hc-key": "us-mo-043",
            "value": 76
        },
        {
            "hc-key": "us-mo-135",
            "value": 77
        },
        {
            "hc-key": "us-mo-205",
            "value": 78
        },
        {
            "hc-key": "us-mo-185",
            "value": 79
        },
        {
            "hc-key": "us-mo-055",
            "value": 80
        },
        {
            "hc-key": "us-mo-033",
            "value": 81
        },
        {
            "hc-key": "us-mo-025",
            "value": 82
        },
        {
            "hc-key": "us-mo-049",
            "value": 83
        },
        {
            "hc-key": "us-mo-063",
            "value": 84
        },
        {
            "hc-key": "us-mo-213",
            "value": 85
        },
        {
            "hc-key": "us-mo-225",
            "value": 86
        },
        {
            "hc-key": "us-mo-171",
            "value": 87
        },
        {
            "hc-key": "us-mo-023",
            "value": 88
        },
        {
            "hc-key": "us-mo-031",
            "value": 89
        },
        {
            "hc-key": "us-mo-133",
            "value": 90
        },
        {
            "hc-key": "us-mo-113",
            "value": 91
        },
        {
            "hc-key": "us-mo-197",
            "value": 92
        },
        {
            "hc-key": "us-mo-037",
            "value": 93
        },
        {
            "hc-key": "us-mo-069",
            "value": 94
        },
        {
            "hc-key": "us-mo-153",
            "value": 95
        },
        {
            "hc-key": "us-mo-017",
            "value": 96
        },
        {
            "hc-key": "us-mo-183",
            "value": 97
        },
        {
            "hc-key": "us-mo-071",
            "value": 98
        },
        {
            "hc-key": "us-mo-181",
            "value": 99
        },
        {
            "hc-key": "us-mo-177",
            "value": 100
        },
        {
            "hc-key": "us-mo-087",
            "value": 101
        },
        {
            "hc-key": "us-mo-217",
            "value": 102
        },
        {
            "hc-key": "us-mo-105",
            "value": 103
        },
        {
            "hc-key": "us-mo-169",
            "value": 104
        },
        {
            "hc-key": "us-mo-161",
            "value": 105
        },
        {
            "hc-key": "us-mo-229",
            "value": 106
        },
        {
            "hc-key": "us-mo-155",
            "value": 107
        },
        {
            "hc-key": "us-mo-203",
            "value": 108
        },
        {
            "hc-key": "us-mo-005",
            "value": 109
        },
        {
            "hc-key": "us-mo-510",
            "value": 110
        },
        {
            "hc-key": "us-mo-207",
            "value": 111
        },
        {
            "hc-key": "us-mo-027",
            "value": 112
        },
        {
            "hc-key": "us-mo-051",
            "value": 113
        },
        {
            "hc-key": "us-mo-089",
            "value": 114
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-mo-all.js">Missouri</a>'
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
            mapData: Highcharts.maps['countries/us/us-mo-all'],
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

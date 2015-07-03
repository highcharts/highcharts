$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ks-091",
            "value": 0
        },
        {
            "hc-key": "us-ks-045",
            "value": 1
        },
        {
            "hc-key": "us-ks-165",
            "value": 2
        },
        {
            "hc-key": "us-ks-051",
            "value": 3
        },
        {
            "hc-key": "us-ks-195",
            "value": 4
        },
        {
            "hc-key": "us-ks-205",
            "value": 5
        },
        {
            "hc-key": "us-ks-125",
            "value": 6
        },
        {
            "hc-key": "us-ks-137",
            "value": 7
        },
        {
            "hc-key": "us-ks-065",
            "value": 8
        },
        {
            "hc-key": "us-ks-179",
            "value": 9
        },
        {
            "hc-key": "us-ks-079",
            "value": 10
        },
        {
            "hc-key": "us-ks-155",
            "value": 11
        },
        {
            "hc-key": "us-ks-053",
            "value": 12
        },
        {
            "hc-key": "us-ks-105",
            "value": 13
        },
        {
            "hc-key": "us-ks-035",
            "value": 14
        },
        {
            "hc-key": "us-ks-019",
            "value": 15
        },
        {
            "hc-key": "us-ks-063",
            "value": 16
        },
        {
            "hc-key": "us-ks-109",
            "value": 17
        },
        {
            "hc-key": "us-ks-135",
            "value": 18
        },
        {
            "hc-key": "us-ks-181",
            "value": 19
        },
        {
            "hc-key": "us-ks-153",
            "value": 20
        },
        {
            "hc-key": "us-ks-023",
            "value": 21
        },
        {
            "hc-key": "us-ks-145",
            "value": 22
        },
        {
            "hc-key": "us-ks-009",
            "value": 23
        },
        {
            "hc-key": "us-ks-089",
            "value": 24
        },
        {
            "hc-key": "us-ks-123",
            "value": 25
        },
        {
            "hc-key": "us-ks-029",
            "value": 26
        },
        {
            "hc-key": "us-ks-143",
            "value": 27
        },
        {
            "hc-key": "us-ks-175",
            "value": 28
        },
        {
            "hc-key": "us-ks-119",
            "value": 29
        },
        {
            "hc-key": "us-ks-071",
            "value": 30
        },
        {
            "hc-key": "us-ks-075",
            "value": 31
        },
        {
            "hc-key": "us-ks-041",
            "value": 32
        },
        {
            "hc-key": "us-ks-131",
            "value": 33
        },
        {
            "hc-key": "us-ks-149",
            "value": 34
        },
        {
            "hc-key": "us-ks-013",
            "value": 35
        },
        {
            "hc-key": "us-ks-005",
            "value": 36
        },
        {
            "hc-key": "us-ks-127",
            "value": 37
        },
        {
            "hc-key": "us-ks-111",
            "value": 38
        },
        {
            "hc-key": "us-ks-073",
            "value": 39
        },
        {
            "hc-key": "us-ks-061",
            "value": 40
        },
        {
            "hc-key": "us-ks-197",
            "value": 41
        },
        {
            "hc-key": "us-ks-115",
            "value": 42
        },
        {
            "hc-key": "us-ks-095",
            "value": 43
        },
        {
            "hc-key": "us-ks-141",
            "value": 44
        },
        {
            "hc-key": "us-ks-085",
            "value": 45
        },
        {
            "hc-key": "us-ks-037",
            "value": 46
        },
        {
            "hc-key": "us-ks-099",
            "value": 47
        },
        {
            "hc-key": "us-ks-049",
            "value": 48
        },
        {
            "hc-key": "us-ks-133",
            "value": 49
        },
        {
            "hc-key": "us-ks-057",
            "value": 50
        },
        {
            "hc-key": "us-ks-047",
            "value": 51
        },
        {
            "hc-key": "us-ks-151",
            "value": 52
        },
        {
            "hc-key": "us-ks-169",
            "value": 53
        },
        {
            "hc-key": "us-ks-113",
            "value": 54
        },
        {
            "hc-key": "us-ks-203",
            "value": 55
        },
        {
            "hc-key": "us-ks-167",
            "value": 56
        },
        {
            "hc-key": "us-ks-163",
            "value": 57
        },
        {
            "hc-key": "us-ks-011",
            "value": 58
        },
        {
            "hc-key": "us-ks-055",
            "value": 59
        },
        {
            "hc-key": "us-ks-083",
            "value": 60
        },
        {
            "hc-key": "us-ks-039",
            "value": 61
        },
        {
            "hc-key": "us-ks-193",
            "value": 62
        },
        {
            "hc-key": "us-ks-147",
            "value": 63
        },
        {
            "hc-key": "us-ks-069",
            "value": 64
        },
        {
            "hc-key": "us-ks-081",
            "value": 65
        },
        {
            "hc-key": "us-ks-007",
            "value": 66
        },
        {
            "hc-key": "us-ks-103",
            "value": 67
        },
        {
            "hc-key": "us-ks-093",
            "value": 68
        },
        {
            "hc-key": "us-ks-171",
            "value": 69
        },
        {
            "hc-key": "us-ks-177",
            "value": 70
        },
        {
            "hc-key": "us-ks-187",
            "value": 71
        },
        {
            "hc-key": "us-ks-189",
            "value": 72
        },
        {
            "hc-key": "us-ks-031",
            "value": 73
        },
        {
            "hc-key": "us-ks-059",
            "value": 74
        },
        {
            "hc-key": "us-ks-207",
            "value": 75
        },
        {
            "hc-key": "us-ks-139",
            "value": 76
        },
        {
            "hc-key": "us-ks-183",
            "value": 77
        },
        {
            "hc-key": "us-ks-199",
            "value": 78
        },
        {
            "hc-key": "us-ks-173",
            "value": 79
        },
        {
            "hc-key": "us-ks-077",
            "value": 80
        },
        {
            "hc-key": "us-ks-191",
            "value": 81
        },
        {
            "hc-key": "us-ks-001",
            "value": 82
        },
        {
            "hc-key": "us-ks-121",
            "value": 83
        },
        {
            "hc-key": "us-ks-021",
            "value": 84
        },
        {
            "hc-key": "us-ks-033",
            "value": 85
        },
        {
            "hc-key": "us-ks-185",
            "value": 86
        },
        {
            "hc-key": "us-ks-159",
            "value": 87
        },
        {
            "hc-key": "us-ks-117",
            "value": 88
        },
        {
            "hc-key": "us-ks-015",
            "value": 89
        },
        {
            "hc-key": "us-ks-017",
            "value": 90
        },
        {
            "hc-key": "us-ks-043",
            "value": 91
        },
        {
            "hc-key": "us-ks-107",
            "value": 92
        },
        {
            "hc-key": "us-ks-157",
            "value": 93
        },
        {
            "hc-key": "us-ks-097",
            "value": 94
        },
        {
            "hc-key": "us-ks-067",
            "value": 95
        },
        {
            "hc-key": "us-ks-129",
            "value": 96
        },
        {
            "hc-key": "us-ks-025",
            "value": 97
        },
        {
            "hc-key": "us-ks-003",
            "value": 98
        },
        {
            "hc-key": "us-ks-209",
            "value": 99
        },
        {
            "hc-key": "us-ks-161",
            "value": 100
        },
        {
            "hc-key": "us-ks-027",
            "value": 101
        },
        {
            "hc-key": "us-ks-087",
            "value": 102
        },
        {
            "hc-key": "us-ks-201",
            "value": 103
        },
        {
            "hc-key": "us-ks-101",
            "value": 104
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ks-all.js">Kansas</a>'
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
            mapData: Highcharts.maps['countries/us/us-ks-all'],
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

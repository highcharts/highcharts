$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-il-003",
            "value": 0
        },
        {
            "hc-key": "us-il-181",
            "value": 1
        },
        {
            "hc-key": "us-il-187",
            "value": 2
        },
        {
            "hc-key": "us-il-109",
            "value": 3
        },
        {
            "hc-key": "us-il-147",
            "value": 4
        },
        {
            "hc-key": "us-il-113",
            "value": 5
        },
        {
            "hc-key": "us-il-195",
            "value": 6
        },
        {
            "hc-key": "us-il-089",
            "value": 7
        },
        {
            "hc-key": "us-il-043",
            "value": 8
        },
        {
            "hc-key": "us-il-119",
            "value": 9
        },
        {
            "hc-key": "us-il-083",
            "value": 10
        },
        {
            "hc-key": "us-il-193",
            "value": 11
        },
        {
            "hc-key": "us-il-059",
            "value": 12
        },
        {
            "hc-key": "us-il-019",
            "value": 13
        },
        {
            "hc-key": "us-il-053",
            "value": 14
        },
        {
            "hc-key": "us-il-041",
            "value": 15
        },
        {
            "hc-key": "us-il-045",
            "value": 16
        },
        {
            "hc-key": "us-il-007",
            "value": 17
        },
        {
            "hc-key": "us-il-201",
            "value": 18
        },
        {
            "hc-key": "us-il-155",
            "value": 19
        },
        {
            "hc-key": "us-il-099",
            "value": 20
        },
        {
            "hc-key": "us-il-121",
            "value": 21
        },
        {
            "hc-key": "us-il-025",
            "value": 22
        },
        {
            "hc-key": "us-il-197",
            "value": 23
        },
        {
            "hc-key": "us-il-049",
            "value": 24
        },
        {
            "hc-key": "us-il-051",
            "value": 25
        },
        {
            "hc-key": "us-il-035",
            "value": 26
        },
        {
            "hc-key": "us-il-163",
            "value": 27
        },
        {
            "hc-key": "us-il-027",
            "value": 28
        },
        {
            "hc-key": "us-il-189",
            "value": 29
        },
        {
            "hc-key": "us-il-145",
            "value": 30
        },
        {
            "hc-key": "us-il-175",
            "value": 31
        },
        {
            "hc-key": "us-il-073",
            "value": 32
        },
        {
            "hc-key": "us-il-123",
            "value": 33
        },
        {
            "hc-key": "us-il-143",
            "value": 34
        },
        {
            "hc-key": "us-il-011",
            "value": 35
        },
        {
            "hc-key": "us-il-103",
            "value": 36
        },
        {
            "hc-key": "us-il-029",
            "value": 37
        },
        {
            "hc-key": "us-il-037",
            "value": 38
        },
        {
            "hc-key": "us-il-093",
            "value": 39
        },
        {
            "hc-key": "us-il-039",
            "value": 40
        },
        {
            "hc-key": "us-il-107",
            "value": 41
        },
        {
            "hc-key": "us-il-129",
            "value": 42
        },
        {
            "hc-key": "us-il-157",
            "value": 43
        },
        {
            "hc-key": "us-il-077",
            "value": 44
        },
        {
            "hc-key": "us-il-203",
            "value": 45
        },
        {
            "hc-key": "us-il-105",
            "value": 46
        },
        {
            "hc-key": "us-il-057",
            "value": 47
        },
        {
            "hc-key": "us-il-071",
            "value": 48
        },
        {
            "hc-key": "us-il-135",
            "value": 49
        },
        {
            "hc-key": "us-il-061",
            "value": 50
        },
        {
            "hc-key": "us-il-149",
            "value": 51
        },
        {
            "hc-key": "us-il-017",
            "value": 52
        },
        {
            "hc-key": "us-il-009",
            "value": 53
        },
        {
            "hc-key": "us-il-137",
            "value": 54
        },
        {
            "hc-key": "us-il-117",
            "value": 55
        },
        {
            "hc-key": "us-il-005",
            "value": 56
        },
        {
            "hc-key": "us-il-191",
            "value": 57
        },
        {
            "hc-key": "us-il-167",
            "value": 58
        },
        {
            "hc-key": "us-il-153",
            "value": 59
        },
        {
            "hc-key": "us-il-127",
            "value": 60
        },
        {
            "hc-key": "us-il-065",
            "value": 61
        },
        {
            "hc-key": "us-il-047",
            "value": 62
        },
        {
            "hc-key": "us-il-173",
            "value": 63
        },
        {
            "hc-key": "us-il-115",
            "value": 64
        },
        {
            "hc-key": "us-il-021",
            "value": 65
        },
        {
            "hc-key": "us-il-031",
            "value": 66
        },
        {
            "hc-key": "us-il-131",
            "value": 67
        },
        {
            "hc-key": "us-il-183",
            "value": 68
        },
        {
            "hc-key": "us-il-185",
            "value": 69
        },
        {
            "hc-key": "us-il-101",
            "value": 70
        },
        {
            "hc-key": "us-il-111",
            "value": 71
        },
        {
            "hc-key": "us-il-179",
            "value": 72
        },
        {
            "hc-key": "us-il-055",
            "value": 73
        },
        {
            "hc-key": "us-il-081",
            "value": 74
        },
        {
            "hc-key": "us-il-141",
            "value": 75
        },
        {
            "hc-key": "us-il-067",
            "value": 76
        },
        {
            "hc-key": "us-il-169",
            "value": 77
        },
        {
            "hc-key": "us-il-079",
            "value": 78
        },
        {
            "hc-key": "us-il-023",
            "value": 79
        },
        {
            "hc-key": "us-il-091",
            "value": 80
        },
        {
            "hc-key": "us-il-125",
            "value": 81
        },
        {
            "hc-key": "us-il-159",
            "value": 82
        },
        {
            "hc-key": "us-il-165",
            "value": 83
        },
        {
            "hc-key": "us-il-069",
            "value": 84
        },
        {
            "hc-key": "us-il-151",
            "value": 85
        },
        {
            "hc-key": "us-il-133",
            "value": 86
        },
        {
            "hc-key": "us-il-177",
            "value": 87
        },
        {
            "hc-key": "us-il-161",
            "value": 88
        },
        {
            "hc-key": "us-il-001",
            "value": 89
        },
        {
            "hc-key": "us-il-075",
            "value": 90
        },
        {
            "hc-key": "us-il-087",
            "value": 91
        },
        {
            "hc-key": "us-il-095",
            "value": 92
        },
        {
            "hc-key": "us-il-013",
            "value": 93
        },
        {
            "hc-key": "us-il-171",
            "value": 94
        },
        {
            "hc-key": "us-il-015",
            "value": 95
        },
        {
            "hc-key": "us-il-063",
            "value": 96
        },
        {
            "hc-key": "us-il-085",
            "value": 97
        },
        {
            "hc-key": "us-il-199",
            "value": 98
        },
        {
            "hc-key": "us-il-033",
            "value": 99
        },
        {
            "hc-key": "us-il-097",
            "value": 100
        },
        {
            "hc-key": "us-il-139",
            "value": 101
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-il-all.js">Illinois</a>'
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
            mapData: Highcharts.maps['countries/us/us-il-all'],
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

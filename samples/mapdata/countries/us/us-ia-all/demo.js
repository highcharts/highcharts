$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ia-125",
            "value": 0
        },
        {
            "hc-key": "us-ia-123",
            "value": 1
        },
        {
            "hc-key": "us-ia-041",
            "value": 2
        },
        {
            "hc-key": "us-ia-141",
            "value": 3
        },
        {
            "hc-key": "us-ia-151",
            "value": 4
        },
        {
            "hc-key": "us-ia-187",
            "value": 5
        },
        {
            "hc-key": "us-ia-025",
            "value": 6
        },
        {
            "hc-key": "us-ia-001",
            "value": 7
        },
        {
            "hc-key": "us-ia-175",
            "value": 8
        },
        {
            "hc-key": "us-ia-115",
            "value": 9
        },
        {
            "hc-key": "us-ia-087",
            "value": 10
        },
        {
            "hc-key": "us-ia-183",
            "value": 11
        },
        {
            "hc-key": "us-ia-101",
            "value": 12
        },
        {
            "hc-key": "us-ia-119",
            "value": 13
        },
        {
            "hc-key": "us-ia-143",
            "value": 14
        },
        {
            "hc-key": "us-ia-153",
            "value": 15
        },
        {
            "hc-key": "us-ia-015",
            "value": 16
        },
        {
            "hc-key": "us-ia-157",
            "value": 17
        },
        {
            "hc-key": "us-ia-107",
            "value": 18
        },
        {
            "hc-key": "us-ia-179",
            "value": 19
        },
        {
            "hc-key": "us-ia-147",
            "value": 20
        },
        {
            "hc-key": "us-ia-063",
            "value": 21
        },
        {
            "hc-key": "us-ia-079",
            "value": 22
        },
        {
            "hc-key": "us-ia-033",
            "value": 23
        },
        {
            "hc-key": "us-ia-069",
            "value": 24
        },
        {
            "hc-key": "us-ia-169",
            "value": 25
        },
        {
            "hc-key": "us-ia-047",
            "value": 26
        },
        {
            "hc-key": "us-ia-085",
            "value": 27
        },
        {
            "hc-key": "us-ia-121",
            "value": 28
        },
        {
            "hc-key": "us-ia-171",
            "value": 29
        },
        {
            "hc-key": "us-ia-013",
            "value": 30
        },
        {
            "hc-key": "us-ia-039",
            "value": 31
        },
        {
            "hc-key": "us-ia-011",
            "value": 32
        },
        {
            "hc-key": "us-ia-019",
            "value": 33
        },
        {
            "hc-key": "us-ia-181",
            "value": 34
        },
        {
            "hc-key": "us-ia-117",
            "value": 35
        },
        {
            "hc-key": "us-ia-099",
            "value": 36
        },
        {
            "hc-key": "us-ia-003",
            "value": 37
        },
        {
            "hc-key": "us-ia-105",
            "value": 38
        },
        {
            "hc-key": "us-ia-061",
            "value": 39
        },
        {
            "hc-key": "us-ia-055",
            "value": 40
        },
        {
            "hc-key": "us-ia-155",
            "value": 41
        },
        {
            "hc-key": "us-ia-137",
            "value": 42
        },
        {
            "hc-key": "us-ia-029",
            "value": 43
        },
        {
            "hc-key": "us-ia-145",
            "value": 44
        },
        {
            "hc-key": "us-ia-129",
            "value": 45
        },
        {
            "hc-key": "us-ia-081",
            "value": 46
        },
        {
            "hc-key": "us-ia-197",
            "value": 47
        },
        {
            "hc-key": "us-ia-161",
            "value": 48
        },
        {
            "hc-key": "us-ia-027",
            "value": 49
        },
        {
            "hc-key": "us-ia-113",
            "value": 50
        },
        {
            "hc-key": "us-ia-017",
            "value": 51
        },
        {
            "hc-key": "us-ia-037",
            "value": 52
        },
        {
            "hc-key": "us-ia-067",
            "value": 53
        },
        {
            "hc-key": "us-ia-065",
            "value": 54
        },
        {
            "hc-key": "us-ia-043",
            "value": 55
        },
        {
            "hc-key": "us-ia-189",
            "value": 56
        },
        {
            "hc-key": "us-ia-195",
            "value": 57
        },
        {
            "hc-key": "us-ia-021",
            "value": 58
        },
        {
            "hc-key": "us-ia-035",
            "value": 59
        },
        {
            "hc-key": "us-ia-193",
            "value": 60
        },
        {
            "hc-key": "us-ia-135",
            "value": 61
        },
        {
            "hc-key": "us-ia-103",
            "value": 62
        },
        {
            "hc-key": "us-ia-177",
            "value": 63
        },
        {
            "hc-key": "us-ia-111",
            "value": 64
        },
        {
            "hc-key": "us-ia-083",
            "value": 65
        },
        {
            "hc-key": "us-ia-127",
            "value": 66
        },
        {
            "hc-key": "us-ia-009",
            "value": 67
        },
        {
            "hc-key": "us-ia-165",
            "value": 68
        },
        {
            "hc-key": "us-ia-031",
            "value": 69
        },
        {
            "hc-key": "us-ia-045",
            "value": 70
        },
        {
            "hc-key": "us-ia-023",
            "value": 71
        },
        {
            "hc-key": "us-ia-131",
            "value": 72
        },
        {
            "hc-key": "us-ia-095",
            "value": 73
        },
        {
            "hc-key": "us-ia-073",
            "value": 74
        },
        {
            "hc-key": "us-ia-049",
            "value": 75
        },
        {
            "hc-key": "us-ia-077",
            "value": 76
        },
        {
            "hc-key": "us-ia-191",
            "value": 77
        },
        {
            "hc-key": "us-ia-133",
            "value": 78
        },
        {
            "hc-key": "us-ia-093",
            "value": 79
        },
        {
            "hc-key": "us-ia-007",
            "value": 80
        },
        {
            "hc-key": "us-ia-075",
            "value": 81
        },
        {
            "hc-key": "us-ia-059",
            "value": 82
        },
        {
            "hc-key": "us-ia-139",
            "value": 83
        },
        {
            "hc-key": "us-ia-173",
            "value": 84
        },
        {
            "hc-key": "us-ia-149",
            "value": 85
        },
        {
            "hc-key": "us-ia-109",
            "value": 86
        },
        {
            "hc-key": "us-ia-053",
            "value": 87
        },
        {
            "hc-key": "us-ia-159",
            "value": 88
        },
        {
            "hc-key": "us-ia-051",
            "value": 89
        },
        {
            "hc-key": "us-ia-185",
            "value": 90
        },
        {
            "hc-key": "us-ia-057",
            "value": 91
        },
        {
            "hc-key": "us-ia-163",
            "value": 92
        },
        {
            "hc-key": "us-ia-097",
            "value": 93
        },
        {
            "hc-key": "us-ia-091",
            "value": 94
        },
        {
            "hc-key": "us-ia-071",
            "value": 95
        },
        {
            "hc-key": "us-ia-167",
            "value": 96
        },
        {
            "hc-key": "us-ia-089",
            "value": 97
        },
        {
            "hc-key": "us-ia-005",
            "value": 98
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ia-all.js">Iowa</a>'
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
            mapData: Highcharts.maps['countries/us/us-ia-all'],
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

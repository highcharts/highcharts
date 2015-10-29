$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-nc-031",
            "value": 0
        },
        {
            "hc-key": "us-nc-187",
            "value": 1
        },
        {
            "hc-key": "us-nc-095",
            "value": 2
        },
        {
            "hc-key": "us-nc-129",
            "value": 3
        },
        {
            "hc-key": "us-nc-183",
            "value": 4
        },
        {
            "hc-key": "us-nc-077",
            "value": 5
        },
        {
            "hc-key": "us-nc-121",
            "value": 6
        },
        {
            "hc-key": "us-nc-011",
            "value": 7
        },
        {
            "hc-key": "us-nc-091",
            "value": 8
        },
        {
            "hc-key": "us-nc-033",
            "value": 9
        },
        {
            "hc-key": "us-nc-001",
            "value": 10
        },
        {
            "hc-key": "us-nc-019",
            "value": 11
        },
        {
            "hc-key": "us-nc-087",
            "value": 12
        },
        {
            "hc-key": "us-nc-175",
            "value": 13
        },
        {
            "hc-key": "us-nc-153",
            "value": 14
        },
        {
            "hc-key": "us-nc-107",
            "value": 15
        },
        {
            "hc-key": "us-nc-191",
            "value": 16
        },
        {
            "hc-key": "us-nc-079",
            "value": 17
        },
        {
            "hc-key": "us-nc-161",
            "value": 18
        },
        {
            "hc-key": "us-nc-101",
            "value": 19
        },
        {
            "hc-key": "us-nc-127",
            "value": 20
        },
        {
            "hc-key": "us-nc-081",
            "value": 21
        },
        {
            "hc-key": "us-nc-157",
            "value": 22
        },
        {
            "hc-key": "us-nc-013",
            "value": 23
        },
        {
            "hc-key": "us-nc-137",
            "value": 24
        },
        {
            "hc-key": "us-nc-103",
            "value": 25
        },
        {
            "hc-key": "us-nc-049",
            "value": 26
        },
        {
            "hc-key": "us-nc-063",
            "value": 27
        },
        {
            "hc-key": "us-nc-037",
            "value": 28
        },
        {
            "hc-key": "us-nc-185",
            "value": 29
        },
        {
            "hc-key": "us-nc-131",
            "value": 30
        },
        {
            "hc-key": "us-nc-065",
            "value": 31
        },
        {
            "hc-key": "us-nc-195",
            "value": 32
        },
        {
            "hc-key": "us-nc-145",
            "value": 33
        },
        {
            "hc-key": "us-nc-083",
            "value": 34
        },
        {
            "hc-key": "us-nc-117",
            "value": 35
        },
        {
            "hc-key": "us-nc-135",
            "value": 36
        },
        {
            "hc-key": "us-nc-055",
            "value": 37
        },
        {
            "hc-key": "us-nc-099",
            "value": 38
        },
        {
            "hc-key": "us-nc-159",
            "value": 39
        },
        {
            "hc-key": "us-nc-097",
            "value": 40
        },
        {
            "hc-key": "us-nc-025",
            "value": 41
        },
        {
            "hc-key": "us-nc-179",
            "value": 42
        },
        {
            "hc-key": "us-nc-181",
            "value": 43
        },
        {
            "hc-key": "us-nc-177",
            "value": 44
        },
        {
            "hc-key": "us-nc-189",
            "value": 45
        },
        {
            "hc-key": "us-nc-193",
            "value": 46
        },
        {
            "hc-key": "us-nc-003",
            "value": 47
        },
        {
            "hc-key": "us-nc-027",
            "value": 48
        },
        {
            "hc-key": "us-nc-151",
            "value": 49
        },
        {
            "hc-key": "us-nc-041",
            "value": 50
        },
        {
            "hc-key": "us-nc-073",
            "value": 51
        },
        {
            "hc-key": "us-nc-139",
            "value": 52
        },
        {
            "hc-key": "us-nc-039",
            "value": 53
        },
        {
            "hc-key": "us-nc-113",
            "value": 54
        },
        {
            "hc-key": "us-nc-133",
            "value": 55
        },
        {
            "hc-key": "us-nc-045",
            "value": 56
        },
        {
            "hc-key": "us-nc-109",
            "value": 57
        },
        {
            "hc-key": "us-nc-119",
            "value": 58
        },
        {
            "hc-key": "us-nc-199",
            "value": 59
        },
        {
            "hc-key": "us-nc-089",
            "value": 60
        },
        {
            "hc-key": "us-nc-147",
            "value": 61
        },
        {
            "hc-key": "us-nc-143",
            "value": 62
        },
        {
            "hc-key": "us-nc-125",
            "value": 63
        },
        {
            "hc-key": "us-nc-007",
            "value": 64
        },
        {
            "hc-key": "us-nc-141",
            "value": 65
        },
        {
            "hc-key": "us-nc-163",
            "value": 66
        },
        {
            "hc-key": "us-nc-085",
            "value": 67
        },
        {
            "hc-key": "us-nc-155",
            "value": 68
        },
        {
            "hc-key": "us-nc-051",
            "value": 69
        },
        {
            "hc-key": "us-nc-075",
            "value": 70
        },
        {
            "hc-key": "us-nc-023",
            "value": 71
        },
        {
            "hc-key": "us-nc-165",
            "value": 72
        },
        {
            "hc-key": "us-nc-093",
            "value": 73
        },
        {
            "hc-key": "us-nc-111",
            "value": 74
        },
        {
            "hc-key": "us-nc-047",
            "value": 75
        },
        {
            "hc-key": "us-nc-061",
            "value": 76
        },
        {
            "hc-key": "us-nc-197",
            "value": 77
        },
        {
            "hc-key": "us-nc-067",
            "value": 78
        },
        {
            "hc-key": "us-nc-171",
            "value": 79
        },
        {
            "hc-key": "us-nc-169",
            "value": 80
        },
        {
            "hc-key": "us-nc-057",
            "value": 81
        },
        {
            "hc-key": "us-nc-059",
            "value": 82
        },
        {
            "hc-key": "us-nc-029",
            "value": 83
        },
        {
            "hc-key": "us-nc-053",
            "value": 84
        },
        {
            "hc-key": "us-nc-009",
            "value": 85
        },
        {
            "hc-key": "us-nc-115",
            "value": 86
        },
        {
            "hc-key": "us-nc-021",
            "value": 87
        },
        {
            "hc-key": "us-nc-071",
            "value": 88
        },
        {
            "hc-key": "us-nc-015",
            "value": 89
        },
        {
            "hc-key": "us-nc-173",
            "value": 90
        },
        {
            "hc-key": "us-nc-035",
            "value": 91
        },
        {
            "hc-key": "us-nc-069",
            "value": 92
        },
        {
            "hc-key": "us-nc-005",
            "value": 93
        },
        {
            "hc-key": "us-nc-123",
            "value": 94
        },
        {
            "hc-key": "us-nc-149",
            "value": 95
        },
        {
            "hc-key": "us-nc-105",
            "value": 96
        },
        {
            "hc-key": "us-nc-043",
            "value": 97
        },
        {
            "hc-key": "us-nc-017",
            "value": 98
        },
        {
            "hc-key": "us-nc-167",
            "value": 99
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-nc-all.js">North Carolina</a>'
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
            mapData: Highcharts.maps['countries/us/us-nc-all'],
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

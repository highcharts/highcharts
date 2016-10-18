$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-tn-023",
            "value": 0
        },
        {
            "hc-key": "us-tn-069",
            "value": 1
        },
        {
            "hc-key": "us-tn-113",
            "value": 2
        },
        {
            "hc-key": "us-tn-077",
            "value": 3
        },
        {
            "hc-key": "us-tn-157",
            "value": 4
        },
        {
            "hc-key": "us-tn-033",
            "value": 5
        },
        {
            "hc-key": "us-tn-053",
            "value": 6
        },
        {
            "hc-key": "us-tn-021",
            "value": 7
        },
        {
            "hc-key": "us-tn-147",
            "value": 8
        },
        {
            "hc-key": "us-tn-105",
            "value": 9
        },
        {
            "hc-key": "us-tn-037",
            "value": 10
        },
        {
            "hc-key": "us-tn-107",
            "value": 11
        },
        {
            "hc-key": "us-tn-011",
            "value": 12
        },
        {
            "hc-key": "us-tn-043",
            "value": 13
        },
        {
            "hc-key": "us-tn-125",
            "value": 14
        },
        {
            "hc-key": "us-tn-047",
            "value": 15
        },
        {
            "hc-key": "us-tn-167",
            "value": 16
        },
        {
            "hc-key": "us-tn-177",
            "value": 17
        },
        {
            "hc-key": "us-tn-031",
            "value": 18
        },
        {
            "hc-key": "us-tn-163",
            "value": 19
        },
        {
            "hc-key": "us-tn-091",
            "value": 20
        },
        {
            "hc-key": "us-tn-187",
            "value": 21
        },
        {
            "hc-key": "us-tn-019",
            "value": 22
        },
        {
            "hc-key": "us-tn-179",
            "value": 23
        },
        {
            "hc-key": "us-tn-073",
            "value": 24
        },
        {
            "hc-key": "us-tn-149",
            "value": 25
        },
        {
            "hc-key": "us-tn-189",
            "value": 26
        },
        {
            "hc-key": "us-tn-015",
            "value": 27
        },
        {
            "hc-key": "us-tn-175",
            "value": 28
        },
        {
            "hc-key": "us-tn-007",
            "value": 29
        },
        {
            "hc-key": "us-tn-035",
            "value": 30
        },
        {
            "hc-key": "us-tn-057",
            "value": 31
        },
        {
            "hc-key": "us-tn-173",
            "value": 32
        },
        {
            "hc-key": "us-tn-051",
            "value": 33
        },
        {
            "hc-key": "us-tn-145",
            "value": 34
        },
        {
            "hc-key": "us-tn-087",
            "value": 35
        },
        {
            "hc-key": "us-tn-133",
            "value": 36
        },
        {
            "hc-key": "us-tn-001",
            "value": 37
        },
        {
            "hc-key": "us-tn-151",
            "value": 38
        },
        {
            "hc-key": "us-tn-097",
            "value": 39
        },
        {
            "hc-key": "us-tn-119",
            "value": 40
        },
        {
            "hc-key": "us-tn-027",
            "value": 41
        },
        {
            "hc-key": "us-tn-111",
            "value": 42
        },
        {
            "hc-key": "us-tn-041",
            "value": 43
        },
        {
            "hc-key": "us-tn-039",
            "value": 44
        },
        {
            "hc-key": "us-tn-017",
            "value": 45
        },
        {
            "hc-key": "us-tn-161",
            "value": 46
        },
        {
            "hc-key": "us-tn-005",
            "value": 47
        },
        {
            "hc-key": "us-tn-159",
            "value": 48
        },
        {
            "hc-key": "us-tn-141",
            "value": 49
        },
        {
            "hc-key": "us-tn-049",
            "value": 50
        },
        {
            "hc-key": "us-tn-103",
            "value": 51
        },
        {
            "hc-key": "us-tn-003",
            "value": 52
        },
        {
            "hc-key": "us-tn-137",
            "value": 53
        },
        {
            "hc-key": "us-tn-123",
            "value": 54
        },
        {
            "hc-key": "us-tn-093",
            "value": 55
        },
        {
            "hc-key": "us-tn-135",
            "value": 56
        },
        {
            "hc-key": "us-tn-059",
            "value": 57
        },
        {
            "hc-key": "us-tn-171",
            "value": 58
        },
        {
            "hc-key": "us-tn-071",
            "value": 59
        },
        {
            "hc-key": "us-tn-117",
            "value": 60
        },
        {
            "hc-key": "us-tn-055",
            "value": 61
        },
        {
            "hc-key": "us-tn-099",
            "value": 62
        },
        {
            "hc-key": "us-tn-185",
            "value": 63
        },
        {
            "hc-key": "us-tn-153",
            "value": 64
        },
        {
            "hc-key": "us-tn-127",
            "value": 65
        },
        {
            "hc-key": "us-tn-143",
            "value": 66
        },
        {
            "hc-key": "us-tn-065",
            "value": 67
        },
        {
            "hc-key": "us-tn-079",
            "value": 68
        },
        {
            "hc-key": "us-tn-155",
            "value": 69
        },
        {
            "hc-key": "us-tn-109",
            "value": 70
        },
        {
            "hc-key": "us-tn-013",
            "value": 71
        },
        {
            "hc-key": "us-tn-009",
            "value": 72
        },
        {
            "hc-key": "us-tn-121",
            "value": 73
        },
        {
            "hc-key": "us-tn-165",
            "value": 74
        },
        {
            "hc-key": "us-tn-115",
            "value": 75
        },
        {
            "hc-key": "us-tn-045",
            "value": 76
        },
        {
            "hc-key": "us-tn-169",
            "value": 77
        },
        {
            "hc-key": "us-tn-095",
            "value": 78
        },
        {
            "hc-key": "us-tn-131",
            "value": 79
        },
        {
            "hc-key": "us-tn-183",
            "value": 80
        },
        {
            "hc-key": "us-tn-089",
            "value": 81
        },
        {
            "hc-key": "us-tn-029",
            "value": 82
        },
        {
            "hc-key": "us-tn-067",
            "value": 83
        },
        {
            "hc-key": "us-tn-139",
            "value": 84
        },
        {
            "hc-key": "us-tn-081",
            "value": 85
        },
        {
            "hc-key": "us-tn-085",
            "value": 86
        },
        {
            "hc-key": "us-tn-181",
            "value": 87
        },
        {
            "hc-key": "us-tn-025",
            "value": 88
        },
        {
            "hc-key": "us-tn-061",
            "value": 89
        },
        {
            "hc-key": "us-tn-075",
            "value": 90
        },
        {
            "hc-key": "us-tn-101",
            "value": 91
        },
        {
            "hc-key": "us-tn-129",
            "value": 92
        },
        {
            "hc-key": "us-tn-083",
            "value": 93
        },
        {
            "hc-key": "us-tn-063",
            "value": 94
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-tn-all.js">Tennessee</a>'
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
            mapData: Highcharts.maps['countries/us/us-tn-all'],
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

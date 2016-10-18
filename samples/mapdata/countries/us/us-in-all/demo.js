$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-in-139",
            "value": 0
        },
        {
            "hc-key": "us-in-031",
            "value": 1
        },
        {
            "hc-key": "us-in-149",
            "value": 2
        },
        {
            "hc-key": "us-in-099",
            "value": 3
        },
        {
            "hc-key": "us-in-033",
            "value": 4
        },
        {
            "hc-key": "us-in-151",
            "value": 5
        },
        {
            "hc-key": "us-in-043",
            "value": 6
        },
        {
            "hc-key": "us-in-019",
            "value": 7
        },
        {
            "hc-key": "us-in-181",
            "value": 8
        },
        {
            "hc-key": "us-in-131",
            "value": 9
        },
        {
            "hc-key": "us-in-153",
            "value": 10
        },
        {
            "hc-key": "us-in-021",
            "value": 11
        },
        {
            "hc-key": "us-in-045",
            "value": 12
        },
        {
            "hc-key": "us-in-165",
            "value": 13
        },
        {
            "hc-key": "us-in-039",
            "value": 14
        },
        {
            "hc-key": "us-in-087",
            "value": 15
        },
        {
            "hc-key": "us-in-093",
            "value": 16
        },
        {
            "hc-key": "us-in-071",
            "value": 17
        },
        {
            "hc-key": "us-in-171",
            "value": 18
        },
        {
            "hc-key": "us-in-121",
            "value": 19
        },
        {
            "hc-key": "us-in-167",
            "value": 20
        },
        {
            "hc-key": "us-in-015",
            "value": 21
        },
        {
            "hc-key": "us-in-065",
            "value": 22
        },
        {
            "hc-key": "us-in-095",
            "value": 23
        },
        {
            "hc-key": "us-in-053",
            "value": 24
        },
        {
            "hc-key": "us-in-069",
            "value": 25
        },
        {
            "hc-key": "us-in-003",
            "value": 26
        },
        {
            "hc-key": "us-in-157",
            "value": 27
        },
        {
            "hc-key": "us-in-023",
            "value": 28
        },
        {
            "hc-key": "us-in-159",
            "value": 29
        },
        {
            "hc-key": "us-in-067",
            "value": 30
        },
        {
            "hc-key": "us-in-057",
            "value": 31
        },
        {
            "hc-key": "us-in-059",
            "value": 32
        },
        {
            "hc-key": "us-in-111",
            "value": 33
        },
        {
            "hc-key": "us-in-073",
            "value": 34
        },
        {
            "hc-key": "us-in-135",
            "value": 35
        },
        {
            "hc-key": "us-in-035",
            "value": 36
        },
        {
            "hc-key": "us-in-005",
            "value": 37
        },
        {
            "hc-key": "us-in-081",
            "value": 38
        },
        {
            "hc-key": "us-in-013",
            "value": 39
        },
        {
            "hc-key": "us-in-055",
            "value": 40
        },
        {
            "hc-key": "us-in-109",
            "value": 41
        },
        {
            "hc-key": "us-in-133",
            "value": 42
        },
        {
            "hc-key": "us-in-105",
            "value": 43
        },
        {
            "hc-key": "us-in-137",
            "value": 44
        },
        {
            "hc-key": "us-in-049",
            "value": 45
        },
        {
            "hc-key": "us-in-169",
            "value": 46
        },
        {
            "hc-key": "us-in-113",
            "value": 47
        },
        {
            "hc-key": "us-in-075",
            "value": 48
        },
        {
            "hc-key": "us-in-041",
            "value": 49
        },
        {
            "hc-key": "us-in-027",
            "value": 50
        },
        {
            "hc-key": "us-in-101",
            "value": 51
        },
        {
            "hc-key": "us-in-103",
            "value": 52
        },
        {
            "hc-key": "us-in-179",
            "value": 53
        },
        {
            "hc-key": "us-in-009",
            "value": 54
        },
        {
            "hc-key": "us-in-079",
            "value": 55
        },
        {
            "hc-key": "us-in-143",
            "value": 56
        },
        {
            "hc-key": "us-in-115",
            "value": 57
        },
        {
            "hc-key": "us-in-029",
            "value": 58
        },
        {
            "hc-key": "us-in-175",
            "value": 59
        },
        {
            "hc-key": "us-in-107",
            "value": 60
        },
        {
            "hc-key": "us-in-063",
            "value": 61
        },
        {
            "hc-key": "us-in-145",
            "value": 62
        },
        {
            "hc-key": "us-in-097",
            "value": 63
        },
        {
            "hc-key": "us-in-011",
            "value": 64
        },
        {
            "hc-key": "us-in-141",
            "value": 65
        },
        {
            "hc-key": "us-in-037",
            "value": 66
        },
        {
            "hc-key": "us-in-117",
            "value": 67
        },
        {
            "hc-key": "us-in-025",
            "value": 68
        },
        {
            "hc-key": "us-in-083",
            "value": 69
        },
        {
            "hc-key": "us-in-173",
            "value": 70
        },
        {
            "hc-key": "us-in-163",
            "value": 71
        },
        {
            "hc-key": "us-in-051",
            "value": 72
        },
        {
            "hc-key": "us-in-089",
            "value": 73
        },
        {
            "hc-key": "us-in-007",
            "value": 74
        },
        {
            "hc-key": "us-in-125",
            "value": 75
        },
        {
            "hc-key": "us-in-155",
            "value": 76
        },
        {
            "hc-key": "us-in-123",
            "value": 77
        },
        {
            "hc-key": "us-in-161",
            "value": 78
        },
        {
            "hc-key": "us-in-147",
            "value": 79
        },
        {
            "hc-key": "us-in-001",
            "value": 80
        },
        {
            "hc-key": "us-in-129",
            "value": 81
        },
        {
            "hc-key": "us-in-061",
            "value": 82
        },
        {
            "hc-key": "us-in-017",
            "value": 83
        },
        {
            "hc-key": "us-in-085",
            "value": 84
        },
        {
            "hc-key": "us-in-047",
            "value": 85
        },
        {
            "hc-key": "us-in-119",
            "value": 86
        },
        {
            "hc-key": "us-in-077",
            "value": 87
        },
        {
            "hc-key": "us-in-091",
            "value": 88
        },
        {
            "hc-key": "us-in-127",
            "value": 89
        },
        {
            "hc-key": "us-in-177",
            "value": 90
        },
        {
            "hc-key": "us-in-183",
            "value": 91
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-in-all.js">Indiana</a>'
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
            mapData: Highcharts.maps['countries/us/us-in-all'],
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

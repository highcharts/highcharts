$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ne-085",
            "value": 0
        },
        {
            "hc-key": "us-ne-087",
            "value": 1
        },
        {
            "hc-key": "us-ne-037",
            "value": 2
        },
        {
            "hc-key": "us-ne-053",
            "value": 3
        },
        {
            "hc-key": "us-ne-157",
            "value": 4
        },
        {
            "hc-key": "us-ne-165",
            "value": 5
        },
        {
            "hc-key": "us-ne-059",
            "value": 6
        },
        {
            "hc-key": "us-ne-169",
            "value": 7
        },
        {
            "hc-key": "us-ne-083",
            "value": 8
        },
        {
            "hc-key": "us-ne-065",
            "value": 9
        },
        {
            "hc-key": "us-ne-179",
            "value": 10
        },
        {
            "hc-key": "us-ne-139",
            "value": 11
        },
        {
            "hc-key": "us-ne-077",
            "value": 12
        },
        {
            "hc-key": "us-ne-011",
            "value": 13
        },
        {
            "hc-key": "us-ne-183",
            "value": 14
        },
        {
            "hc-key": "us-ne-027",
            "value": 15
        },
        {
            "hc-key": "us-ne-095",
            "value": 16
        },
        {
            "hc-key": "us-ne-151",
            "value": 17
        },
        {
            "hc-key": "us-ne-035",
            "value": 18
        },
        {
            "hc-key": "us-ne-079",
            "value": 19
        },
        {
            "hc-key": "us-ne-001",
            "value": 20
        },
        {
            "hc-key": "us-ne-185",
            "value": 21
        },
        {
            "hc-key": "us-ne-159",
            "value": 22
        },
        {
            "hc-key": "us-ne-067",
            "value": 23
        },
        {
            "hc-key": "us-ne-097",
            "value": 24
        },
        {
            "hc-key": "us-ne-007",
            "value": 25
        },
        {
            "hc-key": "us-ne-123",
            "value": 26
        },
        {
            "hc-key": "us-ne-019",
            "value": 27
        },
        {
            "hc-key": "us-ne-041",
            "value": 28
        },
        {
            "hc-key": "us-ne-131",
            "value": 29
        },
        {
            "hc-key": "us-ne-127",
            "value": 30
        },
        {
            "hc-key": "us-ne-141",
            "value": 31
        },
        {
            "hc-key": "us-ne-125",
            "value": 32
        },
        {
            "hc-key": "us-ne-133",
            "value": 33
        },
        {
            "hc-key": "us-ne-109",
            "value": 34
        },
        {
            "hc-key": "us-ne-161",
            "value": 35
        },
        {
            "hc-key": "us-ne-075",
            "value": 36
        },
        {
            "hc-key": "us-ne-137",
            "value": 37
        },
        {
            "hc-key": "us-ne-047",
            "value": 38
        },
        {
            "hc-key": "us-ne-111",
            "value": 39
        },
        {
            "hc-key": "us-ne-003",
            "value": 40
        },
        {
            "hc-key": "us-ne-167",
            "value": 41
        },
        {
            "hc-key": "us-ne-063",
            "value": 42
        },
        {
            "hc-key": "us-ne-057",
            "value": 43
        },
        {
            "hc-key": "us-ne-033",
            "value": 44
        },
        {
            "hc-key": "us-ne-055",
            "value": 45
        },
        {
            "hc-key": "us-ne-105",
            "value": 46
        },
        {
            "hc-key": "us-ne-081",
            "value": 47
        },
        {
            "hc-key": "us-ne-017",
            "value": 48
        },
        {
            "hc-key": "us-ne-115",
            "value": 49
        },
        {
            "hc-key": "us-ne-009",
            "value": 50
        },
        {
            "hc-key": "us-ne-113",
            "value": 51
        },
        {
            "hc-key": "us-ne-121",
            "value": 52
        },
        {
            "hc-key": "us-ne-163",
            "value": 53
        },
        {
            "hc-key": "us-ne-023",
            "value": 54
        },
        {
            "hc-key": "us-ne-143",
            "value": 55
        },
        {
            "hc-key": "us-ne-175",
            "value": 56
        },
        {
            "hc-key": "us-ne-025",
            "value": 57
        },
        {
            "hc-key": "us-ne-119",
            "value": 58
        },
        {
            "hc-key": "us-ne-181",
            "value": 59
        },
        {
            "hc-key": "us-ne-129",
            "value": 60
        },
        {
            "hc-key": "us-ne-099",
            "value": 61
        },
        {
            "hc-key": "us-ne-089",
            "value": 62
        },
        {
            "hc-key": "us-ne-031",
            "value": 63
        },
        {
            "hc-key": "us-ne-103",
            "value": 64
        },
        {
            "hc-key": "us-ne-015",
            "value": 65
        },
        {
            "hc-key": "us-ne-093",
            "value": 66
        },
        {
            "hc-key": "us-ne-071",
            "value": 67
        },
        {
            "hc-key": "us-ne-135",
            "value": 68
        },
        {
            "hc-key": "us-ne-049",
            "value": 69
        },
        {
            "hc-key": "us-ne-101",
            "value": 70
        },
        {
            "hc-key": "us-ne-107",
            "value": 71
        },
        {
            "hc-key": "us-ne-153",
            "value": 72
        },
        {
            "hc-key": "us-ne-155",
            "value": 73
        },
        {
            "hc-key": "us-ne-013",
            "value": 74
        },
        {
            "hc-key": "us-ne-005",
            "value": 75
        },
        {
            "hc-key": "us-ne-091",
            "value": 76
        },
        {
            "hc-key": "us-ne-061",
            "value": 77
        },
        {
            "hc-key": "us-ne-029",
            "value": 78
        },
        {
            "hc-key": "us-ne-021",
            "value": 79
        },
        {
            "hc-key": "us-ne-147",
            "value": 80
        },
        {
            "hc-key": "us-ne-069",
            "value": 81
        },
        {
            "hc-key": "us-ne-171",
            "value": 82
        },
        {
            "hc-key": "us-ne-073",
            "value": 83
        },
        {
            "hc-key": "us-ne-051",
            "value": 84
        },
        {
            "hc-key": "us-ne-043",
            "value": 85
        },
        {
            "hc-key": "us-ne-177",
            "value": 86
        },
        {
            "hc-key": "us-ne-039",
            "value": 87
        },
        {
            "hc-key": "us-ne-117",
            "value": 88
        },
        {
            "hc-key": "us-ne-145",
            "value": 89
        },
        {
            "hc-key": "us-ne-149",
            "value": 90
        },
        {
            "hc-key": "us-ne-045",
            "value": 91
        },
        {
            "hc-key": "us-ne-173",
            "value": 92
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ne-all.js">Nebraska</a>'
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
            mapData: Highcharts.maps['countries/us/us-ne-all'],
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

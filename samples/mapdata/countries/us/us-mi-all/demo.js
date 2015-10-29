$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-mi-089",
            "value": 0
        },
        {
            "hc-key": "us-mi-019",
            "value": 1
        },
        {
            "hc-key": "us-mi-003",
            "value": 2
        },
        {
            "hc-key": "us-mi-163",
            "value": 3
        },
        {
            "hc-key": "us-mi-033",
            "value": 4
        },
        {
            "hc-key": "us-mi-161",
            "value": 5
        },
        {
            "hc-key": "us-mi-059",
            "value": 6
        },
        {
            "hc-key": "us-mi-091",
            "value": 7
        },
        {
            "hc-key": "us-mi-115",
            "value": 8
        },
        {
            "hc-key": "us-mi-129",
            "value": 9
        },
        {
            "hc-key": "us-mi-069",
            "value": 10
        },
        {
            "hc-key": "us-mi-025",
            "value": 11
        },
        {
            "hc-key": "us-mi-023",
            "value": 12
        },
        {
            "hc-key": "us-mi-127",
            "value": 13
        },
        {
            "hc-key": "us-mi-123",
            "value": 14
        },
        {
            "hc-key": "us-mi-097",
            "value": 15
        },
        {
            "hc-key": "us-mi-077",
            "value": 16
        },
        {
            "hc-key": "us-mi-149",
            "value": 17
        },
        {
            "hc-key": "us-mi-055",
            "value": 18
        },
        {
            "hc-key": "us-mi-029",
            "value": 19
        },
        {
            "hc-key": "us-mi-145",
            "value": 20
        },
        {
            "hc-key": "us-mi-049",
            "value": 21
        },
        {
            "hc-key": "us-mi-015",
            "value": 22
        },
        {
            "hc-key": "us-mi-005",
            "value": 23
        },
        {
            "hc-key": "us-mi-071",
            "value": 24
        },
        {
            "hc-key": "us-mi-043",
            "value": 25
        },
        {
            "hc-key": "us-mi-103",
            "value": 26
        },
        {
            "hc-key": "us-mi-165",
            "value": 27
        },
        {
            "hc-key": "us-mi-101",
            "value": 28
        },
        {
            "hc-key": "us-mi-159",
            "value": 29
        },
        {
            "hc-key": "us-mi-027",
            "value": 30
        },
        {
            "hc-key": "us-mi-139",
            "value": 31
        },
        {
            "hc-key": "us-mi-009",
            "value": 32
        },
        {
            "hc-key": "us-mi-137",
            "value": 33
        },
        {
            "hc-key": "us-mi-007",
            "value": 34
        },
        {
            "hc-key": "us-mi-119",
            "value": 35
        },
        {
            "hc-key": "us-mi-155",
            "value": 36
        },
        {
            "hc-key": "us-mi-001",
            "value": 37
        },
        {
            "hc-key": "us-mi-135",
            "value": 38
        },
        {
            "hc-key": "us-mi-079",
            "value": 39
        },
        {
            "hc-key": "us-mi-039",
            "value": 40
        },
        {
            "hc-key": "us-mi-107",
            "value": 41
        },
        {
            "hc-key": "us-mi-095",
            "value": 42
        },
        {
            "hc-key": "us-mi-153",
            "value": 43
        },
        {
            "hc-key": "us-mi-075",
            "value": 44
        },
        {
            "hc-key": "us-mi-093",
            "value": 45
        },
        {
            "hc-key": "us-mi-045",
            "value": 46
        },
        {
            "hc-key": "us-mi-035",
            "value": 47
        },
        {
            "hc-key": "us-mi-073",
            "value": 48
        },
        {
            "hc-key": "us-mi-087",
            "value": 49
        },
        {
            "hc-key": "us-mi-099",
            "value": 50
        },
        {
            "hc-key": "us-mi-011",
            "value": 51
        },
        {
            "hc-key": "us-mi-085",
            "value": 52
        },
        {
            "hc-key": "us-mi-133",
            "value": 53
        },
        {
            "hc-key": "us-mi-131",
            "value": 54
        },
        {
            "hc-key": "us-mi-067",
            "value": 55
        },
        {
            "hc-key": "us-mi-157",
            "value": 56
        },
        {
            "hc-key": "us-mi-017",
            "value": 57
        },
        {
            "hc-key": "us-mi-109",
            "value": 58
        },
        {
            "hc-key": "us-mi-081",
            "value": 59
        },
        {
            "hc-key": "us-mi-057",
            "value": 60
        },
        {
            "hc-key": "us-mi-143",
            "value": 61
        },
        {
            "hc-key": "us-mi-121",
            "value": 62
        },
        {
            "hc-key": "us-mi-113",
            "value": 63
        },
        {
            "hc-key": "us-mi-037",
            "value": 64
        },
        {
            "hc-key": "us-mi-065",
            "value": 65
        },
        {
            "hc-key": "us-mi-031",
            "value": 66
        },
        {
            "hc-key": "us-mi-051",
            "value": 67
        },
        {
            "hc-key": "us-mi-111",
            "value": 68
        },
        {
            "hc-key": "us-mi-141",
            "value": 69
        },
        {
            "hc-key": "us-mi-041",
            "value": 70
        },
        {
            "hc-key": "us-mi-053",
            "value": 71
        },
        {
            "hc-key": "us-mi-047",
            "value": 72
        },
        {
            "hc-key": "us-mi-151",
            "value": 73
        },
        {
            "hc-key": "us-mi-013",
            "value": 74
        },
        {
            "hc-key": "us-mi-063",
            "value": 75
        },
        {
            "hc-key": "us-mi-105",
            "value": 76
        },
        {
            "hc-key": "us-mi-083",
            "value": 77
        },
        {
            "hc-key": "us-mi-021",
            "value": 78
        },
        {
            "hc-key": "us-mi-061",
            "value": 79
        },
        {
            "hc-key": "us-mi-125",
            "value": 80
        },
        {
            "hc-key": "us-mi-117",
            "value": 81
        },
        {
            "hc-key": "us-mi-147",
            "value": 82
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-mi-all.js">Michigan</a>'
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
            mapData: Highcharts.maps['countries/us/us-mi-all'],
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

$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-wi-111",
            "value": 0
        },
        {
            "hc-key": "us-wi-049",
            "value": 1
        },
        {
            "hc-key": "us-wi-003",
            "value": 2
        },
        {
            "hc-key": "us-wi-007",
            "value": 3
        },
        {
            "hc-key": "us-wi-113",
            "value": 4
        },
        {
            "hc-key": "us-wi-021",
            "value": 5
        },
        {
            "hc-key": "us-wi-001",
            "value": 6
        },
        {
            "hc-key": "us-wi-085",
            "value": 7
        },
        {
            "hc-key": "us-wi-099",
            "value": 8
        },
        {
            "hc-key": "us-wi-017",
            "value": 9
        },
        {
            "hc-key": "us-wi-019",
            "value": 10
        },
        {
            "hc-key": "us-wi-087",
            "value": 11
        },
        {
            "hc-key": "us-wi-115",
            "value": 12
        },
        {
            "hc-key": "us-wi-069",
            "value": 13
        },
        {
            "hc-key": "us-wi-055",
            "value": 14
        },
        {
            "hc-key": "us-wi-027",
            "value": 15
        },
        {
            "hc-key": "us-wi-125",
            "value": 16
        },
        {
            "hc-key": "us-wi-041",
            "value": 17
        },
        {
            "hc-key": "us-wi-047",
            "value": 18
        },
        {
            "hc-key": "us-wi-137",
            "value": 19
        },
        {
            "hc-key": "us-wi-045",
            "value": 20
        },
        {
            "hc-key": "us-wi-105",
            "value": 21
        },
        {
            "hc-key": "us-wi-127",
            "value": 22
        },
        {
            "hc-key": "us-wi-005",
            "value": 23
        },
        {
            "hc-key": "us-wi-093",
            "value": 24
        },
        {
            "hc-key": "us-wi-033",
            "value": 25
        },
        {
            "hc-key": "us-wi-107",
            "value": 26
        },
        {
            "hc-key": "us-wi-119",
            "value": 27
        },
        {
            "hc-key": "us-wi-101",
            "value": 28
        },
        {
            "hc-key": "us-wi-053",
            "value": 29
        },
        {
            "hc-key": "us-wi-035",
            "value": 30
        },
        {
            "hc-key": "us-wi-083",
            "value": 31
        },
        {
            "hc-key": "us-wi-009",
            "value": 32
        },
        {
            "hc-key": "us-wi-079",
            "value": 33
        },
        {
            "hc-key": "us-wi-089",
            "value": 34
        },
        {
            "hc-key": "us-wi-103",
            "value": 35
        },
        {
            "hc-key": "us-wi-023",
            "value": 36
        },
        {
            "hc-key": "us-wi-133",
            "value": 37
        },
        {
            "hc-key": "us-wi-057",
            "value": 38
        },
        {
            "hc-key": "us-wi-123",
            "value": 39
        },
        {
            "hc-key": "us-wi-025",
            "value": 40
        },
        {
            "hc-key": "us-wi-051",
            "value": 41
        },
        {
            "hc-key": "us-wi-135",
            "value": 42
        },
        {
            "hc-key": "us-wi-139",
            "value": 43
        },
        {
            "hc-key": "us-wi-061",
            "value": 44
        },
        {
            "hc-key": "us-wi-097",
            "value": 45
        },
        {
            "hc-key": "us-wi-015",
            "value": 46
        },
        {
            "hc-key": "us-wi-063",
            "value": 47
        },
        {
            "hc-key": "us-wi-073",
            "value": 48
        },
        {
            "hc-key": "us-wi-013",
            "value": 49
        },
        {
            "hc-key": "us-wi-121",
            "value": 50
        },
        {
            "hc-key": "us-wi-129",
            "value": 51
        },
        {
            "hc-key": "us-wi-091",
            "value": 52
        },
        {
            "hc-key": "us-wi-141",
            "value": 53
        },
        {
            "hc-key": "us-wi-043",
            "value": 54
        },
        {
            "hc-key": "us-wi-065",
            "value": 55
        },
        {
            "hc-key": "us-wi-117",
            "value": 56
        },
        {
            "hc-key": "us-wi-077",
            "value": 57
        },
        {
            "hc-key": "us-wi-067",
            "value": 58
        },
        {
            "hc-key": "us-wi-078",
            "value": 59
        },
        {
            "hc-key": "us-wi-131",
            "value": 60
        },
        {
            "hc-key": "us-wi-109",
            "value": 61
        },
        {
            "hc-key": "us-wi-037",
            "value": 62
        },
        {
            "hc-key": "us-wi-039",
            "value": 63
        },
        {
            "hc-key": "us-wi-081",
            "value": 64
        },
        {
            "hc-key": "us-wi-011",
            "value": 65
        },
        {
            "hc-key": "us-wi-029",
            "value": 66
        },
        {
            "hc-key": "us-wi-095",
            "value": 67
        },
        {
            "hc-key": "us-wi-075",
            "value": 68
        },
        {
            "hc-key": "us-wi-031",
            "value": 69
        },
        {
            "hc-key": "us-wi-059",
            "value": 70
        },
        {
            "hc-key": "us-wi-071",
            "value": 71
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-wi-all.js">Wisconsin</a>'
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
            mapData: Highcharts.maps['countries/us/us-wi-all'],
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

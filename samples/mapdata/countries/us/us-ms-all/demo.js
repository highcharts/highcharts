$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ms-005",
            "value": 0
        },
        {
            "hc-key": "us-ms-037",
            "value": 1
        },
        {
            "hc-key": "us-ms-107",
            "value": 2
        },
        {
            "hc-key": "us-ms-143",
            "value": 3
        },
        {
            "hc-key": "us-ms-119",
            "value": 4
        },
        {
            "hc-key": "us-ms-161",
            "value": 5
        },
        {
            "hc-key": "us-ms-111",
            "value": 6
        },
        {
            "hc-key": "us-ms-041",
            "value": 7
        },
        {
            "hc-key": "us-ms-053",
            "value": 8
        },
        {
            "hc-key": "us-ms-125",
            "value": 9
        },
        {
            "hc-key": "us-ms-047",
            "value": 10
        },
        {
            "hc-key": "us-ms-059",
            "value": 11
        },
        {
            "hc-key": "us-ms-159",
            "value": 12
        },
        {
            "hc-key": "us-ms-007",
            "value": 13
        },
        {
            "hc-key": "us-ms-127",
            "value": 14
        },
        {
            "hc-key": "us-ms-121",
            "value": 15
        },
        {
            "hc-key": "us-ms-011",
            "value": 16
        },
        {
            "hc-key": "us-ms-027",
            "value": 17
        },
        {
            "hc-key": "us-ms-139",
            "value": 18
        },
        {
            "hc-key": "us-ms-117",
            "value": 19
        },
        {
            "hc-key": "us-ms-003",
            "value": 20
        },
        {
            "hc-key": "us-ms-109",
            "value": 21
        },
        {
            "hc-key": "us-ms-035",
            "value": 22
        },
        {
            "hc-key": "us-ms-113",
            "value": 23
        },
        {
            "hc-key": "us-ms-147",
            "value": 24
        },
        {
            "hc-key": "us-ms-103",
            "value": 25
        },
        {
            "hc-key": "us-ms-105",
            "value": 26
        },
        {
            "hc-key": "us-ms-135",
            "value": 27
        },
        {
            "hc-key": "us-ms-021",
            "value": 28
        },
        {
            "hc-key": "us-ms-149",
            "value": 29
        },
        {
            "hc-key": "us-ms-155",
            "value": 30
        },
        {
            "hc-key": "us-ms-077",
            "value": 31
        },
        {
            "hc-key": "us-ms-029",
            "value": 32
        },
        {
            "hc-key": "us-ms-115",
            "value": 33
        },
        {
            "hc-key": "us-ms-071",
            "value": 34
        },
        {
            "hc-key": "us-ms-033",
            "value": 35
        },
        {
            "hc-key": "us-ms-137",
            "value": 36
        },
        {
            "hc-key": "us-ms-039",
            "value": 37
        },
        {
            "hc-key": "us-ms-019",
            "value": 38
        },
        {
            "hc-key": "us-ms-141",
            "value": 39
        },
        {
            "hc-key": "us-ms-131",
            "value": 40
        },
        {
            "hc-key": "us-ms-145",
            "value": 41
        },
        {
            "hc-key": "us-ms-009",
            "value": 42
        },
        {
            "hc-key": "us-ms-157",
            "value": 43
        },
        {
            "hc-key": "us-ms-025",
            "value": 44
        },
        {
            "hc-key": "us-ms-063",
            "value": 45
        },
        {
            "hc-key": "us-ms-013",
            "value": 46
        },
        {
            "hc-key": "us-ms-031",
            "value": 47
        },
        {
            "hc-key": "us-ms-043",
            "value": 48
        },
        {
            "hc-key": "us-ms-083",
            "value": 49
        },
        {
            "hc-key": "us-ms-093",
            "value": 50
        },
        {
            "hc-key": "us-ms-079",
            "value": 51
        },
        {
            "hc-key": "us-ms-101",
            "value": 52
        },
        {
            "hc-key": "us-ms-089",
            "value": 53
        },
        {
            "hc-key": "us-ms-123",
            "value": 54
        },
        {
            "hc-key": "us-ms-153",
            "value": 55
        },
        {
            "hc-key": "us-ms-067",
            "value": 56
        },
        {
            "hc-key": "us-ms-129",
            "value": 57
        },
        {
            "hc-key": "us-ms-091",
            "value": 58
        },
        {
            "hc-key": "us-ms-061",
            "value": 59
        },
        {
            "hc-key": "us-ms-065",
            "value": 60
        },
        {
            "hc-key": "us-ms-073",
            "value": 61
        },
        {
            "hc-key": "us-ms-017",
            "value": 62
        },
        {
            "hc-key": "us-ms-095",
            "value": 63
        },
        {
            "hc-key": "us-ms-081",
            "value": 64
        },
        {
            "hc-key": "us-ms-085",
            "value": 65
        },
        {
            "hc-key": "us-ms-055",
            "value": 66
        },
        {
            "hc-key": "us-ms-163",
            "value": 67
        },
        {
            "hc-key": "us-ms-015",
            "value": 68
        },
        {
            "hc-key": "us-ms-097",
            "value": 69
        },
        {
            "hc-key": "us-ms-051",
            "value": 70
        },
        {
            "hc-key": "us-ms-075",
            "value": 71
        },
        {
            "hc-key": "us-ms-151",
            "value": 72
        },
        {
            "hc-key": "us-ms-133",
            "value": 73
        },
        {
            "hc-key": "us-ms-087",
            "value": 74
        },
        {
            "hc-key": "us-ms-099",
            "value": 75
        },
        {
            "hc-key": "us-ms-045",
            "value": 76
        },
        {
            "hc-key": "us-ms-023",
            "value": 77
        },
        {
            "hc-key": "us-ms-069",
            "value": 78
        },
        {
            "hc-key": "us-ms-001",
            "value": 79
        },
        {
            "hc-key": "us-ms-057",
            "value": 80
        },
        {
            "hc-key": "us-ms-049",
            "value": 81
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ms-all.js">Mississippi</a>'
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
            mapData: Highcharts.maps['countries/us/us-ms-all'],
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

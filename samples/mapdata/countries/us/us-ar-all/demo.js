$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ar-073",
            "value": 0
        },
        {
            "hc-key": "us-ar-057",
            "value": 1
        },
        {
            "hc-key": "us-ar-037",
            "value": 2
        },
        {
            "hc-key": "us-ar-147",
            "value": 3
        },
        {
            "hc-key": "us-ar-049",
            "value": 4
        },
        {
            "hc-key": "us-ar-065",
            "value": 5
        },
        {
            "hc-key": "us-ar-045",
            "value": 6
        },
        {
            "hc-key": "us-ar-141",
            "value": 7
        },
        {
            "hc-key": "us-ar-023",
            "value": 8
        },
        {
            "hc-key": "us-ar-015",
            "value": 9
        },
        {
            "hc-key": "us-ar-101",
            "value": 10
        },
        {
            "hc-key": "us-ar-115",
            "value": 11
        },
        {
            "hc-key": "us-ar-005",
            "value": 12
        },
        {
            "hc-key": "us-ar-051",
            "value": 13
        },
        {
            "hc-key": "us-ar-105",
            "value": 14
        },
        {
            "hc-key": "us-ar-063",
            "value": 15
        },
        {
            "hc-key": "us-ar-145",
            "value": 16
        },
        {
            "hc-key": "us-ar-043",
            "value": 17
        },
        {
            "hc-key": "us-ar-003",
            "value": 18
        },
        {
            "hc-key": "us-ar-127",
            "value": 19
        },
        {
            "hc-key": "us-ar-129",
            "value": 20
        },
        {
            "hc-key": "us-ar-061",
            "value": 21
        },
        {
            "hc-key": "us-ar-071",
            "value": 22
        },
        {
            "hc-key": "us-ar-087",
            "value": 23
        },
        {
            "hc-key": "us-ar-095",
            "value": 24
        },
        {
            "hc-key": "us-ar-123",
            "value": 25
        },
        {
            "hc-key": "us-ar-019",
            "value": 26
        },
        {
            "hc-key": "us-ar-097",
            "value": 27
        },
        {
            "hc-key": "us-ar-149",
            "value": 28
        },
        {
            "hc-key": "us-ar-013",
            "value": 29
        },
        {
            "hc-key": "us-ar-025",
            "value": 30
        },
        {
            "hc-key": "us-ar-031",
            "value": 31
        },
        {
            "hc-key": "us-ar-067",
            "value": 32
        },
        {
            "hc-key": "us-ar-099",
            "value": 33
        },
        {
            "hc-key": "us-ar-011",
            "value": 34
        },
        {
            "hc-key": "us-ar-053",
            "value": 35
        },
        {
            "hc-key": "us-ar-119",
            "value": 36
        },
        {
            "hc-key": "us-ar-001",
            "value": 37
        },
        {
            "hc-key": "us-ar-107",
            "value": 38
        },
        {
            "hc-key": "us-ar-085",
            "value": 39
        },
        {
            "hc-key": "us-ar-117",
            "value": 40
        },
        {
            "hc-key": "us-ar-075",
            "value": 41
        },
        {
            "hc-key": "us-ar-135",
            "value": 42
        },
        {
            "hc-key": "us-ar-059",
            "value": 43
        },
        {
            "hc-key": "us-ar-029",
            "value": 44
        },
        {
            "hc-key": "us-ar-007",
            "value": 45
        },
        {
            "hc-key": "us-ar-035",
            "value": 46
        },
        {
            "hc-key": "us-ar-093",
            "value": 47
        },
        {
            "hc-key": "us-ar-111",
            "value": 48
        },
        {
            "hc-key": "us-ar-083",
            "value": 49
        },
        {
            "hc-key": "us-ar-047",
            "value": 50
        },
        {
            "hc-key": "us-ar-041",
            "value": 51
        },
        {
            "hc-key": "us-ar-079",
            "value": 52
        },
        {
            "hc-key": "us-ar-009",
            "value": 53
        },
        {
            "hc-key": "us-ar-033",
            "value": 54
        },
        {
            "hc-key": "us-ar-109",
            "value": 55
        },
        {
            "hc-key": "us-ar-121",
            "value": 56
        },
        {
            "hc-key": "us-ar-055",
            "value": 57
        },
        {
            "hc-key": "us-ar-081",
            "value": 58
        },
        {
            "hc-key": "us-ar-139",
            "value": 59
        },
        {
            "hc-key": "us-ar-089",
            "value": 60
        },
        {
            "hc-key": "us-ar-113",
            "value": 61
        },
        {
            "hc-key": "us-ar-133",
            "value": 62
        },
        {
            "hc-key": "us-ar-027",
            "value": 63
        },
        {
            "hc-key": "us-ar-069",
            "value": 64
        },
        {
            "hc-key": "us-ar-131",
            "value": 65
        },
        {
            "hc-key": "us-ar-021",
            "value": 66
        },
        {
            "hc-key": "us-ar-137",
            "value": 67
        },
        {
            "hc-key": "us-ar-125",
            "value": 68
        },
        {
            "hc-key": "us-ar-091",
            "value": 69
        },
        {
            "hc-key": "us-ar-143",
            "value": 70
        },
        {
            "hc-key": "us-ar-103",
            "value": 71
        },
        {
            "hc-key": "us-ar-039",
            "value": 72
        },
        {
            "hc-key": "us-ar-077",
            "value": 73
        },
        {
            "hc-key": "us-ar-017",
            "value": 74
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ar-all.js">Arkansas</a>'
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
            mapData: Highcharts.maps['countries/us/us-ar-all'],
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

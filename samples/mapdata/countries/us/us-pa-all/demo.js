$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-pa-015",
            "value": 0
        },
        {
            "hc-key": "us-pa-117",
            "value": 1
        },
        {
            "hc-key": "us-pa-027",
            "value": 2
        },
        {
            "hc-key": "us-pa-035",
            "value": 3
        },
        {
            "hc-key": "us-pa-061",
            "value": 4
        },
        {
            "hc-key": "us-pa-009",
            "value": 5
        },
        {
            "hc-key": "us-pa-075",
            "value": 6
        },
        {
            "hc-key": "us-pa-029",
            "value": 7
        },
        {
            "hc-key": "us-pa-011",
            "value": 8
        },
        {
            "hc-key": "us-pa-083",
            "value": 9
        },
        {
            "hc-key": "us-pa-047",
            "value": 10
        },
        {
            "hc-key": "us-pa-005",
            "value": 11
        },
        {
            "hc-key": "us-pa-019",
            "value": 12
        },
        {
            "hc-key": "us-pa-007",
            "value": 13
        },
        {
            "hc-key": "us-pa-067",
            "value": 14
        },
        {
            "hc-key": "us-pa-099",
            "value": 15
        },
        {
            "hc-key": "us-pa-053",
            "value": 16
        },
        {
            "hc-key": "us-pa-123",
            "value": 17
        },
        {
            "hc-key": "us-pa-121",
            "value": 18
        },
        {
            "hc-key": "us-pa-033",
            "value": 19
        },
        {
            "hc-key": "us-pa-063",
            "value": 20
        },
        {
            "hc-key": "us-pa-107",
            "value": 21
        },
        {
            "hc-key": "us-pa-079",
            "value": 22
        },
        {
            "hc-key": "us-pa-055",
            "value": 23
        },
        {
            "hc-key": "us-pa-001",
            "value": 24
        },
        {
            "hc-key": "us-pa-089",
            "value": 25
        },
        {
            "hc-key": "us-pa-069",
            "value": 26
        },
        {
            "hc-key": "us-pa-093",
            "value": 27
        },
        {
            "hc-key": "us-pa-081",
            "value": 28
        },
        {
            "hc-key": "us-pa-095",
            "value": 29
        },
        {
            "hc-key": "us-pa-025",
            "value": 30
        },
        {
            "hc-key": "us-pa-065",
            "value": 31
        },
        {
            "hc-key": "us-pa-003",
            "value": 32
        },
        {
            "hc-key": "us-pa-129",
            "value": 33
        },
        {
            "hc-key": "us-pa-021",
            "value": 34
        },
        {
            "hc-key": "us-pa-013",
            "value": 35
        },
        {
            "hc-key": "us-pa-039",
            "value": 36
        },
        {
            "hc-key": "us-pa-023",
            "value": 37
        },
        {
            "hc-key": "us-pa-097",
            "value": 38
        },
        {
            "hc-key": "us-pa-043",
            "value": 39
        },
        {
            "hc-key": "us-pa-077",
            "value": 40
        },
        {
            "hc-key": "us-pa-091",
            "value": 41
        },
        {
            "hc-key": "us-pa-131",
            "value": 42
        },
        {
            "hc-key": "us-pa-113",
            "value": 43
        },
        {
            "hc-key": "us-pa-037",
            "value": 44
        },
        {
            "hc-key": "us-pa-045",
            "value": 45
        },
        {
            "hc-key": "us-pa-119",
            "value": 46
        },
        {
            "hc-key": "us-pa-087",
            "value": 47
        },
        {
            "hc-key": "us-pa-031",
            "value": 48
        },
        {
            "hc-key": "us-pa-085",
            "value": 49
        },
        {
            "hc-key": "us-pa-071",
            "value": 50
        },
        {
            "hc-key": "us-pa-049",
            "value": 51
        },
        {
            "hc-key": "us-pa-041",
            "value": 52
        },
        {
            "hc-key": "us-pa-127",
            "value": 53
        },
        {
            "hc-key": "us-pa-017",
            "value": 54
        },
        {
            "hc-key": "us-pa-059",
            "value": 55
        },
        {
            "hc-key": "us-pa-051",
            "value": 56
        },
        {
            "hc-key": "us-pa-101",
            "value": 57
        },
        {
            "hc-key": "us-pa-103",
            "value": 58
        },
        {
            "hc-key": "us-pa-115",
            "value": 59
        },
        {
            "hc-key": "us-pa-125",
            "value": 60
        },
        {
            "hc-key": "us-pa-105",
            "value": 61
        },
        {
            "hc-key": "us-pa-109",
            "value": 62
        },
        {
            "hc-key": "us-pa-111",
            "value": 63
        },
        {
            "hc-key": "us-pa-057",
            "value": 64
        },
        {
            "hc-key": "us-pa-073",
            "value": 65
        },
        {
            "hc-key": "us-pa-133",
            "value": 66
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-pa-all.js">Pennsylvania</a>'
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
            mapData: Highcharts.maps['countries/us/us-pa-all'],
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

$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ny-009",
            "value": 0
        },
        {
            "hc-key": "us-ny-013",
            "value": 1
        },
        {
            "hc-key": "us-ny-103",
            "value": 2
        },
        {
            "hc-key": "us-ny-045",
            "value": 3
        },
        {
            "hc-key": "us-ny-029",
            "value": 4
        },
        {
            "hc-key": "us-ny-121",
            "value": 5
        },
        {
            "hc-key": "us-ny-073",
            "value": 6
        },
        {
            "hc-key": "us-ny-055",
            "value": 7
        },
        {
            "hc-key": "us-ny-089",
            "value": 8
        },
        {
            "hc-key": "us-ny-059",
            "value": 9
        },
        {
            "hc-key": "us-ny-081",
            "value": 10
        },
        {
            "hc-key": "us-ny-091",
            "value": 11
        },
        {
            "hc-key": "us-ny-001",
            "value": 12
        },
        {
            "hc-key": "us-ny-063",
            "value": 13
        },
        {
            "hc-key": "us-ny-031",
            "value": 14
        },
        {
            "hc-key": "us-ny-035",
            "value": 15
        },
        {
            "hc-key": "us-ny-043",
            "value": 16
        },
        {
            "hc-key": "us-ny-087",
            "value": 17
        },
        {
            "hc-key": "us-ny-119",
            "value": 18
        },
        {
            "hc-key": "us-ny-071",
            "value": 19
        },
        {
            "hc-key": "us-ny-037",
            "value": 20
        },
        {
            "hc-key": "us-ny-053",
            "value": 21
        },
        {
            "hc-key": "us-ny-005",
            "value": 22
        },
        {
            "hc-key": "us-ny-061",
            "value": 23
        },
        {
            "hc-key": "us-ny-047",
            "value": 24
        },
        {
            "hc-key": "us-ny-057",
            "value": 25
        },
        {
            "hc-key": "us-ny-077",
            "value": 26
        },
        {
            "hc-key": "us-ny-065",
            "value": 27
        },
        {
            "hc-key": "us-ny-115",
            "value": 28
        },
        {
            "hc-key": "us-ny-117",
            "value": 29
        },
        {
            "hc-key": "us-ny-003",
            "value": 30
        },
        {
            "hc-key": "us-ny-051",
            "value": 31
        },
        {
            "hc-key": "us-ny-017",
            "value": 32
        },
        {
            "hc-key": "us-ny-025",
            "value": 33
        },
        {
            "hc-key": "us-ny-095",
            "value": 34
        },
        {
            "hc-key": "us-ny-111",
            "value": 35
        },
        {
            "hc-key": "us-ny-021",
            "value": 36
        },
        {
            "hc-key": "us-ny-101",
            "value": 37
        },
        {
            "hc-key": "us-ny-069",
            "value": 38
        },
        {
            "hc-key": "us-ny-015",
            "value": 39
        },
        {
            "hc-key": "us-ny-109",
            "value": 40
        },
        {
            "hc-key": "us-ny-023",
            "value": 41
        },
        {
            "hc-key": "us-ny-011",
            "value": 42
        },
        {
            "hc-key": "us-ny-075",
            "value": 43
        },
        {
            "hc-key": "us-ny-079",
            "value": 44
        },
        {
            "hc-key": "us-ny-049",
            "value": 45
        },
        {
            "hc-key": "us-ny-099",
            "value": 46
        },
        {
            "hc-key": "us-ny-041",
            "value": 47
        },
        {
            "hc-key": "us-ny-019",
            "value": 48
        },
        {
            "hc-key": "us-ny-083",
            "value": 49
        },
        {
            "hc-key": "us-ny-039",
            "value": 50
        },
        {
            "hc-key": "us-ny-027",
            "value": 51
        },
        {
            "hc-key": "us-ny-085",
            "value": 52
        },
        {
            "hc-key": "us-ny-097",
            "value": 53
        },
        {
            "hc-key": "us-ny-105",
            "value": 54
        },
        {
            "hc-key": "us-ny-113",
            "value": 55
        },
        {
            "hc-key": "us-ny-007",
            "value": 56
        },
        {
            "hc-key": "us-ny-093",
            "value": 57
        },
        {
            "hc-key": "us-ny-107",
            "value": 58
        },
        {
            "hc-key": "us-ny-033",
            "value": 59
        },
        {
            "hc-key": "us-ny-067",
            "value": 60
        },
        {
            "hc-key": "us-ny-123",
            "value": 61
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ny-all.js">New York</a>'
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
            mapData: Highcharts.maps['countries/us/us-ny-all'],
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

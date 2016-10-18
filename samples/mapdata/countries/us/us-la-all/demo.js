$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-la-087",
            "value": 0
        },
        {
            "hc-key": "us-la-105",
            "value": 1
        },
        {
            "hc-key": "us-la-051",
            "value": 2
        },
        {
            "hc-key": "us-la-013",
            "value": 3
        },
        {
            "hc-key": "us-la-069",
            "value": 4
        },
        {
            "hc-key": "us-la-047",
            "value": 5
        },
        {
            "hc-key": "us-la-077",
            "value": 6
        },
        {
            "hc-key": "us-la-109",
            "value": 7
        },
        {
            "hc-key": "us-la-115",
            "value": 8
        },
        {
            "hc-key": "us-la-079",
            "value": 9
        },
        {
            "hc-key": "us-la-019",
            "value": 10
        },
        {
            "hc-key": "us-la-023",
            "value": 11
        },
        {
            "hc-key": "us-la-007",
            "value": 12
        },
        {
            "hc-key": "us-la-057",
            "value": 13
        },
        {
            "hc-key": "us-la-035",
            "value": 14
        },
        {
            "hc-key": "us-la-083",
            "value": 15
        },
        {
            "hc-key": "us-la-103",
            "value": 16
        },
        {
            "hc-key": "us-la-121",
            "value": 17
        },
        {
            "hc-key": "us-la-125",
            "value": 18
        },
        {
            "hc-key": "us-la-003",
            "value": 19
        },
        {
            "hc-key": "us-la-089",
            "value": 20
        },
        {
            "hc-key": "us-la-061",
            "value": 21
        },
        {
            "hc-key": "us-la-073",
            "value": 22
        },
        {
            "hc-key": "us-la-101",
            "value": 23
        },
        {
            "hc-key": "us-la-037",
            "value": 24
        },
        {
            "hc-key": "us-la-095",
            "value": 25
        },
        {
            "hc-key": "us-la-113",
            "value": 26
        },
        {
            "hc-key": "us-la-075",
            "value": 27
        },
        {
            "hc-key": "us-la-045",
            "value": 28
        },
        {
            "hc-key": "us-la-033",
            "value": 29
        },
        {
            "hc-key": "us-la-029",
            "value": 30
        },
        {
            "hc-key": "us-la-017",
            "value": 31
        },
        {
            "hc-key": "us-la-081",
            "value": 32
        },
        {
            "hc-key": "us-la-015",
            "value": 33
        },
        {
            "hc-key": "us-la-031",
            "value": 34
        },
        {
            "hc-key": "us-la-065",
            "value": 35
        },
        {
            "hc-key": "us-la-107",
            "value": 36
        },
        {
            "hc-key": "us-la-021",
            "value": 37
        },
        {
            "hc-key": "us-la-049",
            "value": 38
        },
        {
            "hc-key": "us-la-039",
            "value": 39
        },
        {
            "hc-key": "us-la-071",
            "value": 40
        },
        {
            "hc-key": "us-la-099",
            "value": 41
        },
        {
            "hc-key": "us-la-059",
            "value": 42
        },
        {
            "hc-key": "us-la-009",
            "value": 43
        },
        {
            "hc-key": "us-la-053",
            "value": 44
        },
        {
            "hc-key": "us-la-011",
            "value": 45
        },
        {
            "hc-key": "us-la-055",
            "value": 46
        },
        {
            "hc-key": "us-la-027",
            "value": 47
        },
        {
            "hc-key": "us-la-025",
            "value": 48
        },
        {
            "hc-key": "us-la-117",
            "value": 49
        },
        {
            "hc-key": "us-la-067",
            "value": 50
        },
        {
            "hc-key": "us-la-091",
            "value": 51
        },
        {
            "hc-key": "us-la-041",
            "value": 52
        },
        {
            "hc-key": "us-la-123",
            "value": 53
        },
        {
            "hc-key": "us-la-093",
            "value": 54
        },
        {
            "hc-key": "us-la-005",
            "value": 55
        },
        {
            "hc-key": "us-la-063",
            "value": 56
        },
        {
            "hc-key": "us-la-111",
            "value": 57
        },
        {
            "hc-key": "us-la-127",
            "value": 58
        },
        {
            "hc-key": "us-la-043",
            "value": 59
        },
        {
            "hc-key": "us-la-119",
            "value": 60
        },
        {
            "hc-key": "us-la-085",
            "value": 61
        },
        {
            "hc-key": "us-la-001",
            "value": 62
        },
        {
            "hc-key": "us-la-097",
            "value": 63
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-la-all.js">Louisiana</a>'
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
            mapData: Highcharts.maps['countries/us/us-la-all'],
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

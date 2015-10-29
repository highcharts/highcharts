$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-fl-131",
            "value": 0
        },
        {
            "hc-key": "us-fl-087",
            "value": 1
        },
        {
            "hc-key": "us-fl-053",
            "value": 2
        },
        {
            "hc-key": "us-fl-051",
            "value": 3
        },
        {
            "hc-key": "us-fl-043",
            "value": 4
        },
        {
            "hc-key": "us-fl-086",
            "value": 5
        },
        {
            "hc-key": "us-fl-037",
            "value": 6
        },
        {
            "hc-key": "us-fl-097",
            "value": 7
        },
        {
            "hc-key": "us-fl-093",
            "value": 8
        },
        {
            "hc-key": "us-fl-071",
            "value": 9
        },
        {
            "hc-key": "us-fl-111",
            "value": 10
        },
        {
            "hc-key": "us-fl-061",
            "value": 11
        },
        {
            "hc-key": "us-fl-085",
            "value": 12
        },
        {
            "hc-key": "us-fl-021",
            "value": 13
        },
        {
            "hc-key": "us-fl-049",
            "value": 14
        },
        {
            "hc-key": "us-fl-055",
            "value": 15
        },
        {
            "hc-key": "us-fl-027",
            "value": 16
        },
        {
            "hc-key": "us-fl-015",
            "value": 17
        },
        {
            "hc-key": "us-fl-009",
            "value": 18
        },
        {
            "hc-key": "us-fl-095",
            "value": 19
        },
        {
            "hc-key": "us-fl-129",
            "value": 20
        },
        {
            "hc-key": "us-fl-133",
            "value": 21
        },
        {
            "hc-key": "us-fl-005",
            "value": 22
        },
        {
            "hc-key": "us-fl-007",
            "value": 23
        },
        {
            "hc-key": "us-fl-107",
            "value": 24
        },
        {
            "hc-key": "us-fl-031",
            "value": 25
        },
        {
            "hc-key": "us-fl-003",
            "value": 26
        },
        {
            "hc-key": "us-fl-019",
            "value": 27
        },
        {
            "hc-key": "us-fl-063",
            "value": 28
        },
        {
            "hc-key": "us-fl-103",
            "value": 29
        },
        {
            "hc-key": "us-fl-057",
            "value": 30
        },
        {
            "hc-key": "us-fl-035",
            "value": 31
        },
        {
            "hc-key": "us-fl-045",
            "value": 32
        },
        {
            "hc-key": "us-fl-065",
            "value": 33
        },
        {
            "hc-key": "us-fl-081",
            "value": 34
        },
        {
            "hc-key": "us-fl-101",
            "value": 35
        },
        {
            "hc-key": "us-fl-115",
            "value": 36
        },
        {
            "hc-key": "us-fl-073",
            "value": 37
        },
        {
            "hc-key": "us-fl-033",
            "value": 38
        },
        {
            "hc-key": "us-fl-113",
            "value": 39
        },
        {
            "hc-key": "us-fl-011",
            "value": 40
        },
        {
            "hc-key": "us-fl-089",
            "value": 41
        },
        {
            "hc-key": "us-fl-077",
            "value": 42
        },
        {
            "hc-key": "us-fl-105",
            "value": 43
        },
        {
            "hc-key": "us-fl-041",
            "value": 44
        },
        {
            "hc-key": "us-fl-067",
            "value": 45
        },
        {
            "hc-key": "us-fl-127",
            "value": 46
        },
        {
            "hc-key": "us-fl-121",
            "value": 47
        },
        {
            "hc-key": "us-fl-083",
            "value": 48
        },
        {
            "hc-key": "us-fl-017",
            "value": 49
        },
        {
            "hc-key": "us-fl-075",
            "value": 50
        },
        {
            "hc-key": "us-fl-059",
            "value": 51
        },
        {
            "hc-key": "us-fl-079",
            "value": 52
        },
        {
            "hc-key": "us-fl-029",
            "value": 53
        },
        {
            "hc-key": "us-fl-117",
            "value": 54
        },
        {
            "hc-key": "us-fl-069",
            "value": 55
        },
        {
            "hc-key": "us-fl-091",
            "value": 56
        },
        {
            "hc-key": "us-fl-001",
            "value": 57
        },
        {
            "hc-key": "us-fl-125",
            "value": 58
        },
        {
            "hc-key": "us-fl-013",
            "value": 59
        },
        {
            "hc-key": "us-fl-123",
            "value": 60
        },
        {
            "hc-key": "us-fl-119",
            "value": 61
        },
        {
            "hc-key": "us-fl-109",
            "value": 62
        },
        {
            "hc-key": "us-fl-099",
            "value": 63
        },
        {
            "hc-key": "us-fl-047",
            "value": 64
        },
        {
            "hc-key": "us-fl-023",
            "value": 65
        },
        {
            "hc-key": "us-fl-039",
            "value": 66
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-fl-all.js">Florida</a>'
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
            mapData: Highcharts.maps['countries/us/us-fl-all'],
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

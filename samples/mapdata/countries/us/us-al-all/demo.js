$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-al-007",
            "value": 0
        },
        {
            "hc-key": "us-al-003",
            "value": 1
        },
        {
            "hc-key": "us-al-041",
            "value": 2
        },
        {
            "hc-key": "us-al-085",
            "value": 3
        },
        {
            "hc-key": "us-al-133",
            "value": 4
        },
        {
            "hc-key": "us-al-059",
            "value": 5
        },
        {
            "hc-key": "us-al-083",
            "value": 6
        },
        {
            "hc-key": "us-al-079",
            "value": 7
        },
        {
            "hc-key": "us-al-039",
            "value": 8
        },
        {
            "hc-key": "us-al-061",
            "value": 9
        },
        {
            "hc-key": "us-al-095",
            "value": 10
        },
        {
            "hc-key": "us-al-071",
            "value": 11
        },
        {
            "hc-key": "us-al-009",
            "value": 12
        },
        {
            "hc-key": "us-al-055",
            "value": 13
        },
        {
            "hc-key": "us-al-013",
            "value": 14
        },
        {
            "hc-key": "us-al-053",
            "value": 15
        },
        {
            "hc-key": "us-al-099",
            "value": 16
        },
        {
            "hc-key": "us-al-131",
            "value": 17
        },
        {
            "hc-key": "us-al-077",
            "value": 18
        },
        {
            "hc-key": "us-al-033",
            "value": 19
        },
        {
            "hc-key": "us-al-105",
            "value": 20
        },
        {
            "hc-key": "us-al-091",
            "value": 21
        },
        {
            "hc-key": "us-al-107",
            "value": 22
        },
        {
            "hc-key": "us-al-119",
            "value": 23
        },
        {
            "hc-key": "us-al-097",
            "value": 24
        },
        {
            "hc-key": "us-al-063",
            "value": 25
        },
        {
            "hc-key": "us-al-047",
            "value": 26
        },
        {
            "hc-key": "us-al-001",
            "value": 27
        },
        {
            "hc-key": "us-al-101",
            "value": 28
        },
        {
            "hc-key": "us-al-073",
            "value": 29
        },
        {
            "hc-key": "us-al-021",
            "value": 30
        },
        {
            "hc-key": "us-al-129",
            "value": 31
        },
        {
            "hc-key": "us-al-023",
            "value": 32
        },
        {
            "hc-key": "us-al-031",
            "value": 33
        },
        {
            "hc-key": "us-al-029",
            "value": 34
        },
        {
            "hc-key": "us-al-121",
            "value": 35
        },
        {
            "hc-key": "us-al-043",
            "value": 36
        },
        {
            "hc-key": "us-al-045",
            "value": 37
        },
        {
            "hc-key": "us-al-019",
            "value": 38
        },
        {
            "hc-key": "us-al-109",
            "value": 39
        },
        {
            "hc-key": "us-al-035",
            "value": 40
        },
        {
            "hc-key": "us-al-123",
            "value": 41
        },
        {
            "hc-key": "us-al-111",
            "value": 42
        },
        {
            "hc-key": "us-al-037",
            "value": 43
        },
        {
            "hc-key": "us-al-027",
            "value": 44
        },
        {
            "hc-key": "us-al-093",
            "value": 45
        },
        {
            "hc-key": "us-al-127",
            "value": 46
        },
        {
            "hc-key": "us-al-011",
            "value": 47
        },
        {
            "hc-key": "us-al-113",
            "value": 48
        },
        {
            "hc-key": "us-al-117",
            "value": 49
        },
        {
            "hc-key": "us-al-065",
            "value": 50
        },
        {
            "hc-key": "us-al-081",
            "value": 51
        },
        {
            "hc-key": "us-al-089",
            "value": 52
        },
        {
            "hc-key": "us-al-025",
            "value": 53
        },
        {
            "hc-key": "us-al-015",
            "value": 54
        },
        {
            "hc-key": "us-al-103",
            "value": 55
        },
        {
            "hc-key": "us-al-017",
            "value": 56
        },
        {
            "hc-key": "us-al-067",
            "value": 57
        },
        {
            "hc-key": "us-al-069",
            "value": 58
        },
        {
            "hc-key": "us-al-049",
            "value": 59
        },
        {
            "hc-key": "us-al-005",
            "value": 60
        },
        {
            "hc-key": "us-al-057",
            "value": 61
        },
        {
            "hc-key": "us-al-125",
            "value": 62
        },
        {
            "hc-key": "us-al-087",
            "value": 63
        },
        {
            "hc-key": "us-al-075",
            "value": 64
        },
        {
            "hc-key": "us-al-115",
            "value": 65
        },
        {
            "hc-key": "us-al-051",
            "value": 66
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-al-all.js">Alabama</a>'
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
            mapData: Highcharts.maps['countries/us/us-al-all'],
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

$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-sd-129",
            "value": 0
        },
        {
            "hc-key": "us-sd-041",
            "value": 1
        },
        {
            "hc-key": "us-sd-067",
            "value": 2
        },
        {
            "hc-key": "us-sd-043",
            "value": 3
        },
        {
            "hc-key": "us-sd-045",
            "value": 4
        },
        {
            "hc-key": "us-sd-107",
            "value": 5
        },
        {
            "hc-key": "us-sd-061",
            "value": 6
        },
        {
            "hc-key": "us-sd-097",
            "value": 7
        },
        {
            "hc-key": "us-sd-087",
            "value": 8
        },
        {
            "hc-key": "us-sd-079",
            "value": 9
        },
        {
            "hc-key": "us-sd-099",
            "value": 10
        },
        {
            "hc-key": "us-sd-051",
            "value": 11
        },
        {
            "hc-key": "us-sd-039",
            "value": 12
        },
        {
            "hc-key": "us-sd-103",
            "value": 13
        },
        {
            "hc-key": "us-sd-025",
            "value": 14
        },
        {
            "hc-key": "us-sd-005",
            "value": 15
        },
        {
            "hc-key": "us-sd-011",
            "value": 16
        },
        {
            "hc-key": "us-sd-057",
            "value": 17
        },
        {
            "hc-key": "us-sd-109",
            "value": 18
        },
        {
            "hc-key": "us-sd-037",
            "value": 19
        },
        {
            "hc-key": "us-sd-015",
            "value": 20
        },
        {
            "hc-key": "us-sd-023",
            "value": 21
        },
        {
            "hc-key": "us-sd-059",
            "value": 22
        },
        {
            "hc-key": "us-sd-115",
            "value": 23
        },
        {
            "hc-key": "us-sd-085",
            "value": 24
        },
        {
            "hc-key": "us-sd-053",
            "value": 25
        },
        {
            "hc-key": "us-sd-105",
            "value": 26
        },
        {
            "hc-key": "us-sd-063",
            "value": 27
        },
        {
            "hc-key": "us-sd-019",
            "value": 28
        },
        {
            "hc-key": "us-sd-137",
            "value": 29
        },
        {
            "hc-key": "us-sd-055",
            "value": 30
        },
        {
            "hc-key": "us-sd-031",
            "value": 31
        },
        {
            "hc-key": "us-sd-069",
            "value": 32
        },
        {
            "hc-key": "us-sd-093",
            "value": 33
        },
        {
            "hc-key": "us-sd-089",
            "value": 34
        },
        {
            "hc-key": "us-sd-073",
            "value": 35
        },
        {
            "hc-key": "us-sd-013",
            "value": 36
        },
        {
            "hc-key": "us-sd-049",
            "value": 37
        },
        {
            "hc-key": "us-sd-077",
            "value": 38
        },
        {
            "hc-key": "us-sd-111",
            "value": 39
        },
        {
            "hc-key": "us-sd-003",
            "value": 40
        },
        {
            "hc-key": "us-sd-021",
            "value": 41
        },
        {
            "hc-key": "us-sd-117",
            "value": 42
        },
        {
            "hc-key": "us-sd-119",
            "value": 43
        },
        {
            "hc-key": "us-sd-027",
            "value": 44
        },
        {
            "hc-key": "us-sd-017",
            "value": 45
        },
        {
            "hc-key": "us-sd-071",
            "value": 46
        },
        {
            "hc-key": "us-sd-127",
            "value": 47
        },
        {
            "hc-key": "us-sd-081",
            "value": 48
        },
        {
            "hc-key": "us-sd-029",
            "value": 49
        },
        {
            "hc-key": "us-sd-033",
            "value": 50
        },
        {
            "hc-key": "us-sd-007",
            "value": 51
        },
        {
            "hc-key": "us-sd-035",
            "value": 52
        },
        {
            "hc-key": "us-sd-009",
            "value": 53
        },
        {
            "hc-key": "us-sd-101",
            "value": 54
        },
        {
            "hc-key": "us-sd-125",
            "value": 55
        },
        {
            "hc-key": "us-sd-135",
            "value": 56
        },
        {
            "hc-key": "us-sd-121",
            "value": 57
        },
        {
            "hc-key": "us-sd-095",
            "value": 58
        },
        {
            "hc-key": "us-sd-123",
            "value": 59
        },
        {
            "hc-key": "us-sd-083",
            "value": 60
        },
        {
            "hc-key": "us-sd-091",
            "value": 61
        },
        {
            "hc-key": "us-sd-047",
            "value": 62
        },
        {
            "hc-key": "us-sd-113",
            "value": 63
        },
        {
            "hc-key": "us-sd-065",
            "value": 64
        },
        {
            "hc-key": "us-sd-075",
            "value": 65
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-sd-all.js">South Dakota</a>'
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
            mapData: Highcharts.maps['countries/us/us-sd-all'],
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

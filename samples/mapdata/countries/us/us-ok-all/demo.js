$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ok-037",
            "value": 0
        },
        {
            "hc-key": "us-ok-081",
            "value": 1
        },
        {
            "hc-key": "us-ok-049",
            "value": 2
        },
        {
            "hc-key": "us-ok-051",
            "value": 3
        },
        {
            "hc-key": "us-ok-059",
            "value": 4
        },
        {
            "hc-key": "us-ok-151",
            "value": 5
        },
        {
            "hc-key": "us-ok-011",
            "value": 6
        },
        {
            "hc-key": "us-ok-017",
            "value": 7
        },
        {
            "hc-key": "us-ok-075",
            "value": 8
        },
        {
            "hc-key": "us-ok-015",
            "value": 9
        },
        {
            "hc-key": "us-ok-137",
            "value": 10
        },
        {
            "hc-key": "us-ok-141",
            "value": 11
        },
        {
            "hc-key": "us-ok-033",
            "value": 12
        },
        {
            "hc-key": "us-ok-083",
            "value": 13
        },
        {
            "hc-key": "us-ok-103",
            "value": 14
        },
        {
            "hc-key": "us-ok-001",
            "value": 15
        },
        {
            "hc-key": "us-ok-041",
            "value": 16
        },
        {
            "hc-key": "us-ok-107",
            "value": 17
        },
        {
            "hc-key": "us-ok-039",
            "value": 18
        },
        {
            "hc-key": "us-ok-009",
            "value": 19
        },
        {
            "hc-key": "us-ok-055",
            "value": 20
        },
        {
            "hc-key": "us-ok-057",
            "value": 21
        },
        {
            "hc-key": "us-ok-019",
            "value": 22
        },
        {
            "hc-key": "us-ok-095",
            "value": 23
        },
        {
            "hc-key": "us-ok-093",
            "value": 24
        },
        {
            "hc-key": "us-ok-073",
            "value": 25
        },
        {
            "hc-key": "us-ok-035",
            "value": 26
        },
        {
            "hc-key": "us-ok-123",
            "value": 27
        },
        {
            "hc-key": "us-ok-125",
            "value": 28
        },
        {
            "hc-key": "us-ok-131",
            "value": 29
        },
        {
            "hc-key": "us-ok-147",
            "value": 30
        },
        {
            "hc-key": "us-ok-071",
            "value": 31
        },
        {
            "hc-key": "us-ok-047",
            "value": 32
        },
        {
            "hc-key": "us-ok-021",
            "value": 33
        },
        {
            "hc-key": "us-ok-109",
            "value": 34
        },
        {
            "hc-key": "us-ok-023",
            "value": 35
        },
        {
            "hc-key": "us-ok-005",
            "value": 36
        },
        {
            "hc-key": "us-ok-087",
            "value": 37
        },
        {
            "hc-key": "us-ok-079",
            "value": 38
        },
        {
            "hc-key": "us-ok-061",
            "value": 39
        },
        {
            "hc-key": "us-ok-003",
            "value": 40
        },
        {
            "hc-key": "us-ok-077",
            "value": 41
        },
        {
            "hc-key": "us-ok-027",
            "value": 42
        },
        {
            "hc-key": "us-ok-045",
            "value": 43
        },
        {
            "hc-key": "us-ok-007",
            "value": 44
        },
        {
            "hc-key": "us-ok-031",
            "value": 45
        },
        {
            "hc-key": "us-ok-067",
            "value": 46
        },
        {
            "hc-key": "us-ok-119",
            "value": 47
        },
        {
            "hc-key": "us-ok-111",
            "value": 48
        },
        {
            "hc-key": "us-ok-145",
            "value": 49
        },
        {
            "hc-key": "us-ok-129",
            "value": 50
        },
        {
            "hc-key": "us-ok-043",
            "value": 51
        },
        {
            "hc-key": "us-ok-117",
            "value": 52
        },
        {
            "hc-key": "us-ok-143",
            "value": 53
        },
        {
            "hc-key": "us-ok-091",
            "value": 54
        },
        {
            "hc-key": "us-ok-069",
            "value": 55
        },
        {
            "hc-key": "us-ok-135",
            "value": 56
        },
        {
            "hc-key": "us-ok-101",
            "value": 57
        },
        {
            "hc-key": "us-ok-013",
            "value": 58
        },
        {
            "hc-key": "us-ok-089",
            "value": 59
        },
        {
            "hc-key": "us-ok-115",
            "value": 60
        },
        {
            "hc-key": "us-ok-063",
            "value": 61
        },
        {
            "hc-key": "us-ok-121",
            "value": 62
        },
        {
            "hc-key": "us-ok-029",
            "value": 63
        },
        {
            "hc-key": "us-ok-149",
            "value": 64
        },
        {
            "hc-key": "us-ok-025",
            "value": 65
        },
        {
            "hc-key": "us-ok-105",
            "value": 66
        },
        {
            "hc-key": "us-ok-113",
            "value": 67
        },
        {
            "hc-key": "us-ok-053",
            "value": 68
        },
        {
            "hc-key": "us-ok-085",
            "value": 69
        },
        {
            "hc-key": "us-ok-127",
            "value": 70
        },
        {
            "hc-key": "us-ok-139",
            "value": 71
        },
        {
            "hc-key": "us-ok-153",
            "value": 72
        },
        {
            "hc-key": "us-ok-065",
            "value": 73
        },
        {
            "hc-key": "us-ok-097",
            "value": 74
        },
        {
            "hc-key": "us-ok-099",
            "value": 75
        },
        {
            "hc-key": "us-ok-133",
            "value": 76
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ok-all.js">Oklahoma</a>'
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
            mapData: Highcharts.maps['countries/us/us-ok-all'],
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

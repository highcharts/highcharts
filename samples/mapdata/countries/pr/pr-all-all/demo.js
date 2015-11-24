$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "pr-3614-115",
            "value": 0
        },
        {
            "hc-key": "pr-3614-095",
            "value": 1
        },
        {
            "hc-key": "pr-3614-017",
            "value": 2
        },
        {
            "hc-key": "pr-3614-054",
            "value": 3
        },
        {
            "hc-key": "pr-3614-027",
            "value": 4
        },
        {
            "hc-key": "pr-3614-067",
            "value": 5
        },
        {
            "hc-key": "pr-3614-079",
            "value": 6
        },
        {
            "hc-key": "pr-3614-121",
            "value": 7
        },
        {
            "hc-key": "pr-3614-081",
            "value": 8
        },
        {
            "hc-key": "pr-3614-153",
            "value": 9
        },
        {
            "hc-key": "pr-3614-093",
            "value": 10
        },
        {
            "hc-key": "pr-3614-001",
            "value": 11
        },
        {
            "hc-key": "pr-3614-113",
            "value": 12
        },
        {
            "hc-key": "pr-3614-137",
            "value": 13
        },
        {
            "hc-key": "pr-3614-021",
            "value": 14
        },
        {
            "hc-key": "pr-3614-097",
            "value": 15
        },
        {
            "hc-key": "pr-3614-023",
            "value": 16
        },
        {
            "hc-key": "pr-3614-019",
            "value": 17
        },
        {
            "hc-key": "pr-3614-047",
            "value": 18
        },
        {
            "hc-key": "pr-3614-073",
            "value": 19
        },
        {
            "hc-key": "pr-3614-107",
            "value": 20
        },
        {
            "hc-key": "pr-3614-085",
            "value": 21
        },
        {
            "hc-key": "pr-3614-129",
            "value": 22
        },
        {
            "hc-key": "pr-3614-151",
            "value": 23
        },
        {
            "hc-key": "pr-3614-109",
            "value": 24
        },
        {
            "hc-key": "pr-3614-003",
            "value": 25
        },
        {
            "hc-key": "pr-3614-011",
            "value": 26
        },
        {
            "hc-key": "pr-3614-009",
            "value": 27
        },
        {
            "hc-key": "pr-3614-041",
            "value": 28
        },
        {
            "hc-key": "pr-3614-135",
            "value": 29
        },
        {
            "hc-key": "pr-3614-143",
            "value": 30
        },
        {
            "hc-key": "pr-3614-141",
            "value": 31
        },
        {
            "hc-key": "pr-3614-039",
            "value": 32
        },
        {
            "hc-key": "pr-3614-013",
            "value": 33
        },
        {
            "hc-key": "pr-3614-061",
            "value": 34
        },
        {
            "hc-key": "pr-3614-035",
            "value": 35
        },
        {
            "hc-key": "pr-3614-015",
            "value": 36
        },
        {
            "hc-key": "pr-3614-125",
            "value": 37
        },
        {
            "hc-key": "pr-3614-031",
            "value": 38
        },
        {
            "hc-key": "pr-3614-063",
            "value": 39
        },
        {
            "hc-key": "pr-3614-139",
            "value": 40
        },
        {
            "hc-key": "pr-3614-025",
            "value": 41
        },
        {
            "hc-key": "pr-3614-119",
            "value": 42
        },
        {
            "hc-key": "pr-3614-075",
            "value": 43
        },
        {
            "hc-key": "pr-3614-045",
            "value": 44
        },
        {
            "hc-key": "pr-3614-127",
            "value": 45
        },
        {
            "hc-key": "pr-3614-007",
            "value": 46
        },
        {
            "hc-key": "pr-3614-033",
            "value": 47
        },
        {
            "hc-key": "pr-3614-091",
            "value": 48
        },
        {
            "hc-key": "pr-3614-101",
            "value": 49
        },
        {
            "hc-key": "pr-3614-059",
            "value": 50
        },
        {
            "hc-key": "pr-3614-055",
            "value": 51
        },
        {
            "hc-key": "pr-3614-131",
            "value": 52
        },
        {
            "hc-key": "pr-3614-037",
            "value": 53
        },
        {
            "hc-key": "pr-3614-089",
            "value": 54
        },
        {
            "hc-key": "pr-3614-053",
            "value": 55
        },
        {
            "hc-key": "pr-3614-049",
            "value": 56
        },
        {
            "hc-key": "pr-3614-051",
            "value": 57
        },
        {
            "hc-key": "pr-3614-133",
            "value": 58
        },
        {
            "hc-key": "pr-3614-123",
            "value": 59
        },
        {
            "hc-key": "pr-3614-005",
            "value": 60
        },
        {
            "hc-key": "pr-3614-111",
            "value": 61
        },
        {
            "hc-key": "pr-3614-117",
            "value": 62
        },
        {
            "hc-key": "pr-3614-145",
            "value": 63
        },
        {
            "hc-key": "pr-3614-069",
            "value": 64
        },
        {
            "hc-key": "pr-3614-147",
            "value": 65
        },
        {
            "hc-key": "pr-3614-087",
            "value": 66
        },
        {
            "hc-key": "pr-3614-065",
            "value": 67
        },
        {
            "hc-key": "pr-3614-057",
            "value": 68
        },
        {
            "hc-key": "pr-3614-071",
            "value": 69
        },
        {
            "hc-key": "pr-3614-099",
            "value": 70
        },
        {
            "hc-key": "pr-3614-083",
            "value": 71
        },
        {
            "hc-key": "pr-3614-077",
            "value": 72
        },
        {
            "hc-key": "pr-3614-029",
            "value": 73
        },
        {
            "hc-key": "pr-3614-103",
            "value": 74
        },
        {
            "hc-key": "pr-3614-043",
            "value": 75
        },
        {
            "hc-key": "pr-3614-105",
            "value": 76
        },
        {
            "hc-key": "pr-3614-149",
            "value": 77
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/pr/pr-all-all.js">Puerto Rico</a>'
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
            mapData: Highcharts.maps['countries/pr/pr-all-all'],
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

$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-oh-085",
            "value": 0
        },
        {
            "hc-key": "us-oh-035",
            "value": 1
        },
        {
            "hc-key": "us-oh-103",
            "value": 2
        },
        {
            "hc-key": "us-oh-153",
            "value": 3
        },
        {
            "hc-key": "us-oh-063",
            "value": 4
        },
        {
            "hc-key": "us-oh-173",
            "value": 5
        },
        {
            "hc-key": "us-oh-039",
            "value": 6
        },
        {
            "hc-key": "us-oh-077",
            "value": 7
        },
        {
            "hc-key": "us-oh-093",
            "value": 8
        },
        {
            "hc-key": "us-oh-145",
            "value": 9
        },
        {
            "hc-key": "us-oh-087",
            "value": 10
        },
        {
            "hc-key": "us-oh-015",
            "value": 11
        },
        {
            "hc-key": "us-oh-001",
            "value": 12
        },
        {
            "hc-key": "us-oh-049",
            "value": 13
        },
        {
            "hc-key": "us-oh-067",
            "value": 14
        },
        {
            "hc-key": "us-oh-013",
            "value": 15
        },
        {
            "hc-key": "us-oh-081",
            "value": 16
        },
        {
            "hc-key": "us-oh-105",
            "value": 17
        },
        {
            "hc-key": "us-oh-163",
            "value": 18
        },
        {
            "hc-key": "us-oh-079",
            "value": 19
        },
        {
            "hc-key": "us-oh-009",
            "value": 20
        },
        {
            "hc-key": "us-oh-059",
            "value": 21
        },
        {
            "hc-key": "us-oh-031",
            "value": 22
        },
        {
            "hc-key": "us-oh-129",
            "value": 23
        },
        {
            "hc-key": "us-oh-097",
            "value": 24
        },
        {
            "hc-key": "us-oh-045",
            "value": 25
        },
        {
            "hc-key": "us-oh-047",
            "value": 26
        },
        {
            "hc-key": "us-oh-141",
            "value": 27
        },
        {
            "hc-key": "us-oh-071",
            "value": 28
        },
        {
            "hc-key": "us-oh-101",
            "value": 29
        },
        {
            "hc-key": "us-oh-065",
            "value": 30
        },
        {
            "hc-key": "us-oh-149",
            "value": 31
        },
        {
            "hc-key": "us-oh-091",
            "value": 32
        },
        {
            "hc-key": "us-oh-161",
            "value": 33
        },
        {
            "hc-key": "us-oh-137",
            "value": 34
        },
        {
            "hc-key": "us-oh-133",
            "value": 35
        },
        {
            "hc-key": "us-oh-155",
            "value": 36
        },
        {
            "hc-key": "us-oh-055",
            "value": 37
        },
        {
            "hc-key": "us-oh-007",
            "value": 38
        },
        {
            "hc-key": "us-oh-143",
            "value": 39
        },
        {
            "hc-key": "us-oh-147",
            "value": 40
        },
        {
            "hc-key": "us-oh-165",
            "value": 41
        },
        {
            "hc-key": "us-oh-017",
            "value": 42
        },
        {
            "hc-key": "us-oh-113",
            "value": 43
        },
        {
            "hc-key": "us-oh-033",
            "value": 44
        },
        {
            "hc-key": "us-oh-061",
            "value": 45
        },
        {
            "hc-key": "us-oh-073",
            "value": 46
        },
        {
            "hc-key": "us-oh-037",
            "value": 47
        },
        {
            "hc-key": "us-oh-019",
            "value": 48
        },
        {
            "hc-key": "us-oh-151",
            "value": 49
        },
        {
            "hc-key": "us-oh-075",
            "value": 50
        },
        {
            "hc-key": "us-oh-099",
            "value": 51
        },
        {
            "hc-key": "us-oh-005",
            "value": 52
        },
        {
            "hc-key": "us-oh-041",
            "value": 53
        },
        {
            "hc-key": "us-oh-083",
            "value": 54
        },
        {
            "hc-key": "us-oh-011",
            "value": 55
        },
        {
            "hc-key": "us-oh-089",
            "value": 56
        },
        {
            "hc-key": "us-oh-095",
            "value": 57
        },
        {
            "hc-key": "us-oh-069",
            "value": 58
        },
        {
            "hc-key": "us-oh-171",
            "value": 59
        },
        {
            "hc-key": "us-oh-157",
            "value": 60
        },
        {
            "hc-key": "us-oh-127",
            "value": 61
        },
        {
            "hc-key": "us-oh-131",
            "value": 62
        },
        {
            "hc-key": "us-oh-025",
            "value": 63
        },
        {
            "hc-key": "us-oh-027",
            "value": 64
        },
        {
            "hc-key": "us-oh-159",
            "value": 65
        },
        {
            "hc-key": "us-oh-021",
            "value": 66
        },
        {
            "hc-key": "us-oh-109",
            "value": 67
        },
        {
            "hc-key": "us-oh-003",
            "value": 68
        },
        {
            "hc-key": "us-oh-023",
            "value": 69
        },
        {
            "hc-key": "us-oh-107",
            "value": 70
        },
        {
            "hc-key": "us-oh-053",
            "value": 71
        },
        {
            "hc-key": "us-oh-117",
            "value": 72
        },
        {
            "hc-key": "us-oh-111",
            "value": 73
        },
        {
            "hc-key": "us-oh-135",
            "value": 74
        },
        {
            "hc-key": "us-oh-119",
            "value": 75
        },
        {
            "hc-key": "us-oh-139",
            "value": 76
        },
        {
            "hc-key": "us-oh-051",
            "value": 77
        },
        {
            "hc-key": "us-oh-167",
            "value": 78
        },
        {
            "hc-key": "us-oh-175",
            "value": 79
        },
        {
            "hc-key": "us-oh-169",
            "value": 80
        },
        {
            "hc-key": "us-oh-115",
            "value": 81
        },
        {
            "hc-key": "us-oh-057",
            "value": 82
        },
        {
            "hc-key": "us-oh-043",
            "value": 83
        },
        {
            "hc-key": "us-oh-125",
            "value": 84
        },
        {
            "hc-key": "us-oh-029",
            "value": 85
        },
        {
            "hc-key": "us-oh-123",
            "value": 86
        },
        {
            "hc-key": "us-oh-121",
            "value": 87
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-oh-all.js">Ohio</a>'
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
            mapData: Highcharts.maps['countries/us/us-oh-all'],
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

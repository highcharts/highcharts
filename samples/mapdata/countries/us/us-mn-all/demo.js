$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-mn-051",
            "value": 0
        },
        {
            "hc-key": "us-mn-149",
            "value": 1
        },
        {
            "hc-key": "us-mn-019",
            "value": 2
        },
        {
            "hc-key": "us-mn-143",
            "value": 3
        },
        {
            "hc-key": "us-mn-151",
            "value": 4
        },
        {
            "hc-key": "us-mn-169",
            "value": 5
        },
        {
            "hc-key": "us-mn-045",
            "value": 6
        },
        {
            "hc-key": "us-mn-005",
            "value": 7
        },
        {
            "hc-key": "us-mn-057",
            "value": 8
        },
        {
            "hc-key": "us-mn-173",
            "value": 9
        },
        {
            "hc-key": "us-mn-041",
            "value": 10
        },
        {
            "hc-key": "us-mn-121",
            "value": 11
        },
        {
            "hc-key": "us-mn-077",
            "value": 12
        },
        {
            "hc-key": "us-mn-007",
            "value": 13
        },
        {
            "hc-key": "us-mn-037",
            "value": 14
        },
        {
            "hc-key": "us-mn-131",
            "value": 15
        },
        {
            "hc-key": "us-mn-147",
            "value": 16
        },
        {
            "hc-key": "us-mn-013",
            "value": 17
        },
        {
            "hc-key": "us-mn-161",
            "value": 18
        },
        {
            "hc-key": "us-mn-033",
            "value": 19
        },
        {
            "hc-key": "us-mn-127",
            "value": 20
        },
        {
            "hc-key": "us-mn-081",
            "value": 21
        },
        {
            "hc-key": "us-mn-135",
            "value": 22
        },
        {
            "hc-key": "us-mn-089",
            "value": 23
        },
        {
            "hc-key": "us-mn-113",
            "value": 24
        },
        {
            "hc-key": "us-mn-159",
            "value": 25
        },
        {
            "hc-key": "us-mn-111",
            "value": 26
        },
        {
            "hc-key": "us-mn-153",
            "value": 27
        },
        {
            "hc-key": "us-mn-097",
            "value": 28
        },
        {
            "hc-key": "us-mn-021",
            "value": 29
        },
        {
            "hc-key": "us-mn-101",
            "value": 30
        },
        {
            "hc-key": "us-mn-167",
            "value": 31
        },
        {
            "hc-key": "us-mn-155",
            "value": 32
        },
        {
            "hc-key": "us-mn-165",
            "value": 33
        },
        {
            "hc-key": "us-mn-053",
            "value": 34
        },
        {
            "hc-key": "us-mn-079",
            "value": 35
        },
        {
            "hc-key": "us-mn-065",
            "value": 36
        },
        {
            "hc-key": "us-mn-059",
            "value": 37
        },
        {
            "hc-key": "us-mn-115",
            "value": 38
        },
        {
            "hc-key": "us-mn-063",
            "value": 39
        },
        {
            "hc-key": "us-mn-011",
            "value": 40
        },
        {
            "hc-key": "us-mn-107",
            "value": 41
        },
        {
            "hc-key": "us-mn-055",
            "value": 42
        },
        {
            "hc-key": "us-mn-099",
            "value": 43
        },
        {
            "hc-key": "us-mn-109",
            "value": 44
        },
        {
            "hc-key": "us-mn-047",
            "value": 45
        },
        {
            "hc-key": "us-mn-039",
            "value": 46
        },
        {
            "hc-key": "us-mn-093",
            "value": 47
        },
        {
            "hc-key": "us-mn-171",
            "value": 48
        },
        {
            "hc-key": "us-mn-073",
            "value": 49
        },
        {
            "hc-key": "us-mn-067",
            "value": 50
        },
        {
            "hc-key": "us-mn-023",
            "value": 51
        },
        {
            "hc-key": "us-mn-137",
            "value": 52
        },
        {
            "hc-key": "us-mn-105",
            "value": 53
        },
        {
            "hc-key": "us-mn-071",
            "value": 54
        },
        {
            "hc-key": "us-mn-049",
            "value": 55
        },
        {
            "hc-key": "us-mn-025",
            "value": 56
        },
        {
            "hc-key": "us-mn-003",
            "value": 57
        },
        {
            "hc-key": "us-mn-015",
            "value": 58
        },
        {
            "hc-key": "us-mn-083",
            "value": 59
        },
        {
            "hc-key": "us-mn-133",
            "value": 60
        },
        {
            "hc-key": "us-mn-117",
            "value": 61
        },
        {
            "hc-key": "us-mn-163",
            "value": 62
        },
        {
            "hc-key": "us-mn-069",
            "value": 63
        },
        {
            "hc-key": "us-mn-029",
            "value": 64
        },
        {
            "hc-key": "us-mn-119",
            "value": 65
        },
        {
            "hc-key": "us-mn-043",
            "value": 66
        },
        {
            "hc-key": "us-mn-145",
            "value": 67
        },
        {
            "hc-key": "us-mn-009",
            "value": 68
        },
        {
            "hc-key": "us-mn-095",
            "value": 69
        },
        {
            "hc-key": "us-mn-141",
            "value": 70
        },
        {
            "hc-key": "us-mn-123",
            "value": 71
        },
        {
            "hc-key": "us-mn-129",
            "value": 72
        },
        {
            "hc-key": "us-mn-085",
            "value": 73
        },
        {
            "hc-key": "us-mn-017",
            "value": 74
        },
        {
            "hc-key": "us-mn-075",
            "value": 75
        },
        {
            "hc-key": "us-mn-001",
            "value": 76
        },
        {
            "hc-key": "us-mn-091",
            "value": 77
        },
        {
            "hc-key": "us-mn-027",
            "value": 78
        },
        {
            "hc-key": "us-mn-087",
            "value": 79
        },
        {
            "hc-key": "us-mn-157",
            "value": 80
        },
        {
            "hc-key": "us-mn-031",
            "value": 81
        },
        {
            "hc-key": "us-mn-103",
            "value": 82
        },
        {
            "hc-key": "us-mn-125",
            "value": 83
        },
        {
            "hc-key": "us-mn-061",
            "value": 84
        },
        {
            "hc-key": "us-mn-035",
            "value": 85
        },
        {
            "hc-key": "us-mn-139",
            "value": 86
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-mn-all.js">Minnesota</a>'
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
            mapData: Highcharts.maps['countries/us/us-mn-all'],
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

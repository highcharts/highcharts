$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-wv-103",
            "value": 0
        },
        {
            "hc-key": "us-wv-067",
            "value": 1
        },
        {
            "hc-key": "us-wv-015",
            "value": 2
        },
        {
            "hc-key": "us-wv-003",
            "value": 3
        },
        {
            "hc-key": "us-wv-095",
            "value": 4
        },
        {
            "hc-key": "us-wv-019",
            "value": 5
        },
        {
            "hc-key": "us-wv-039",
            "value": 6
        },
        {
            "hc-key": "us-wv-009",
            "value": 7
        },
        {
            "hc-key": "us-wv-069",
            "value": 8
        },
        {
            "hc-key": "us-wv-043",
            "value": 9
        },
        {
            "hc-key": "us-wv-061",
            "value": 10
        },
        {
            "hc-key": "us-wv-033",
            "value": 11
        },
        {
            "hc-key": "us-wv-027",
            "value": 12
        },
        {
            "hc-key": "us-wv-071",
            "value": 13
        },
        {
            "hc-key": "us-wv-023",
            "value": 14
        },
        {
            "hc-key": "us-wv-031",
            "value": 15
        },
        {
            "hc-key": "us-wv-089",
            "value": 16
        },
        {
            "hc-key": "us-wv-011",
            "value": 17
        },
        {
            "hc-key": "us-wv-053",
            "value": 18
        },
        {
            "hc-key": "us-wv-101",
            "value": 19
        },
        {
            "hc-key": "us-wv-025",
            "value": 20
        },
        {
            "hc-key": "us-wv-041",
            "value": 21
        },
        {
            "hc-key": "us-wv-077",
            "value": 22
        },
        {
            "hc-key": "us-wv-017",
            "value": 23
        },
        {
            "hc-key": "us-wv-021",
            "value": 24
        },
        {
            "hc-key": "us-wv-087",
            "value": 25
        },
        {
            "hc-key": "us-wv-001",
            "value": 26
        },
        {
            "hc-key": "us-wv-055",
            "value": 27
        },
        {
            "hc-key": "us-wv-047",
            "value": 28
        },
        {
            "hc-key": "us-wv-109",
            "value": 29
        },
        {
            "hc-key": "us-wv-059",
            "value": 30
        },
        {
            "hc-key": "us-wv-073",
            "value": 31
        },
        {
            "hc-key": "us-wv-085",
            "value": 32
        },
        {
            "hc-key": "us-wv-107",
            "value": 33
        },
        {
            "hc-key": "us-wv-099",
            "value": 34
        },
        {
            "hc-key": "us-wv-093",
            "value": 35
        },
        {
            "hc-key": "us-wv-105",
            "value": 36
        },
        {
            "hc-key": "us-wv-013",
            "value": 37
        },
        {
            "hc-key": "us-wv-091",
            "value": 38
        },
        {
            "hc-key": "us-wv-083",
            "value": 39
        },
        {
            "hc-key": "us-wv-079",
            "value": 40
        },
        {
            "hc-key": "us-wv-081",
            "value": 41
        },
        {
            "hc-key": "us-wv-029",
            "value": 42
        },
        {
            "hc-key": "us-wv-057",
            "value": 43
        },
        {
            "hc-key": "us-wv-075",
            "value": 44
        },
        {
            "hc-key": "us-wv-007",
            "value": 45
        },
        {
            "hc-key": "us-wv-037",
            "value": 46
        },
        {
            "hc-key": "us-wv-049",
            "value": 47
        },
        {
            "hc-key": "us-wv-063",
            "value": 48
        },
        {
            "hc-key": "us-wv-051",
            "value": 49
        },
        {
            "hc-key": "us-wv-035",
            "value": 50
        },
        {
            "hc-key": "us-wv-065",
            "value": 51
        },
        {
            "hc-key": "us-wv-097",
            "value": 52
        },
        {
            "hc-key": "us-wv-045",
            "value": 53
        },
        {
            "hc-key": "us-wv-005",
            "value": 54
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-wv-all.js">West Virginia</a>'
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
            mapData: Highcharts.maps['countries/us/us-wv-all'],
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

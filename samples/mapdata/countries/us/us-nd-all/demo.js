$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-nd-087",
            "value": 0
        },
        {
            "hc-key": "us-nd-079",
            "value": 1
        },
        {
            "hc-key": "us-nd-013",
            "value": 2
        },
        {
            "hc-key": "us-nd-075",
            "value": 3
        },
        {
            "hc-key": "us-nd-099",
            "value": 4
        },
        {
            "hc-key": "us-nd-035",
            "value": 5
        },
        {
            "hc-key": "us-nd-019",
            "value": 6
        },
        {
            "hc-key": "us-nd-063",
            "value": 7
        },
        {
            "hc-key": "us-nd-067",
            "value": 8
        },
        {
            "hc-key": "us-nd-015",
            "value": 9
        },
        {
            "hc-key": "us-nd-091",
            "value": 10
        },
        {
            "hc-key": "us-nd-005",
            "value": 11
        },
        {
            "hc-key": "us-nd-095",
            "value": 12
        },
        {
            "hc-key": "us-nd-069",
            "value": 13
        },
        {
            "hc-key": "us-nd-057",
            "value": 14
        },
        {
            "hc-key": "us-nd-025",
            "value": 15
        },
        {
            "hc-key": "us-nd-103",
            "value": 16
        },
        {
            "hc-key": "us-nd-093",
            "value": 17
        },
        {
            "hc-key": "us-nd-027",
            "value": 18
        },
        {
            "hc-key": "us-nd-033",
            "value": 19
        },
        {
            "hc-key": "us-nd-053",
            "value": 20
        },
        {
            "hc-key": "us-nd-007",
            "value": 21
        },
        {
            "hc-key": "us-nd-039",
            "value": 22
        },
        {
            "hc-key": "us-nd-105",
            "value": 23
        },
        {
            "hc-key": "us-nd-003",
            "value": 24
        },
        {
            "hc-key": "us-nd-045",
            "value": 25
        },
        {
            "hc-key": "us-nd-051",
            "value": 26
        },
        {
            "hc-key": "us-nd-059",
            "value": 27
        },
        {
            "hc-key": "us-nd-089",
            "value": 28
        },
        {
            "hc-key": "us-nd-021",
            "value": 29
        },
        {
            "hc-key": "us-nd-073",
            "value": 30
        },
        {
            "hc-key": "us-nd-049",
            "value": 31
        },
        {
            "hc-key": "us-nd-083",
            "value": 32
        },
        {
            "hc-key": "us-nd-043",
            "value": 33
        },
        {
            "hc-key": "us-nd-037",
            "value": 34
        },
        {
            "hc-key": "us-nd-001",
            "value": 35
        },
        {
            "hc-key": "us-nd-023",
            "value": 36
        },
        {
            "hc-key": "us-nd-055",
            "value": 37
        },
        {
            "hc-key": "us-nd-101",
            "value": 38
        },
        {
            "hc-key": "us-nd-081",
            "value": 39
        },
        {
            "hc-key": "us-nd-009",
            "value": 40
        },
        {
            "hc-key": "us-nd-029",
            "value": 41
        },
        {
            "hc-key": "us-nd-017",
            "value": 42
        },
        {
            "hc-key": "us-nd-047",
            "value": 43
        },
        {
            "hc-key": "us-nd-097",
            "value": 44
        },
        {
            "hc-key": "us-nd-065",
            "value": 45
        },
        {
            "hc-key": "us-nd-071",
            "value": 46
        },
        {
            "hc-key": "us-nd-077",
            "value": 47
        },
        {
            "hc-key": "us-nd-011",
            "value": 48
        },
        {
            "hc-key": "us-nd-031",
            "value": 49
        },
        {
            "hc-key": "us-nd-041",
            "value": 50
        },
        {
            "hc-key": "us-nd-085",
            "value": 51
        },
        {
            "hc-key": "us-nd-061",
            "value": 52
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-nd-all.js">North Dakota</a>'
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
            mapData: Highcharts.maps['countries/us/us-nd-all'],
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

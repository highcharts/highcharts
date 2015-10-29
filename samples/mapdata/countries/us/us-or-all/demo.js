$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-or-057",
            "value": 0
        },
        {
            "hc-key": "us-or-055",
            "value": 1
        },
        {
            "hc-key": "us-or-035",
            "value": 2
        },
        {
            "hc-key": "us-or-029",
            "value": 3
        },
        {
            "hc-key": "us-or-047",
            "value": 4
        },
        {
            "hc-key": "us-or-071",
            "value": 5
        },
        {
            "hc-key": "us-or-013",
            "value": 6
        },
        {
            "hc-key": "us-or-025",
            "value": 7
        },
        {
            "hc-key": "us-or-053",
            "value": 8
        },
        {
            "hc-key": "us-or-041",
            "value": 9
        },
        {
            "hc-key": "us-or-065",
            "value": 10
        },
        {
            "hc-key": "us-or-045",
            "value": 11
        },
        {
            "hc-key": "us-or-049",
            "value": 12
        },
        {
            "hc-key": "us-or-023",
            "value": 13
        },
        {
            "hc-key": "us-or-061",
            "value": 14
        },
        {
            "hc-key": "us-or-063",
            "value": 15
        },
        {
            "hc-key": "us-or-001",
            "value": 16
        },
        {
            "hc-key": "us-or-031",
            "value": 17
        },
        {
            "hc-key": "us-or-019",
            "value": 18
        },
        {
            "hc-key": "us-or-033",
            "value": 19
        },
        {
            "hc-key": "us-or-005",
            "value": 20
        },
        {
            "hc-key": "us-or-011",
            "value": 21
        },
        {
            "hc-key": "us-or-051",
            "value": 22
        },
        {
            "hc-key": "us-or-037",
            "value": 23
        },
        {
            "hc-key": "us-or-069",
            "value": 24
        },
        {
            "hc-key": "us-or-067",
            "value": 25
        },
        {
            "hc-key": "us-or-015",
            "value": 26
        },
        {
            "hc-key": "us-or-059",
            "value": 27
        },
        {
            "hc-key": "us-or-007",
            "value": 28
        },
        {
            "hc-key": "us-or-027",
            "value": 29
        },
        {
            "hc-key": "us-or-039",
            "value": 30
        },
        {
            "hc-key": "us-or-009",
            "value": 31
        },
        {
            "hc-key": "us-or-043",
            "value": 32
        },
        {
            "hc-key": "us-or-003",
            "value": 33
        },
        {
            "hc-key": "us-or-017",
            "value": 34
        },
        {
            "hc-key": "us-or-021",
            "value": 35
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-or-all.js">Oregon</a>'
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
            mapData: Highcharts.maps['countries/us/us-or-all'],
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

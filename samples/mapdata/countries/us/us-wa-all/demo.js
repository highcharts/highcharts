$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-wa-075",
            "value": 0
        },
        {
            "hc-key": "us-wa-043",
            "value": 1
        },
        {
            "hc-key": "us-wa-069",
            "value": 2
        },
        {
            "hc-key": "us-wa-057",
            "value": 3
        },
        {
            "hc-key": "us-wa-053",
            "value": 4
        },
        {
            "hc-key": "us-wa-031",
            "value": 5
        },
        {
            "hc-key": "us-wa-067",
            "value": 6
        },
        {
            "hc-key": "us-wa-027",
            "value": 7
        },
        {
            "hc-key": "us-wa-065",
            "value": 8
        },
        {
            "hc-key": "us-wa-073",
            "value": 9
        },
        {
            "hc-key": "us-wa-047",
            "value": 10
        },
        {
            "hc-key": "us-wa-049",
            "value": 11
        },
        {
            "hc-key": "us-wa-055",
            "value": 12
        },
        {
            "hc-key": "us-wa-019",
            "value": 13
        },
        {
            "hc-key": "us-wa-021",
            "value": 14
        },
        {
            "hc-key": "us-wa-001",
            "value": 15
        },
        {
            "hc-key": "us-wa-003",
            "value": 16
        },
        {
            "hc-key": "us-wa-035",
            "value": 17
        },
        {
            "hc-key": "us-wa-045",
            "value": 18
        },
        {
            "hc-key": "us-wa-041",
            "value": 19
        },
        {
            "hc-key": "us-wa-013",
            "value": 20
        },
        {
            "hc-key": "us-wa-029",
            "value": 21
        },
        {
            "hc-key": "us-wa-011",
            "value": 22
        },
        {
            "hc-key": "us-wa-037",
            "value": 23
        },
        {
            "hc-key": "us-wa-017",
            "value": 24
        },
        {
            "hc-key": "us-wa-023",
            "value": 25
        },
        {
            "hc-key": "us-wa-015",
            "value": 26
        },
        {
            "hc-key": "us-wa-071",
            "value": 27
        },
        {
            "hc-key": "us-wa-005",
            "value": 28
        },
        {
            "hc-key": "us-wa-061",
            "value": 29
        },
        {
            "hc-key": "us-wa-007",
            "value": 30
        },
        {
            "hc-key": "us-wa-033",
            "value": 31
        },
        {
            "hc-key": "us-wa-025",
            "value": 32
        },
        {
            "hc-key": "us-wa-063",
            "value": 33
        },
        {
            "hc-key": "us-wa-051",
            "value": 34
        },
        {
            "hc-key": "us-wa-009",
            "value": 35
        },
        {
            "hc-key": "us-wa-059",
            "value": 36
        },
        {
            "hc-key": "us-wa-039",
            "value": 37
        },
        {
            "hc-key": "us-wa-077",
            "value": 38
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-wa-all.js">Washington</a>'
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
            mapData: Highcharts.maps['countries/us/us-wa-all'],
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

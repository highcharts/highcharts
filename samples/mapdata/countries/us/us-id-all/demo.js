$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-id-073",
            "value": 0
        },
        {
            "hc-key": "us-id-057",
            "value": 1
        },
        {
            "hc-key": "us-id-001",
            "value": 2
        },
        {
            "hc-key": "us-id-083",
            "value": 3
        },
        {
            "hc-key": "us-id-071",
            "value": 4
        },
        {
            "hc-key": "us-id-031",
            "value": 5
        },
        {
            "hc-key": "us-id-035",
            "value": 6
        },
        {
            "hc-key": "us-id-077",
            "value": 7
        },
        {
            "hc-key": "us-id-011",
            "value": 8
        },
        {
            "hc-key": "us-id-029",
            "value": 9
        },
        {
            "hc-key": "us-id-065",
            "value": 10
        },
        {
            "hc-key": "us-id-051",
            "value": 11
        },
        {
            "hc-key": "us-id-019",
            "value": 12
        },
        {
            "hc-key": "us-id-033",
            "value": 13
        },
        {
            "hc-key": "us-id-055",
            "value": 14
        },
        {
            "hc-key": "us-id-009",
            "value": 15
        },
        {
            "hc-key": "us-id-021",
            "value": 16
        },
        {
            "hc-key": "us-id-085",
            "value": 17
        },
        {
            "hc-key": "us-id-059",
            "value": 18
        },
        {
            "hc-key": "us-id-027",
            "value": 19
        },
        {
            "hc-key": "us-id-061",
            "value": 20
        },
        {
            "hc-key": "us-id-043",
            "value": 21
        },
        {
            "hc-key": "us-id-015",
            "value": 22
        },
        {
            "hc-key": "us-id-087",
            "value": 23
        },
        {
            "hc-key": "us-id-037",
            "value": 24
        },
        {
            "hc-key": "us-id-003",
            "value": 25
        },
        {
            "hc-key": "us-id-039",
            "value": 26
        },
        {
            "hc-key": "us-id-025",
            "value": 27
        },
        {
            "hc-key": "us-id-049",
            "value": 28
        },
        {
            "hc-key": "us-id-045",
            "value": 29
        },
        {
            "hc-key": "us-id-013",
            "value": 30
        },
        {
            "hc-key": "us-id-069",
            "value": 31
        },
        {
            "hc-key": "us-id-023",
            "value": 32
        },
        {
            "hc-key": "us-id-005",
            "value": 33
        },
        {
            "hc-key": "us-id-007",
            "value": 34
        },
        {
            "hc-key": "us-id-063",
            "value": 35
        },
        {
            "hc-key": "us-id-075",
            "value": 36
        },
        {
            "hc-key": "us-id-067",
            "value": 37
        },
        {
            "hc-key": "us-id-079",
            "value": 38
        },
        {
            "hc-key": "us-id-053",
            "value": 39
        },
        {
            "hc-key": "us-id-041",
            "value": 40
        },
        {
            "hc-key": "us-id-081",
            "value": 41
        },
        {
            "hc-key": "us-id-017",
            "value": 42
        },
        {
            "hc-key": "us-id-047",
            "value": 43
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-id-all.js">Idaho</a>'
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
            mapData: Highcharts.maps['countries/us/us-id-all'],
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

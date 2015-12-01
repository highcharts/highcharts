$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-nm-031",
            "value": 0
        },
        {
            "hc-key": "us-nm-043",
            "value": 1
        },
        {
            "hc-key": "us-nm-045",
            "value": 2
        },
        {
            "hc-key": "us-nm-049",
            "value": 3
        },
        {
            "hc-key": "us-nm-006",
            "value": 4
        },
        {
            "hc-key": "us-nm-028",
            "value": 5
        },
        {
            "hc-key": "us-nm-047",
            "value": 6
        },
        {
            "hc-key": "us-nm-001",
            "value": 7
        },
        {
            "hc-key": "us-nm-023",
            "value": 8
        },
        {
            "hc-key": "us-nm-013",
            "value": 9
        },
        {
            "hc-key": "us-nm-009",
            "value": 10
        },
        {
            "hc-key": "us-nm-007",
            "value": 11
        },
        {
            "hc-key": "us-nm-025",
            "value": 12
        },
        {
            "hc-key": "us-nm-033",
            "value": 13
        },
        {
            "hc-key": "us-nm-041",
            "value": 14
        },
        {
            "hc-key": "us-nm-011",
            "value": 15
        },
        {
            "hc-key": "us-nm-003",
            "value": 16
        },
        {
            "hc-key": "us-nm-029",
            "value": 17
        },
        {
            "hc-key": "us-nm-017",
            "value": 18
        },
        {
            "hc-key": "us-nm-039",
            "value": 19
        },
        {
            "hc-key": "us-nm-061",
            "value": 20
        },
        {
            "hc-key": "us-nm-055",
            "value": 21
        },
        {
            "hc-key": "us-nm-005",
            "value": 22
        },
        {
            "hc-key": "us-nm-027",
            "value": 23
        },
        {
            "hc-key": "us-nm-053",
            "value": 24
        },
        {
            "hc-key": "us-nm-057",
            "value": 25
        },
        {
            "hc-key": "us-nm-037",
            "value": 26
        },
        {
            "hc-key": "us-nm-021",
            "value": 27
        },
        {
            "hc-key": "us-nm-035",
            "value": 28
        },
        {
            "hc-key": "us-nm-019",
            "value": 29
        },
        {
            "hc-key": "us-nm-059",
            "value": 30
        },
        {
            "hc-key": "us-nm-051",
            "value": 31
        },
        {
            "hc-key": "us-nm-015",
            "value": 32
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-nm-all.js">New Mexico</a>'
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
            mapData: Highcharts.maps['countries/us/us-nm-all'],
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

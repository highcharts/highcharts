$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ut-003",
            "value": 0
        },
        {
            "hc-key": "us-ut-039",
            "value": 1
        },
        {
            "hc-key": "us-ut-027",
            "value": 2
        },
        {
            "hc-key": "us-ut-037",
            "value": 3
        },
        {
            "hc-key": "us-ut-005",
            "value": 4
        },
        {
            "hc-key": "us-ut-055",
            "value": 5
        },
        {
            "hc-key": "us-ut-023",
            "value": 6
        },
        {
            "hc-key": "us-ut-033",
            "value": 7
        },
        {
            "hc-key": "us-ut-013",
            "value": 8
        },
        {
            "hc-key": "us-ut-047",
            "value": 9
        },
        {
            "hc-key": "us-ut-015",
            "value": 10
        },
        {
            "hc-key": "us-ut-049",
            "value": 11
        },
        {
            "hc-key": "us-ut-035",
            "value": 12
        },
        {
            "hc-key": "us-ut-043",
            "value": 13
        },
        {
            "hc-key": "us-ut-041",
            "value": 14
        },
        {
            "hc-key": "us-ut-007",
            "value": 15
        },
        {
            "hc-key": "us-ut-031",
            "value": 16
        },
        {
            "hc-key": "us-ut-009",
            "value": 17
        },
        {
            "hc-key": "us-ut-017",
            "value": 18
        },
        {
            "hc-key": "us-ut-051",
            "value": 19
        },
        {
            "hc-key": "us-ut-001",
            "value": 20
        },
        {
            "hc-key": "us-ut-057",
            "value": 21
        },
        {
            "hc-key": "us-ut-029",
            "value": 22
        },
        {
            "hc-key": "us-ut-053",
            "value": 23
        },
        {
            "hc-key": "us-ut-021",
            "value": 24
        },
        {
            "hc-key": "us-ut-011",
            "value": 25
        },
        {
            "hc-key": "us-ut-025",
            "value": 26
        },
        {
            "hc-key": "us-ut-019",
            "value": 27
        },
        {
            "hc-key": "us-ut-045",
            "value": 28
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ut-all.js">Utah</a>'
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
            mapData: Highcharts.maps['countries/us/us-ut-all'],
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

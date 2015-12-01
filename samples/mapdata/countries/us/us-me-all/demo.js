$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-me-009",
            "value": 0
        },
        {
            "hc-key": "us-me-029",
            "value": 1
        },
        {
            "hc-key": "us-me-013",
            "value": 2
        },
        {
            "hc-key": "us-me-027",
            "value": 3
        },
        {
            "hc-key": "us-me-015",
            "value": 4
        },
        {
            "hc-key": "us-me-019",
            "value": 5
        },
        {
            "hc-key": "us-me-031",
            "value": 6
        },
        {
            "hc-key": "us-me-005",
            "value": 7
        },
        {
            "hc-key": "us-me-025",
            "value": 8
        },
        {
            "hc-key": "us-me-021",
            "value": 9
        },
        {
            "hc-key": "us-me-023",
            "value": 10
        },
        {
            "hc-key": "us-me-001",
            "value": 11
        },
        {
            "hc-key": "us-me-007",
            "value": 12
        },
        {
            "hc-key": "us-me-003",
            "value": 13
        },
        {
            "hc-key": "us-me-011",
            "value": 14
        },
        {
            "hc-key": "us-me-017",
            "value": 15
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-me-all.js">Maine</a>'
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
            mapData: Highcharts.maps['countries/us/us-me-all'],
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

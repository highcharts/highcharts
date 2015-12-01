$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ma-007",
            "value": 0
        },
        {
            "hc-key": "us-ma-019",
            "value": 1
        },
        {
            "hc-key": "us-ma-001",
            "value": 2
        },
        {
            "hc-key": "us-ma-027",
            "value": 3
        },
        {
            "hc-key": "us-ma-015",
            "value": 4
        },
        {
            "hc-key": "us-ma-021",
            "value": 5
        },
        {
            "hc-key": "us-ma-005",
            "value": 6
        },
        {
            "hc-key": "us-ma-023",
            "value": 7
        },
        {
            "hc-key": "us-ma-013",
            "value": 8
        },
        {
            "hc-key": "us-ma-025",
            "value": 9
        },
        {
            "hc-key": "us-ma-009",
            "value": 10
        },
        {
            "hc-key": "us-ma-017",
            "value": 11
        },
        {
            "hc-key": "us-ma-003",
            "value": 12
        },
        {
            "hc-key": "us-ma-011",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ma-all.js">Massachusetts</a>'
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
            mapData: Highcharts.maps['countries/us/us-ma-all'],
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

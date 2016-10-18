$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ri-009",
            "value": 0
        },
        {
            "hc-key": "us-ri-005",
            "value": 1
        },
        {
            "hc-key": "us-ri-007",
            "value": 2
        },
        {
            "hc-key": "us-ri-001",
            "value": 3
        },
        {
            "hc-key": "us-ri-003",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ri-all.js">Rhode Island</a>'
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
            mapData: Highcharts.maps['countries/us/us-ri-all'],
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

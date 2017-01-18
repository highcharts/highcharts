$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-hi-003",
            "value": 0
        },
        {
            "hc-key": "us-hi-007",
            "value": 1
        },
        {
            "hc-key": "us-hi-009",
            "value": 2
        },
        {
            "hc-key": "us-hi-001",
            "value": 3
        },
        {
            "hc-key": "us-hi-005",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-hi-all.js">Hawaii</a>'
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
            mapData: Highcharts.maps['countries/us/us-hi-all'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});

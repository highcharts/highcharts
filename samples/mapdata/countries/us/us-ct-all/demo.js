$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ct-003",
            "value": 0
        },
        {
            "hc-key": "us-ct-009",
            "value": 1
        },
        {
            "hc-key": "us-ct-015",
            "value": 2
        },
        {
            "hc-key": "us-ct-005",
            "value": 3
        },
        {
            "hc-key": "us-ct-001",
            "value": 4
        },
        {
            "hc-key": "us-ct-013",
            "value": 5
        },
        {
            "hc-key": "us-ct-007",
            "value": 6
        },
        {
            "hc-key": "us-ct-011",
            "value": 7
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ct-all.js">Connecticut</a>'
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
            mapData: Highcharts.maps['countries/us/us-ct-all'],
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

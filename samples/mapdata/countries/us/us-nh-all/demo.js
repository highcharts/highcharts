$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-nh-015",
            "value": 0
        },
        {
            "hc-key": "us-nh-013",
            "value": 1
        },
        {
            "hc-key": "us-nh-003",
            "value": 2
        },
        {
            "hc-key": "us-nh-001",
            "value": 3
        },
        {
            "hc-key": "us-nh-009",
            "value": 4
        },
        {
            "hc-key": "us-nh-005",
            "value": 5
        },
        {
            "hc-key": "us-nh-007",
            "value": 6
        },
        {
            "hc-key": "us-nh-017",
            "value": 7
        },
        {
            "hc-key": "us-nh-019",
            "value": 8
        },
        {
            "hc-key": "us-nh-011",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-nh-all.js">New Hampshire</a>'
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
            mapData: Highcharts.maps['countries/us/us-nh-all'],
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

$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-md-047",
            "value": 0
        },
        {
            "hc-key": "us-md-039",
            "value": 1
        },
        {
            "hc-key": "us-md-037",
            "value": 2
        },
        {
            "hc-key": "us-md-019",
            "value": 3
        },
        {
            "hc-key": "us-md-027",
            "value": 4
        },
        {
            "hc-key": "us-md-021",
            "value": 5
        },
        {
            "hc-key": "us-md-031",
            "value": 6
        },
        {
            "hc-key": "us-md-023",
            "value": 7
        },
        {
            "hc-key": "us-md-003",
            "value": 8
        },
        {
            "hc-key": "us-md-033",
            "value": 9
        },
        {
            "hc-key": "us-md-017",
            "value": 10
        },
        {
            "hc-key": "us-md-510",
            "value": 11
        },
        {
            "hc-key": "us-md-005",
            "value": 12
        },
        {
            "hc-key": "us-md-001",
            "value": 13
        },
        {
            "hc-key": "us-md-043",
            "value": 14
        },
        {
            "hc-key": "us-md-035",
            "value": 15
        },
        {
            "hc-key": "us-md-041",
            "value": 16
        },
        {
            "hc-key": "us-md-011",
            "value": 17
        },
        {
            "hc-key": "us-md-045",
            "value": 18
        },
        {
            "hc-key": "us-md-013",
            "value": 19
        },
        {
            "hc-key": "us-md-015",
            "value": 20
        },
        {
            "hc-key": "us-md-029",
            "value": 21
        },
        {
            "hc-key": "us-md-009",
            "value": 22
        },
        {
            "hc-key": "us-md-025",
            "value": 23
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-md-all.js">Maryland</a>'
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
            mapData: Highcharts.maps['countries/us/us-md-all'],
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

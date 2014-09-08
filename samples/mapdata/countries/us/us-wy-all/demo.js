$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-wy-011",
            "value": 0
        },
        {
            "hc-key": "us-wy-023",
            "value": 1
        },
        {
            "hc-key": "us-wy-037",
            "value": 2
        },
        {
            "hc-key": "us-wy-039",
            "value": 3
        },
        {
            "hc-key": "us-wy-005",
            "value": 4
        },
        {
            "hc-key": "us-wy-027",
            "value": 5
        },
        {
            "hc-key": "us-wy-009",
            "value": 6
        },
        {
            "hc-key": "us-wy-045",
            "value": 7
        },
        {
            "hc-key": "us-wy-031",
            "value": 8
        },
        {
            "hc-key": "us-wy-021",
            "value": 9
        },
        {
            "hc-key": "us-wy-019",
            "value": 10
        },
        {
            "hc-key": "us-wy-043",
            "value": 11
        },
        {
            "hc-key": "us-wy-033",
            "value": 12
        },
        {
            "hc-key": "us-wy-029",
            "value": 13
        },
        {
            "hc-key": "us-wy-013",
            "value": 14
        },
        {
            "hc-key": "us-wy-001",
            "value": 15
        },
        {
            "hc-key": "us-wy-007",
            "value": 16
        },
        {
            "hc-key": "us-wy-035",
            "value": 17
        },
        {
            "hc-key": "us-wy-041",
            "value": 18
        },
        {
            "hc-key": "us-wy-025",
            "value": 19
        },
        {
            "hc-key": "us-wy-015",
            "value": 20
        },
        {
            "hc-key": "us-wy-017",
            "value": 21
        },
        {
            "hc-key": "us-wy-003",
            "value": 22
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-wy-all.js">Wyoming</a>'
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
            mapData: Highcharts.maps['countries/us/us-wy-all'],
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

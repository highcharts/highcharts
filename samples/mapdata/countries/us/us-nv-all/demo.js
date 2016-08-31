$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-nv-005",
            "value": 0
        },
        {
            "hc-key": "us-nv-013",
            "value": 1
        },
        {
            "hc-key": "us-nv-021",
            "value": 2
        },
        {
            "hc-key": "us-nv-023",
            "value": 3
        },
        {
            "hc-key": "us-nv-011",
            "value": 4
        },
        {
            "hc-key": "us-nv-017",
            "value": 5
        },
        {
            "hc-key": "us-nv-003",
            "value": 6
        },
        {
            "hc-key": "us-nv-015",
            "value": 7
        },
        {
            "hc-key": "us-nv-027",
            "value": 8
        },
        {
            "hc-key": "us-nv-007",
            "value": 9
        },
        {
            "hc-key": "us-nv-510",
            "value": 10
        },
        {
            "hc-key": "us-nv-019",
            "value": 11
        },
        {
            "hc-key": "us-nv-029",
            "value": 12
        },
        {
            "hc-key": "us-nv-033",
            "value": 13
        },
        {
            "hc-key": "us-nv-009",
            "value": 14
        },
        {
            "hc-key": "us-nv-031",
            "value": 15
        },
        {
            "hc-key": "us-nv-001",
            "value": 16
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-nv-all.js">Nevada</a>'
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
            mapData: Highcharts.maps['countries/us/us-nv-all'],
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

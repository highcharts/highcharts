$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-nj-029",
            "value": 0
        },
        {
            "hc-key": "us-nj-001",
            "value": 1
        },
        {
            "hc-key": "us-nj-005",
            "value": 2
        },
        {
            "hc-key": "us-nj-025",
            "value": 3
        },
        {
            "hc-key": "us-nj-009",
            "value": 4
        },
        {
            "hc-key": "us-nj-031",
            "value": 5
        },
        {
            "hc-key": "us-nj-019",
            "value": 6
        },
        {
            "hc-key": "us-nj-039",
            "value": 7
        },
        {
            "hc-key": "us-nj-017",
            "value": 8
        },
        {
            "hc-key": "us-nj-041",
            "value": 9
        },
        {
            "hc-key": "us-nj-011",
            "value": 10
        },
        {
            "hc-key": "us-nj-033",
            "value": 11
        },
        {
            "hc-key": "us-nj-037",
            "value": 12
        },
        {
            "hc-key": "us-nj-035",
            "value": 13
        },
        {
            "hc-key": "us-nj-027",
            "value": 14
        },
        {
            "hc-key": "us-nj-023",
            "value": 15
        },
        {
            "hc-key": "us-nj-015",
            "value": 16
        },
        {
            "hc-key": "us-nj-007",
            "value": 17
        },
        {
            "hc-key": "us-nj-013",
            "value": 18
        },
        {
            "hc-key": "us-nj-003",
            "value": 19
        },
        {
            "hc-key": "us-nj-021",
            "value": 20
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-nj-all.js">New Jersey</a>'
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
            mapData: Highcharts.maps['countries/us/us-nj-all'],
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

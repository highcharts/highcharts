$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ci-sc",
            "value": 0
        },
        {
            "hc-key": "ci-3397",
            "value": 1
        },
        {
            "hc-key": "ci-de",
            "value": 2
        },
        {
            "hc-key": "ci-bf",
            "value": 3
        },
        {
            "hc-key": "ci-ba",
            "value": 4
        },
        {
            "hc-key": "ci-wr",
            "value": 5
        },
        {
            "hc-key": "ci-zu",
            "value": 6
        },
        {
            "hc-key": "ci-fr",
            "value": 7
        },
        {
            "hc-key": "ci-3404",
            "value": 8
        },
        {
            "hc-key": "ci-la",
            "value": 9
        },
        {
            "hc-key": "ci-so",
            "value": 10
        },
        {
            "hc-key": "ci-za",
            "value": 11
        },
        {
            "hc-key": "ci-vb",
            "value": 12
        },
        {
            "hc-key": "ci-av",
            "value": 13
        },
        {
            "hc-key": "ci-bg",
            "value": 14
        },
        {
            "hc-key": "ci-ab",
            "value": 15
        },
        {
            "hc-key": "ci-3412",
            "value": 16
        },
        {
            "hc-key": "ci-3413",
            "value": 17
        },
        {
            "hc-key": "ci-tm",
            "value": 18
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ci/ci-all.js">Ivory Coast</a>'
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
            mapData: Highcharts.maps['countries/ci/ci-all'],
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

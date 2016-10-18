$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "jm-ha",
            "value": 0
        },
        {
            "hc-key": "jm-ma",
            "value": 1
        },
        {
            "hc-key": "jm-se",
            "value": 2
        },
        {
            "hc-key": "jm-sj",
            "value": 3
        },
        {
            "hc-key": "jm-tr",
            "value": 4
        },
        {
            "hc-key": "jm-we",
            "value": 5
        },
        {
            "hc-key": "jm-ki",
            "value": 6
        },
        {
            "hc-key": "jm-po",
            "value": 7
        },
        {
            "hc-key": "jm-sn",
            "value": 8
        },
        {
            "hc-key": "jm-sc",
            "value": 9
        },
        {
            "hc-key": "jm-sm",
            "value": 10
        },
        {
            "hc-key": "jm-sd",
            "value": 11
        },
        {
            "hc-key": "jm-st",
            "value": 12
        },
        {
            "hc-key": "jm-cl",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/jm/jm-all.js">Jamaica</a>'
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
            mapData: Highcharts.maps['countries/jm/jm-all'],
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

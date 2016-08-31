$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "lr-gp",
            "value": 0
        },
        {
            "hc-key": "lr-bg",
            "value": 1
        },
        {
            "hc-key": "lr-586",
            "value": 2
        },
        {
            "hc-key": "lr-cm",
            "value": 3
        },
        {
            "hc-key": "lr-lf",
            "value": 4
        },
        {
            "hc-key": "lr-mo",
            "value": 5
        },
        {
            "hc-key": "lr-mg",
            "value": 6
        },
        {
            "hc-key": "lr-ni",
            "value": 7
        },
        {
            "hc-key": "lr-ri",
            "value": 8
        },
        {
            "hc-key": "lr-gd",
            "value": 9
        },
        {
            "hc-key": "lr-si",
            "value": 10
        },
        {
            "hc-key": "lr-rg",
            "value": 11
        },
        {
            "hc-key": "lr-gk",
            "value": 12
        },
        {
            "hc-key": "lr-my",
            "value": 13
        },
        {
            "hc-key": "lr-bm",
            "value": 14
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/lr/lr-all.js">Liberia</a>'
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
            mapData: Highcharts.maps['countries/lr/lr-all'],
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

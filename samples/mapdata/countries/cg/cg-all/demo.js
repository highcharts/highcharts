$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "cg-ni",
            "value": 0
        },
        {
            "hc-key": "cg-pl",
            "value": 1
        },
        {
            "hc-key": "cg-br",
            "value": 2
        },
        {
            "hc-key": "cg-7280",
            "value": 3
        },
        {
            "hc-key": "cg-bo",
            "value": 4
        },
        {
            "hc-key": "cg-li",
            "value": 5
        },
        {
            "hc-key": "cg-sa",
            "value": 6
        },
        {
            "hc-key": "cg-cu",
            "value": 7
        },
        {
            "hc-key": "cg-po",
            "value": 8
        },
        {
            "hc-key": "cg-co",
            "value": 9
        },
        {
            "hc-key": "cg-ko",
            "value": 10
        },
        {
            "hc-key": "cg-le",
            "value": 11
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/cg/cg-all.js">Republic of the Congo</a>'
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
            mapData: Highcharts.maps['countries/cg/cg-all'],
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

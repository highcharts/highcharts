$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "is-ne",
            "value": 0
        },
        {
            "hc-key": "is-sl",
            "value": 1
        },
        {
            "hc-key": "is-su",
            "value": 2
        },
        {
            "hc-key": "is-ho",
            "value": 3
        },
        {
            "hc-key": "is-6642",
            "value": 4
        },
        {
            "hc-key": "is-vf",
            "value": 5
        },
        {
            "hc-key": "is-al",
            "value": 6
        },
        {
            "hc-key": "is-vl",
            "value": 7
        },
        {
            "hc-key": "is-nv",
            "value": 8
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/is/is-all.js">Iceland</a>'
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
            mapData: Highcharts.maps['countries/is/is-all'],
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

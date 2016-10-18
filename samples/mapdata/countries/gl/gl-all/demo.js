$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gl-3278",
            "value": 0
        },
        {
            "hc-key": "gl-3274",
            "value": 1
        },
        {
            "hc-key": "gl-3297",
            "value": 2
        },
        {
            "hc-key": "gl-2728",
            "value": 3
        },
        {
            "hc-key": "gl-3282",
            "value": 4
        },
        {
            "hc-key": "gl-3298",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/gl/gl-all.js">Greenland</a>'
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
            mapData: Highcharts.maps['countries/gl/gl-all'],
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

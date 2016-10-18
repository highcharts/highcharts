$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gd-6584",
            "value": 0
        },
        {
            "hc-key": "gd-3660",
            "value": 1
        },
        {
            "hc-key": "gd-6583",
            "value": 2
        },
        {
            "hc-key": "gd-6582",
            "value": 3
        },
        {
            "hc-key": "gd-6581",
            "value": 4
        },
        {
            "hc-key": "gd-6580",
            "value": 5
        },
        {
            "hc-key": "gd-6579",
            "value": 6
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/gd/gd-all.js">Grenada</a>'
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
            mapData: Highcharts.maps['countries/gd/gd-all'],
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

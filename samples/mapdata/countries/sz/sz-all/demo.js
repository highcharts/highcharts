$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "sz-lu",
            "value": 0
        },
        {
            "hc-key": "sz-hh",
            "value": 1
        },
        {
            "hc-key": "sz-ma",
            "value": 2
        },
        {
            "hc-key": "sz-sh",
            "value": 3
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/sz/sz-all.js">Swaziland</a>'
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
            mapData: Highcharts.maps['countries/sz/sz-all'],
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

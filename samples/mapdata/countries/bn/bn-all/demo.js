$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "bn-te",
            "value": 0
        },
        {
            "hc-key": "bn-be",
            "value": 1
        },
        {
            "hc-key": "bn-bm",
            "value": 2
        },
        {
            "hc-key": "bn-tu",
            "value": 3
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/bn/bn-all.js">Brunei</a>'
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
            mapData: Highcharts.maps['countries/bn/bn-all'],
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

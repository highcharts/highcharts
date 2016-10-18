$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "mp-ro",
            "value": 0
        },
        {
            "hc-key": "mp-ti",
            "value": 1
        },
        {
            "hc-key": "mp-sa",
            "value": 2
        },
        {
            "hc-key": "mp-ni",
            "value": 3
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/mp/mp-all.js">Northern Mariana Islands</a>'
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
            mapData: Highcharts.maps['countries/mp/mp-all'],
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

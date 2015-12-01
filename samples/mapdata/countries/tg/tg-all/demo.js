$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "tg-ma",
            "value": 0
        },
        {
            "hc-key": "tg-ka",
            "value": 1
        },
        {
            "hc-key": "tg-ce",
            "value": 2
        },
        {
            "hc-key": "tg-sa",
            "value": 3
        },
        {
            "hc-key": "tg-pl",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/tg/tg-all.js">Togo</a>'
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
            mapData: Highcharts.maps['countries/tg/tg-all'],
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

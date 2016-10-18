$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ml-6392",
            "value": 0
        },
        {
            "hc-key": "ml-tb",
            "value": 1
        },
        {
            "hc-key": "ml-kd",
            "value": 2
        },
        {
            "hc-key": "ml-ga",
            "value": 3
        },
        {
            "hc-key": "ml-ky",
            "value": 4
        },
        {
            "hc-key": "ml-sk",
            "value": 5
        },
        {
            "hc-key": "ml-mo",
            "value": 6
        },
        {
            "hc-key": "ml-sg",
            "value": 7
        },
        {
            "hc-key": "ml-kk",
            "value": 8
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ml/ml-all.js">Mali</a>'
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
            mapData: Highcharts.maps['countries/ml/ml-all'],
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

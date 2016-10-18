$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "by-hm",
            "value": 0
        },
        {
            "hc-key": "by-br",
            "value": 1
        },
        {
            "hc-key": "by-ho",
            "value": 2
        },
        {
            "hc-key": "by-vi",
            "value": 3
        },
        {
            "hc-key": "by-hr",
            "value": 4
        },
        {
            "hc-key": "by-ma",
            "value": 5
        },
        {
            "hc-key": "by-mi",
            "value": 6
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/by/by-all.js">Belarus</a>'
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
            mapData: Highcharts.maps['countries/by/by-all'],
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

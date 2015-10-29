$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "dk",
            "value": 0
        },
        {
            "hc-key": "fo",
            "value": 1
        },
        {
            "hc-key": "gl",
            "value": 2
        },
        {
            "hc-key": "fi",
            "value": 3
        },
        {
            "hc-key": "se",
            "value": 4
        },
        {
            "hc-key": "no",
            "value": 5
        },
        {
            "hc-key": "is",
            "value": 6
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/nordic-countries.js">Nordic Countries</a>'
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
            mapData: Highcharts.maps['custom/nordic-countries'],
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

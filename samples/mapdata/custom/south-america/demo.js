$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "br",
            "value": 0
        },
        {
            "hc-key": "ec",
            "value": 1
        },
        {
            "hc-key": "ve",
            "value": 2
        },
        {
            "hc-key": "cl",
            "value": 3
        },
        {
            "hc-key": "ar",
            "value": 4
        },
        {
            "hc-key": "pe",
            "value": 5
        },
        {
            "hc-key": "uy",
            "value": 6
        },
        {
            "hc-key": "py",
            "value": 7
        },
        {
            "hc-key": "bo",
            "value": 8
        },
        {
            "hc-key": "sr",
            "value": 9
        },
        {
            "hc-key": "gy",
            "value": 10
        },
        {
            "hc-key": "gb",
            "value": 11
        },
        {
            "hc-key": "co",
            "value": 12
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/south-america.js">South America</a>'
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
            mapData: Highcharts.maps['custom/south-america'],
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

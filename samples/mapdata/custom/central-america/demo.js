$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "hn",
            "value": 0
        },
        {
            "hc-key": "pa",
            "value": 1
        },
        {
            "hc-key": "cr",
            "value": 2
        },
        {
            "hc-key": "bz",
            "value": 3
        },
        {
            "hc-key": "ni",
            "value": 4
        },
        {
            "hc-key": "gt",
            "value": 5
        },
        {
            "hc-key": "sv",
            "value": 6
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/custom/central-america.js">Central America</a>'
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
            mapData: Highcharts.maps['custom/central-america'],
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
